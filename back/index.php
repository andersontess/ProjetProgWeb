<?php

require_once 'Router.php';
require_once 'Recipe.php';
require_once 'CommentController.php';

session_start(); // Start the session

$router = new Router();
$commentController = new CommentController(__DIR__ . '/data/comments.json', $authController);
$recipe = new Recipe(__DIR__ . 'data/recipes.json');


$router->register('POST', '/comment', [$commentController, 'handlePostCommentRequest']);
$router->register('GET', '/comment', [$commentController, 'handleGetCommentsRequest']);
$router->register('DELETE', '/comment', [$commentController, 'handleDeleteCommentRequest']);

$router->handleRequest();

$router->register('POST', '/comment', [$commentManager, 'handleCommentRequest']);

$router->register('GET', '/recipe/?search=your_query', [$recipeController, 'handleGetRecipeRequest']);

?>


