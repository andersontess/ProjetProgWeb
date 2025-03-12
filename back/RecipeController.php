<?php

class Recipe {
    private $dataFile = __DIR__ . "/data/recipes.json";


    public function handleGetRecipeRequest () {
		// Ensure the correct Content-Type header
		if ($_SERVER['CONTENT_TYPE'] !== 'application/x-www-form-urlencoded') {
			http_response_code(400);
			echo json_encode(['error' => 'Invalid Content-Type header']);
			return;
		}

		// Validate and sanitize form data
		$searchedRecipe = filter_input(INPUT_POST, 'searchedRecipe', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
		

		if (!$searchedRecipe) {
			http_response_code(400);
			echo json_encode(['error' => 'Missing required fields. Fields' . $searchedRecipe]);
			return;
		}


		// Return the updated list of comments
		http_response_code(200);
		header('Content-Type: application/json');
		echo json_encode($this->getRecipesFromSearch($searchedRecipe));
	}


	public function getRecipesFromSearch (string $searchedRecipe) : array {
		

	}

}	
?>