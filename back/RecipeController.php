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

	public function handleGetAllRecipes(array $params)
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

	// Handles when you click on a recipe
	public function handleSearchRecipe(string $query)
	{
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
