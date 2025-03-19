<?php

class Router // directs requests to the correct controllers.
{
	private array $routes = [];

	/**
	 * Register a new route
	 */
	public function register(string $method, string $path, callable $handler): void
	{
		// conversion des parametres dynamiques en regex pour gerer les query strings et les id
		$pathRegex = preg_replace('/\{([^\/]+)\}/', '(?P<\1>[^/]+)', $path);
		$pathRegex = str_replace('/', '\/', $pathRegex);

		$this->routes[] = [
			'method' => strtoupper($method),
			'path' => $path,
			'regex' => '/^' . $pathRegex . '$/',
			'handler' => $handler,
		];
	}


	// 1. Recoit une route de index.php et verifie sa validité (si method et path correspondent a une route existante)
	// 2. Si c'est le cas, on fait "call_user_func" qui prend la route, appelle le controller correspondant.

	/**
	 * Handle the incoming request
	 */
	public function handleRequest(): void
	{
		// Get the HTTP method and path of the request
		$method = $_SERVER['REQUEST_METHOD'];
		$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

		//dd(parse_url($path));
		//$uri = parse_url($_SERVER['REQUEST_URI'])['path'];


		// Set the CORS headers
		header("Access-Control-Allow-Origin: *");
		header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
		header("Access-Control-Allow-Headers: Content-Type, Authorization");

		foreach ($this->routes as $route) {
			if ($route['method'] === $method && $route['path'] === $path && preg_match($route['regex'], $path, $matches)) {
				// Extract named parameters
				$query = parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY);
		
				// if query not empty, parse it
				$params = [];
				if ($query) {
					parse_str($query, $params);
				}
				
				// Call handler with extracted params
				call_user_func($route['handler'], $params);
				return;
			}
		}


		// If no route was found, return a 404
		http_response_code(404);
		echo json_encode(['error' => 'Route not found']);
	}
}