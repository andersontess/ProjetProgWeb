<?php

class Router // directs requests to the correct controllers.
{
	private array $routes = [];

	/**
	 * Register a new route
	 */
	public function register(string $method, string $path, callable $handler): void
	{
		$this->routes[] = [
			'method' => strtoupper($method),
			'path' => $path,
			'handler' => $handler,
		];
	}

	/**
	 * Handle the incoming request
	 */
	public function handleRequest(): void
	{
		// Get the HTTP method and path of the request
		$method = $_SERVER['REQUEST_METHOD'];
		$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

		// Set the CORS headers
		header("Access-Control-Allow-Origin: *");
		header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
		header("Access-Control-Allow-Headers: Content-Type, Authorization");

		foreach ($this->routes as $route) {
			if ($route['method'] === $method && $route['path'] === $path) {
				// If a route matches the request, call the handler
				call_user_func($route['handler']);
				return;
			}
		}

		// If no route was found, return a 404
		http_response_code(404);
		echo json_encode(['error' => 'Route not found']);
	}
}


// Ne supporte pas les variables
// Modfiier le routeur pour qu'il supporte des morceaux variables et des morceaux statiques
// 