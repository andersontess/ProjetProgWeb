<?php
session_start();

require_once 'Router.php';
require_once 'RecipeController.php';
require_once 'CommentController.php';
require_once 'AuthController.php';
require_once 'functions.php';
 



$router = new Router();
$authController = new AuthController(__DIR__ . '/data/users.json');
$commentController = new CommentController(__DIR__ . '/data/comments.json', $authController);
$recipeController = new RecipeController(__DIR__ . '/data/recipes.json', $authController);

// AUTH ROUTES 
$router->register('POST', '/auth/login', [$authController, 'handleLogin']);
$router->register('POST', '/auth/logout', [$authController, 'handleLogout']);
$router->register('POST', '/auth/register', [$authController, 'handleRegister']);
$router->register('POST', '/auth/userSession', [$authController, 'getSession']);

$router->register('POST', '/auth/addPhoto', [$authController, 'handleChangePhoto']);

// COMMENT ROUTES
$router->register('POST', '/comment/{recipe_id}', [$commentController, 'handlePostCommentRequest']);
$router->register('GET', '/comment/{recipe_id}', [$commentController, 'handleGetCommentsRequest']);
$router->register('DELETE', '/comment/{recipe_id}', [$commentController, 'handleDeleteCommentRequest']);
// $router->register('POST', '/comment/{recipe_id}/like', [$commentController, 'handleLikeComment']);


// RECIPE ROUTES
$router->register('GET', '/recipe', [$recipeController, 'handleSearchRecipe']);
$router->register('GET', '/recipe/indexRecipes', [$recipeController, 'getRecipesByType']);
$router->register('GET', '/recipe/RecipesLiked', [$recipeController, 'handleRecipesLiked']);
$router->register('GET', '/recipe/RecipesCreated', [$recipeController, 'handleRecipesCreated']);
$router->register('GET', '/recipe/{recipe_id}', [$recipeController, 'handleConsultRecipe']);

$router->register('POST', '/recipe/addRecipe', [$recipeController, 'handlePostRecipe']);
$router->register('POST', '/recipe/translate/{recipe_id}', [$recipeController, 'handleTranslateRecipe']);
$router->register('POST', '/recipe/{recipe_id}/like', [$recipeController, 'handleLikeRecipe']);
$router->register('DELETE', '/recipe/{recipe_id}/like', [$recipeController, 'handleDeleteLikeRecipe']);

// $router->register('POST', '/recipe/photo', [$recipeController, 'handlePostPhotoRecipe']);
// $router->register('POST', '/recipe/propose', [$recipeController, 'handleProposeRecipe']);
// $router->register('PUT', '/recipe/{recipe_id}', [$recipeController, 'handleModifyRecipe']);
// $router->register('POST', '/recipe/approve', [$recipeController, 'handleApproveRecipe']);

// $router->register('DELETE', '/recipe/{recipe_id}', [$recipeController, 'handleDeleteRecipe']);


// // USER ROUTES 
// $router->register('PUT', '/user/{user_id}/role/', [$recipeController, 'handleAskAttributeRole']);


$router->handleRequest();


?>

