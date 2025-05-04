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
		if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
			http_response_code(405);
			echo json_encode(['error' => 'Method Not Allowed']);
			return;
		}

		// Make sure Content-Type is multipart/form-data to accept images
		if (strpos($_SERVER['CONTENT_TYPE'], 'multipart/form-data') === false) {
			http_response_code(400);
			echo json_encode(['error' => 'Content-Type must be multipart/form-data']);
			return;
		}

		// Retrieve form fields
		$idrecipe = filter_input(INPUT_POST, 'idrecipe', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
		$firstname = filter_input(INPUT_POST, 'firstname', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
		$lastname = filter_input(INPUT_POST, 'lastname', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
		$message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

		if (!$idrecipe || !$firstname || !$lastname || !$message) {
			http_response_code(400);
			echo json_encode(['error' => 'Missing required fields.']);
			return;
		}

		// Handle optional image upload
		$imageUrl = null;
		if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
			$uploadDir = __DIR__ . '/front/img/comments/';
			if (!file_exists($uploadDir)) {
				mkdir($uploadDir, 0777, true); // create directory if not exists
			}

			$fileTmp = $_FILES['image']['tmp_name'];
			$fileName = uniqid() . "_" . basename($_FILES['image']['name']);
			$targetPath = $uploadDir . $fileName;

			if (move_uploaded_file($fileTmp, $targetPath)) {
				// Image uploaded successfully
				$imageUrl = "/front/img/comments/" . $fileName;
			} else {
				http_response_code(500);
				echo json_encode(['error' => 'Failed to upload image']);
				return;
			}
		}

		// Create new comment
		$newComment = [
			'id_user' => $_SESSION['id'],
			'firstname' => $firstname,
			'lastname' => $lastname,
			'message' => $message,
			'timestamp' => date('c'),
			'imageUrl' => $imageUrl
		];

		$this->saveComment($idrecipe, $newComment);

		http_response_code(200);
		header('Content-Type: application/json');
		echo json_encode($this->getAllComments());
	}

	// Saves a new comment to the file
	private function saveComment(string $recipeId, array $comment): void
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
		if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
			http_response_code(405);
			echo json_encode(['error' => 'Method Not Allowed']);
			return;
		}

		//On récupère l'ID de la recette 
		$uri = $_SERVER['REQUEST_URI'];
		$scinde = explode("/", $uri);
		$recipeId = end($scinde);

		//On récupère le timestamp
		$rawData = file_get_contents("php://input");
		$data = json_decode($rawData, true);
		$timestamp = $data['timestamp'] ?? null;

		//On récupère tout les commentaires
		$comments = $this->getAllComments();

		//Il n'existe pas de commentaire pour l'id envoyer
		if(!isset($comments[$recipeId])){
			http_response_code(400);
			echo json_encode(['error' => 'Recipe ID doesn\'t exist']);
			return;
		}

		$comments[$recipeId] = array_filter($comments[$recipeId], function($comment) use ($timestamp) {
            return $comment['timestamp'] !== $timestamp;  // Si le timestamp ne correspond pas, garder le commentaire
        });

		// Réindexer les commentaires (array_filter enlève les index numériques)
		$comments[$recipeId] = array_values($comments[$recipeId]);


		file_put_contents($this->filePath, json_encode($comments, JSON_PRETTY_PRINT));
	
		http_response_code(200);
		echo json_encode(['message' => 'Comment deleted '.$timestamp]);
	}

	/*Pas utilisé*/
	public function handleDeleteAllCommentRequest(): void
	{
		$session_user = $this->authController->getSession();
		$email = $session_user["mail"];

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


