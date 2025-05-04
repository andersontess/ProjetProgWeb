<?php

class RecipeController {
	private string $filePath;
	private AuthController $authController;

	public function __construct(string $filePath, AuthController $authController)
	{
		$this->filePath = $filePath;
		$this->authController = $authController;
	}

	public function getAllRecipes(): array {
		if (!file_exists($this->filePath)) {
			return []; 
		}
	
		$jsonData = file_get_contents($this->filePath);
		$recipes = json_decode($jsonData, true); 
	
		return is_array($recipes) ? $recipes : [];
	}

	public function handleSearchRecipe(array $params = []) // make param optional
	{
		if (empty($params)) {
			$params = $_GET; // fallback to query string
		}

		$jsonData = $this->getAllRecipes();
		$search = $params['search'] ?? null;

		if ($search) {
			$jsonData = array_filter($jsonData, function ($recipe) use ($search) {
				return strpos(strtolower($recipe['name']), strtolower($search)) !== false;
			});
		}

		http_response_code(200);
		header('Content-Type: application/json');
		echo json_encode($jsonData);
	}

	// Handles clicking on a recipe to consult it
    public function handleConsultRecipe(array $recipe_id) {

        header("Content-Type: application/json");
		$recipes = $this->getAllRecipes();
		
        foreach ($recipes as $recipe) {
            if ($recipe['id'] === $recipe_id['recipe_id']) {
                echo json_encode($recipe);
                return;
            }
        }

        http_response_code(404);
        echo json_encode(['error' => 'Recipe not found']);
    }

	public function getRecipesByType(){
		$jsonData = $this-> getAllRecipes();

		$omnivoresRecipes = array_filter($jsonData, function($recipe){
			//On vérifie que Without existe PUIS vérifie que c'est bien un tableau PUIS on regarde s'il y a Vegan dedans
			return isset($recipe['Without']) && is_array($recipe['Without']) && in_array('Omnivore', $recipe['Without']);
		});

		$vegeRecipes = array_filter($jsonData, function($recipe){
			//On vérifie que Without existe PUIS vérifie que c'est bien un tableau PUIS on regarde s'il y a Vegan dedans
			return isset($recipe['Without']) && is_array($recipe['Without']) && in_array('Vegetarian', $recipe['Without']);
		});

		$veganRecipes = array_filter($jsonData, function($recipe){
			//On vérifie que Without existe PUIS vérifie que c'est bien un tableau PUIS on regarde s'il y a Vegan dedans
			return isset($recipe['Without']) && is_array($recipe['Without']) && in_array('Vegan', $recipe['Without']);
		});

		$omnivoresRecipes = array_values($omnivoresRecipes);
		$vegeRecipes = array_values($vegeRecipes);
		$veganRecipes = array_values($veganRecipes);

		$recettes = [
			'Omnivores' => $omnivoresRecipes,
			'Végétarien' => $vegeRecipes,
			'Vegan' => $veganRecipes
		];

		http_response_code(200);
		header('Content-Type: application/json');
		echo json_encode($recettes);
	}

