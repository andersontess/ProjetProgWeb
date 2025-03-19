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
	public function handleConsultRecipe() 
	{
		if (!file_exists($this->filePath)) {
			return http_response_code(404);
		}

		$jsonData = file_get_contents($this->filePath);
		$recipes = json_decode($jsonData, true);


	}
}
