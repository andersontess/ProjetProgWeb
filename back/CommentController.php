<?php

class CommentController // manages comments and likes.
{
	private string $filePath;
	private AuthController $authController;

	public function __construct(string $filePath, AuthController $authController)
	{
		$this->filePath = $filePath;
		$this->authController = $authController;
	}

	// Retrieves all comments from the file
	private function getAllComments(): array
	{
		if (!file_exists($this->filePath)) {
			return [];
		}

		$content = file_get_contents($this->filePath);
		return json_decode($content, true) ?? [];
	}

	// Handles the POST /comment route
	public function handlePostCommentRequest(): void
	{
		// Ensure the correct Content-Type header
		if ($_SERVER['CONTENT_TYPE'] !== 'application/x-www-form-urlencoded') {
			http_response_code(400);
			echo json_encode(['error' => 'Invalid Content-Type header']);
			return;
		}

		// Validate and sanitize form data
		$idrecipe = filter_input(INPUT_POST, 'idrecipe', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
		$firstname = filter_input(INPUT_POST, 'firstname', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
		$lastname = filter_input(INPUT_POST, 'lastname', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
		$message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

		if (!$idrecipe || $firstname || !$lastname || !$message) {
			http_response_code(400);
			echo json_encode(['error' => 'Missing required fields. Fields' . $firstname . $lastname . $message]);
			return;
		}

		// Create a new comment
		$newComment = [
			'firstname' => $firstname,
			'lastname' => $lastname,
			'message' => $message,
			'timestamp' => date('c'),
		];

		// Save the comment
		$this->saveComment($idrecipe, $newComment);

		// Return the updated list of comments
		http_response_code(200);
		header('Content-Type: application/json');
		echo json_encode($this->getAllComments());
	}

	// Saves a new comment to the file
	private function saveComment(string $recipeId,array $comment): void
	{
		$comments = $this->getAllComments();
		
		//S'il y a pas de commentaikre (ici d'id) on crée un tableau
		if(!isset($comments[$recipeId])){
			$comments[$recipeId] = [];
		}
		
		$comments[$recipeId][] = $comment;

		file_put_contents($this->filePath, json_encode($comments, JSON_PRETTY_PRINT));
	}

	public function handleGetCommentsRequest(): void
	{
		http_response_code(200);
		header('Content-Type: application/json');
		echo json_encode($this->getAllComments());
	}

	public function handleDeleteCommentRequest(): void
	{
		$email = $this->authController->validateAuth();
		if (!$email) {
			http_response_code(401);
			echo json_encode(['error' => 'Unauthorized']);
			return;
		}

		file_put_contents($this->filePath, json_encode([]));

		http_response_code(200);
		echo json_encode(['message' => 'All comments deleted']);
	}
}