	public function handleTranslateRecipe(){
		// Ensure the correct Content-Type header
		if ($_SERVER['CONTENT_TYPE'] !== 'application/x-www-form-urlencoded') {
			http_response_code(400);
			echo json_encode(['error' => 'Invalid Content-Type header']);
			return;
		}

		// Validate and sanitize form data
		$sanitized = [];
		foreach ($_POST as $key => $value){
			$sanitized[$key] = filter_var($value, FILTER_SANITIZE_FULL_SPECIAL_CHARS); 
		}
		
		// Add translation
		$recipes = $this->getAllRecipes();
		$found = false;

		foreach ($recipes as &$recipe) {
			if ($recipe['id'] === $sanitized['idrecipe']) {
				$found=true;

				if (isset($sanitized['nameFR'])){
					$recipe['nameFR'] = $sanitized['nameFR'];
				}
		
				if (isset($sanitized['descriptionFR'])){
					$recipe['descriptionFR'] = $sanitized['descriptionFR'];
				}
		
				foreach ($sanitized as $key => $value){
					if (preg_match('/^ingredientFR-(name|type|quantity)(\d+)$/', $key, $matches)) {
						$field = $matches[1];
						$index = $matches[2];
						
						//S'il existe pas ingredients on le crée
						if (!isset($recipe['ingredientsFR'][$index])) {
							$recipe['ingredientsFR'][$index] = [
								'name' => '',
								'type' => '',
								'quantity' => '',
								'imageIng' => $recipe['ingredients'][$index]['imageIng'] ?? ''
							];
						}
		
						$recipe['ingredientsFR'][$index][$field] = $value;
					}
				}
		
				foreach ($sanitized as $key => $value){
					if (preg_match('/^stepsFR(\d+)$/', $key, $matches)) {
						$index = $matches[1];
						$recipe['stepsFR'][$index] = $value;
					}
				}
				break;
			}
		}

		// Si aucune recette n'est trouvée
		if (!$found) {
			http_response_code(404);
			echo json_encode(['error' => 'Recette non trouvée avec cet ID']);
			return;
		}
		
		// Écriture du fichier après la modif
		file_put_contents($this->filePath, json_encode($recipes, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
		http_response_code(200);
		echo json_encode(['redirect'=>'index.html']);
	}
	
	public function handleLikeRecipe(){
		if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
			http_response_code(405);
			echo json_encode(['error' => 'Method Not Allowed']);
			return;
		}

		//Récupérer toutes les données utiles 
		$recipes = $this->getAllRecipes();
		$rawData = file_get_contents("php://input");
		$data = json_decode($rawData, true);
		$userId = $_SESSION['id'];

		if (!isset($userId) || !isset($data['recipeId'])) {
			http_response_code(400);
			echo json_encode(['error' => 'Missing data sent']);
			exit;
		}


 		//S'il existe pas ingredients on le crée
		$found = false;
		foreach ($recipes as &$recipe) {
			//On vérifie que la clé id existe, puis qu'elle correspond à notre id reçu
			if (isset($recipe['id']) && $recipe['id'] == $data['recipeId']){
				$found = true;
				
				//On vérifie que la clé "likes" existe
				if (!isset($recipe['likes']) || !is_array($recipe['likes'])){
					$recipe['likes'] = [];
				}

				//On ajoute l'userId s'il n'est pas déjà présent
				if (!in_array($userId, $recipe['likes'])){
					$recipe['likes'][] = $userId;
				}
				break;
			}

		} 

		if (!$found) {
			http_response_code(404);
			echo json_encode(['error' => 'Recipe ID Not EXIST']);
			exit;
		}

		// Sauvegarde des modifications dans le fichier JSON
		file_put_contents($this->filePath, json_encode($recipes, JSON_PRETTY_PRINT));
		http_response_code(200);
		echo json_encode(['message' => 'Recette ajouté dans les favoris !']);
	}

	public function handleDeleteLikeRecipe(){
		if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
			http_response_code(405);
			echo json_encode(['error' => 'Method Not Allowed']);
			return;
		}
	
		//Récupérer toutes les données utiles 
		$recipes = $this->getAllRecipes();
		$rawData = file_get_contents("php://input");
		$data = json_decode($rawData, true);
		$userId = $_SESSION['id'];

		if (!isset($userId) || !isset($data['recipeId'])) {
			http_response_code(400);
			echo json_encode(['error' => 'Missing data sent']);
			exit;
		}

		$found = false;
		foreach ($recipes as &$recipe) {
			if (isset($recipe['id']) && $recipe['id'] == $data['recipeId']){
				$found = true;

				//On vérifie que la clé "likes" existe
				if (!isset($recipe['likes']) || !is_array($recipe['likes'])){
					http_response_code(404);
					echo json_encode(['error' => 'This recipe has no like']);
					exit;
				}

				if (($key = array_search($userId, $recipe['likes'])) !== false) {
					unset($recipe['likes'][$key]);
					// Réindexe le tableau
					$recipe['likes'] = array_values($recipe['likes']);
				}
				break;
			}
		}
		
		// Recette non trouvée
		if (!$found) {
			http_response_code(404);
			echo json_encode(['error' => 'Recipe ID Not EXIST']);
			exit;
		}
		
		file_put_contents($this->filePath, json_encode($recipes, JSON_PRETTY_PRINT));
		http_response_code(200);
		echo json_encode(['message' => 'Recette enlevé des favoris !']);
	}

	public function handleRecipesLiked(){
		if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
			http_response_code(405);
			echo json_encode(['error' => 'Method Not Allowed']);
			return;
		}

