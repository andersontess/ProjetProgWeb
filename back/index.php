<?php

require_once 'Router.php';
require_once 'Recipe.php';
require_once 'CommentController.php';

session_start(); // Start the session

$router = new Router();
$commentController = new CommentController(__DIR__ . '/data/comments.json', $authController);
$recipe = new Recipe(__DIR__ . 'data/recipes.json');

// AUTH ROUTES 
$router->register('POST', '/auth/login', [$authController, 'handleLogin']);
$router->register('POST', '/auth/logout', [$authController, 'handleLogout']);
$router->register('POST', '/auth/register', [$authController, 'handleRegister']);


// COMMENT ROUTES
$router->register('POST', '/comment/{recipe_id}', [$commentController, 'handlePostCommentRequest']);
$router->register('GET', '/comment/{recipe_id}', [$commentController, 'handleGetCommentsRequest']);
$router->register('DELETE', '/comment/{recipe_id}', [$commentController, 'handleDeleteCommentRequest']);
$router->register('POST', '/comment/{recipe_id}/like', [$commentManager, 'handleLikeComment']);


// RECIPE ROUTES
$router->register('GET', '/recipe/?search=your_query', [$recipeController, 'handleGetRecipeRequest']);
$router->register('POST', '/recipe/photo', [$recipeController, 'handlePostPhotoRecipe']);
$router->register('POST', '/recipe/propose', [$recipeController, 'handleProposeRecipe']);
$router->register('PUT', '/recipe/{recipe_id}', [$recipeController, 'handleModifyRecipe']);
$router->register('POST', '/recipe/approve', [$recipeController, 'handleApproveRecipe']);
$router->register('GET', '/recipe/{recipe_id}', [$recipeController, 'handleConsultRecipe']);
$router->register('DELETE', '/recipe/{recipe_id}', [$recipeController, 'handleDeleteRecipe']);


// USER ROUTES 
$router->register('PUT', '/user/{user_id}/role/', [$recipeController, 'handleAskAttributeRole']);


$router->handleRequest();



?>


