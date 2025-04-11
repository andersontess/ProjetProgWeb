<?php

class AuthMiddleware

{
    public function checkAuth () {
		if (!isset($_SESSION['user'])) {
			http_response_code(401);
			echo json_encode(['error ' => 'Unauthorize']);
			exit();
		}
	}
}