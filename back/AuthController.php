<?php
session_start();

class AuthController
{
	private string $filePath;

	public function __construct(string $filePath)
	{
		$this->filePath = $filePath;
	}

	// TODO: Implement the handleRegister method
	public function handleRegister(): void
	{		
		// Hints:
		// 1. Check if the request Content-Type is 'application/x-www-form-urlencoded'
		if ($_SERVER['CONTENT_TYPE'] !== 'application/x-www-form-urlencoded') {
			http_response_code(400);
			echo json_encode(['error' => 'Invalid Content-Type header']);
			return;
		}


		// 2. Get the email and password from the POST data
		$username = $_POST['username'];
		$email = $_POST['email'];
		$password = $_POST['password'];
		$role = $_POST['role'];

		// 3. Validate the email and password

		// email
		$email = filter_var($email, FILTER_SANITIZE_EMAIL);
		filter_var($email, FILTER_VALIDATE_EMAIL);

		// password
		$minLength = 8;
    	$maxLength = 20;

    	if (strlen($password) < $minLength || strlen($password) > $maxLength) {
        	http_response_code(400);
			echo json_encode(['error' => 'Invalid Password']);
			return;
    	}
	
		// 4. Check if the email and username is already registered
		$users = $this->getAllUsers();
		if (isset($users[$email])) {
			http_response_code(400);
			echo json_encode(['error' => 'Email Already Registered']);
			return;
		}else if(isset($users[$username])){
			http_response_code(400);
			echo json_encode(['error' => 'Username Already Registered']);
			return;
		}

		// 5. Hash the password using password_hash
		$password = password_hash($password, PASSWORD_DEFAULT);

		// 6. Save the user data to the file\
		$users[$email] = ["username" => $username,"password" => $password, "role" => $role];
		file_put_contents($this->filePath, json_encode($users, JSON_PRETTY_PRINT));


		// 7. Return a success message with HTTP status code 201 and the redirect
		echo json_encode(['redirect'=>"login.html"]);
		http_response_code(201);
		
		// If any error occurs, return an error message with the appropriate HTTP status code
		// Make sure to set the Content-Type header to 'application/json' in the response
		// You can use the json_encode function to encode an array as JSON
		// You can use the http_response_code function to set the HTTP status code
	}

	// TODO: Implement the handleLogin method
	public function handleLogin(): void
	{
		// Hints:
		// 1. Check if the request Content-Type is 'application/x-www-form-urlencoded'
		if ($_SERVER['CONTENT_TYPE'] !== 'application/x-www-form-urlencoded') {
			http_response_code(400);
			echo json_encode(['error' => 'Invalid Content-Type header']);
			return;
		}

		// 2. Get the email and password from the POST data
		$email = $_POST['email'];
		$password = $_POST['password'];


		// 3. Validate the email and password
		$email = filter_var($email, FILTER_SANITIZE_EMAIL);
		filter_var($email, FILTER_VALIDATE_EMAIL);

		$minLength = 8;
    	$maxLength = 20;

    	if (strlen($password) < $minLength || strlen($password) > $maxLength) {
        	http_response_code(400);
			echo json_encode(['error' => 'Invalid Password']);
			return;
    	}

		// 4. Check if the user exists and the password is correct
		$users = $this->getAllUsers();
		if (!(isset($users[$email]))){
			http_response_code(400);
			echo json_encode(['error' => 'Email is not Registered']);
			return;
		}

		if (!password_verify($password, $users[$email]["password"])){
			http_response_code(400);
			echo json_encode(['error' => 'Incorrect password']);
			return;
		}

		// 5. Store the user session
		$_SESSION['id'] = $users[$email]["id"];
		$_SESSION['username'] = $users[$email]["username"];
		$_SESSION['role'] = $users[$email]["role"];

		// 6. Return a success message with HTTP status code 200
		echo json_encode(['redirect'=>"index.html"]);
		http_response_code(200);

		// Additional hints:
		// If any error occurs, return an error message with the appropriate HTTP status code
		// Make sure to set the Content-Type header to 'application/json' in the response
		// You can use the getAllUsers method to get the list of registered users
		// You can use the password_verify function to verify the password
		// You can use the $_SESSION superglobal to store the user session
		// You can use the json_encode function to encode an array as JSON
		// You can use the http_response_code function to set the HTTP status code
	}

	public function handleLogout(): void
	{	
		$_SESSION = [];
    	session_destroy();
    	
		echo json_encode(['redirect'=>'index.html']);
		http_response_code(200);
		
	}

	public function validateAuth(): string
	{
		return $_SESSION['user'] ?? null;
	}

	private function getAllUsers(): array
	{
		return file_exists($this->filePath) ? json_decode(file_get_contents($this->filePath), true) ?? [] : [];
	}


}
