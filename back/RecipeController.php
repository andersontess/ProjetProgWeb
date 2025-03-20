<?php

class RecipeController
{
	private string $filePath;
	private AuthController $authController;

	public function __construct(string $filePath, AuthController $authController)
	{
		$this->filePath = $filePath;
		$this->authController = $authController;
	}

	public function getAllRecipes(): array
	{
		if (!file_exists($this->filePath)) {
			return [];
		}

		$jsonData = file_get_contents($this->filePath);
		$recipes = json_decode($jsonData, true);

		return is_array($recipes) ? $recipes : [];
	}

	public function handleGetAllRecipes () {
		// Ensure the correct Content-Type header
		if ($_SERVER['CONTENT_TYPE'] !== 'application/x-www-form-urlencoded') {
			http_response_code(400);
			echo json_encode(['error' => 'Invalid Content-Type header']);
			return;
		}
		echo json_encode($this->getAllRecipes());
	}

	// Handles when you click on a recipe
	public function handleSearchRecipe(string $query) {
    if (!file_exists($this->filePath)) {
        return http_response_code(404);
    }

    $jsonData = file_get_contents($this->filePath);
    $recipes = json_decode($jsonData, true);

    if (!is_array($recipes)) {
        return http_response_code(500);
	}
    $query = strtolower($query);
    $matchingRecipes = array_filter($recipes, function ($recipe) use ($query) {
		echo $query;
        return strpos(strtolower($recipe['name']), $query) !== false;
    });

    return $matchingRecipes; // Send results as JSON
	}	
}