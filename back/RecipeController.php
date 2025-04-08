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

	public function handleSearchRecipe(array $params)
	{
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

	public function getOmnivoresRecipes(){
		$jsonData = $this-> getAllRecipes();

		$OmnivoresRecipes = array_filter($jsonData, function($recipe){
			//On vérifie que Without existe PUIS vérifie que c'est bien un tableau PUIS on regarde s'il y a Vegan dedans
			return isset($recipe['Without']) && is_array($recipe['Without']) && in_array('Omnivore', $recipe['Without']);
		});

		$OmnivoresRecipes = array_values($OmnivoresRecipes);

		http_response_code(200);
		header('Content-Type: application/json');
		echo json_encode($OmnivoresRecipes);
	}

	public function getVegetarianRecipes(){
		$jsonData = $this-> getAllRecipes();

		$VegeRecipes = array_filter($jsonData, function($recipe){
			//On vérifie que Without existe PUIS vérifie que c'est bien un tableau PUIS on regarde s'il y a Vegan dedans
			return isset($recipe['Without']) && is_array($recipe['Without']) && in_array('Vegetarian', $recipe['Without']);
		});

		$VegeRecipes = array_values($VegeRecipes);

		http_response_code(200);
		header('Content-Type: application/json');
		echo json_encode($VegeRecipes);
	}

	public function getVeganRecipes(){
		$jsonData = $this-> getAllRecipes();

		$veganRecipes = array_filter($jsonData, function($recipe){
			//On vérifie que Without existe PUIS vérifie que c'est bien un tableau PUIS on regarde s'il y a Vegan dedans
			return isset($recipe['Without']) && is_array($recipe['Without']) && in_array('Vegan', $recipe['Without']);
		});

		$veganRecipes = array_values($veganRecipes);

		http_response_code(200);
		header('Content-Type: application/json');
		echo json_encode($veganRecipes);
	}
}