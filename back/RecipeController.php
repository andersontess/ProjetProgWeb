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
}