		//Récupérer toutes les données utiles 
		$recipes = $this->getAllRecipes();
		$userId = $_SESSION["id"];

		$likedRecipes = [];
		foreach($recipes as $recipe){
			if(isset($recipe['likes']) && is_array($recipe['likes']) && in_array($userId, $recipe['likes'])) {
				$likedRecipes[] = $recipe;
			}
		}
		
		http_response_code(200);
		echo json_encode($likedRecipes);
	}

	public function handleRecipesCreated(){
		if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
			http_response_code(405);
			echo json_encode(['error' => 'Method Not Allowed']);
			return;
		}

		//Les données utiles pour le traitement
		$recipes = $this->getAllRecipes();
		$userId = $_SESSION["id"];
		$createdRecipes=[];

		foreach($recipes as $recipe){
			if(isset($recipe['idAuthor']) && $recipe['idAuthor']==$userId) {
				$createdRecipes[] = $recipe;
			}
		}

		http_response_code(200);
		echo json_encode($createdRecipes);
	}

	public function handlePostRecipe(){
		// Vérification de la méthode de la requête
		if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
			http_response_code(405);
			echo json_encode(['error' => 'Method Not Allowed']);
			return;
		}

		//Vérification du contentenu de la requête
		if ($_SERVER['CONTENT_TYPE'] !== 'application/x-www-form-urlencoded') {
			http_response_code(400);
			echo json_encode(['error' => 'Invalid Content-Type header']);
			return;
		}

		// Les identifiants
		$id = $this->authController->generateUuid();
		$idAuthor = $_SESSION['id'];

		// Recette en Anglais
		$name = $_POST['name'];
		$description = $_POST['description'];
		$without = $_POST['without'] ?? [];

		$ingredients = [];
		if (isset($_POST['ingredients'])) {
			foreach ($_POST['ingredients'] as $ingredient) {
				//On supprime les espaces ou autres caractères du genre \t pour tabulation
				$quantity = trim($ingredient['quantity'] ?? '');
				$name = trim($ingredient['name'] ?? '');
				$type = trim($ingredient['type'] ?? '');
		
				// On garde que les ingrédeients non vides
				if ($quantity !== '' || $name !== '' || $type !== '') {
					$ingredients[] = [
						'quantity' => $quantity,
						'name' => $name,
						'type' => $type
					];
				}
			}
		}

		$steps = [];
		$timers = [];
		if (isset($_POST['steps'])) {
			foreach ($_POST['steps'] as $step) {
				$steps[] = $step['instruction'] ?? '';
				$timers[] = isset($step['timers']) ? (int)$step['timers'] : 0;
			}
		}

		// Recette en Français
		$nameFR = $_POST['nameFR'];
		$descriptionFR = $_POST['descriptionFR'];

		$ingredientsFR = [];
		if (isset($_POST['ingredientsFR'])) {
			foreach ($_POST['ingredientsFR'] as $ingredient) {
				//On supprime les espaces ou autres caractères du genre \t pour tabulation
				$quantity = trim($ingredient['quantity'] ?? '');
				$name = trim($ingredient['name'] ?? '');
				$type = trim($ingredient['type'] ?? '');
		
				// On garde que les ingrédeients non vides
				if ($quantity !== '' || $name !== '' || $type !== '') {
					$ingredients[] = [
						'quantity' => $quantity,
						'name' => $name,
						'type' => $type
					];
				}
			}
		}

		$stepsFR = [];
		if (isset($_POST['stepsFR'])) {
			foreach ($_POST['stepsFR'] as $step) {
				$stepsFR[] = $step['instruction'] ?? '';
			}
		}

		// Construction finale de la recette
		$recette = [
			'id' => $id,
			'idAuthor' => $idAuthor,
			'name' => $name,
			'nameFR' => $nameFR,
			'description' => $description,
			'descriptionFR' => $descriptionFR,
			'without' => $without,
			'ingredients' => $ingredients,
			'ingredientsFR' => $ingredientsFR,
			'steps' => $steps,
			'stepsFR' => $stepsFR,
			'timers' => $timers
		];

		$recipes = $this->getAllRecipes();
		$recipes[] = $recette;

		file_put_contents($this->filePath, json_encode($recipes, JSON_PRETTY_PRINT));
		http_response_code(200);
		echo json_encode(['message' => 'Recette ajouté !']);
	}
}