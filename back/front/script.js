"use strict"

// Description: This file contains the JavaScript code for the front-end of the application.

const webServerAddress = "http://localhost:8080";

// const form = document.getElementById("post-comment");
// // Trigger the getComments function when the form is submitted
// if (form) {
// 	form.addEventListener("submit", async (event) => {
// 		// Prevent the default form submission (page reload)
// 		event.preventDefault();
// 		const comments = await sendComment(event);
// 		event.target.reset();
// 		await displayComments(comments);
// 	});
// }

// Pour le formulaire de création de compte
const formCreationCompte = document.getElementById("creationCompte");
if (formCreationCompte) {
	// Trigger the getComments function when the form is submitted
	formCreationCompte.addEventListener("submit", async (event) => {
        // Prevent the default form submission (page reload)
        event.preventDefault();
        await creationCompte(event);
        event.target.reset();
    });
}

// Pour le formulaire de connexion
const formConnexion = document.getElementById("connexion");
if (formConnexion) {
	// Trigger the getComments function when the form is submitted
	formConnexion.addEventListener("submit", async (event) => {
        // Prevent the default form submission (page reload)
        event.preventDefault();
        await connexion(event);
        event.target.reset();
    });
}

// Lorsque l'utilisateur clique en dehors du div on ferme le div
const divRecipeCard = document.getElementById("recipe-card");
document.addEventListener('click', (event)=>{
    $(".recipe-card").addClass("hide");
});

//Pour le formulaire de la tranduction
const formTranslate = document.getElementById("form-translate");
if (formTranslate){
    displayPageTranslate();
    formTranslate.addEventListener("submit", async (event) => {
        event.preventDefault();
        await addTranslation(event);
        event.target.reset();
    });
}

//Lance toutes les scripts utiles lors du chargement d'une page
const recipeContainer = document.getElementById("presentation-recipes");
const navbar = document.getElementById("user-navbar");
const searchInput = document.getElementById("searchedRecipe");
document.addEventListener("DOMContentLoaded", () =>{
    if (navbar){
        userRegistration();

        //Pour le formulaire de deconnexion (Il doit être ici car le formulaire est créée dans userRegistration)
        const formDeconnexion = document.getElementById("form-deconnexion");
        if (formDeconnexion){
            formDeconnexion.addEventListener("submit", async(event)=>{
                event.preventDefault();
                await deconnexion(event);
                event.target.reset();
            });
        }

        //Pour le formulaire d'un commentaire
        const formComment = document.getElementById("form-comment");
        if (formComment){
            formComment.addEventListener("submit", async(event)=>{
                event.preventDefault();
                await addComment(event);
                event.target.reset();
            });
        }
 
    }
    
    //Pour la page index.html
    if (recipeContainer){
        displayRecipesPageIndex();
    }

    //Pour la barre de recherche
    if (searchInput) {
        searchInput.addEventListener("input", async () => {
            const searchTerm = searchInput.value.trim();
            if (searchTerm.length >= 1) {
                const recipes = await searchRecipes(searchTerm);
                $("#presentation-recipes").empty();
                displaySearchResults(recipes);
            } else {
                // Optional: reset to default recipes when input is empty
                clearSearchResults();
                displayRecipesPageIndex();
            }
        });
    }

    //Pour la page recipe.html
    const container = document.getElementById("info-recipe");
    if (container){
        consultRecipe();
        displayPage();
        showComments();
    }
});

/* var email = document.getElementById("email");

email.addEventListener("keyup", function (event) {
  if (email.validity.typeMismatch) {
    email.setCustomValidity("L'email est invalide");
  } else {
    email.setCustomValidity("");
  } 
});*/


// const button = document.getElementById("get-comments");
// // Trigger the getComments function when the button is clicked
// button.addEventListener("click", async () => {
// 	const comments = await getComments();
// 	await displayComments(comments);
// });


// const search = document.getElementById("get-recipes");
// // Trigger the getRecipes function when the button is clicked
// button.addEventListener("click", async () => {
// 	const recipes = await getRecipes();
// 	await displayRecipes(recipes);
// });

// /**
//  * This function sends a POST request to the server with the form data to add a new comment.
//  * @param {SubmitEvent} event The event that triggered the function
//  * @returns {Object} The result of the form submission
//  */
//  async function sendComment(event) {
// 	const body = new URLSearchParams(new FormData(event.target));

// 	try {
// 		// Send a POST request to the server with the form data
// 		const response = await fetch(`${webServerAddress}/comment`, {
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "application/x-www-form-urlencoded",
// 			},
// 			// Serialize the form data to URL-encoded format
// 			body,
// 		});

// 		if (response.ok) {
// 			// If the request was successful, log the result
// 			const result = await response.json();
// 			console.log("Form submitted successfully:", result);
// 			return result;
// 		} else {
// 			console.error(
// 				"Form submission failed:",
// 				response.status,
// 				response.statusText
// 			);
// 		}
// 	} catch (error) {
// 		console.error("Error occurred:", error);
// 	}
// }

// /**
//  * This function sends a GET request to the server to retrieve all comments.
//  */
// async function getComments() {
// 	try {
// 		// Send a GET request to the server to retrieve all comments
// 		const response = await fetch(`${webServerAddress}/comment`, {
// 			method: "GET",
// 		});

// 		if (response.ok) {
// 			const result = await response.json();
// 			console.log("Comments retrieved successfully:", result);
// 			return result;
// 		} else {
// 			console.error(
// 				"Comments retrieval failed:",
// 				response.status,
// 				response.statusText
// 			);
// 		}
// 	} catch (error) {
// 		console.error("Error occurred:", error);
// 	}
// }

// /**
//  * This function takes the list of comments and displays them in the HTML list inside the div with id="comment-list".
//  * @param {Array} comments List of comments to display
//  */
// async function displayComments(comments) {
// 	// Hints:
// 	// 1. Create a new unordered list element (ul)
// 	// 2. Loop through each comment in the list
// 	// 3. Create a new list item element (li) for each comment
// 	// 4. Set the innerHTML of the list item to the comment text
// 	// 5. Append the list item to the unordered list
// 	// 6. Append the unordered list to the div with id="comment-list"

// 	// What functions do you need to use here?
// 	// - document.createElement
// 	// - document.getElementById
// 	// - element.appendChild
// 	// - element.innerHTML
// }


// async function getRecipes() {
// 	const searchedRecipe = document.getElementById("searchedRecipe").value;
// 	console.log("Texte recherché: ", searchedRecipe); 
//     try {
// 		// Send a POST request to the server with the form data
// 		const response = await fetch(`${webServerAddress}/recipe/?search=`+searchedRecipe, {
// 			method: "GET",
// 			headers: {
// 				"Content-Type": "application/x-www-form-urlencoded",
// 			},
// 			// Serialize the form data to URL-encoded format
// 			body,
// 		});

// 		if (response.ok) {
// 			// If the request was successful, log the result
// 			const result = await response.json();
// 			console.log("Form submitted successfully:", result);
// 			return result;
// 		} else {
// 			console.error(
// 				"Form submission failed:",
// 				response.status,
// 				response.statusText
// 			);
// 		}
// 	} catch (error) {
// 		console.error("Error occurred:", error);
// 	}
// }

/***************************/
/** Pour les utilisateurs **/
/***************************/
async function creationCompte(event) {
    const body = new URLSearchParams(new FormData(event.target));

    console.log("Données envoyées:", body.toString());
    try {
        console.log("Envoi de la requête à:", `${webServerAddress}/auth/register`);
        const response = await fetch(`${webServerAddress}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body,
        });
        console.log("Statut de la réponse HTTP:", response.status);
        const text = await response.text(); // Lire la réponse en texte brut
        
        console.log("Réponse brute du serveur:", text); // Debug
        

        if (response.ok) {
            const result = JSON.parse(text);
            console.log("Création de compte réussie:", result);
            alert("Création de compte réussie");
            window.location.href = result.redirect; // Redirection vers index.html

            return result;
        } else {
            alert("Password is invalid");
            console.error("Échec de la création de compte:", response.status, response.statusText);
        }
    } catch (error) {
        alert("Compte n'a pas pu etre cree");
        console.error("Erreur lors de la création de compte:", error);
    }
}

async function connexion(event) {
    const body = new URLSearchParams(new FormData(event.target));

    console.log("Données envoyées:", body.toString());

    try {
        console.log("Envoi de la requête à:", `${webServerAddress}/auth/login`);
        const response = await fetch(`${webServerAddress}/auth/login`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body,
        });

        console.log("Statut de la réponse HTTP:", response.status);
        const text = await response.text(); // Lire la réponse en texte brut
        console.log("Réponse brute du serveur:", text); // Debug

        if (response.ok) {
            const result = JSON.parse(text);
            console.log("Connexion réussie:", result);
            localStorage.setItem("isAuth", true);
            window.location.href = result.redirect; // Redirection vers index.html

            return result;
        } else {
            console.error("Échec de la connexion:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
    }
}

async function deconnexion(event){
    const body = new URLSearchParams(new FormData(event.target));
    console.log("Données envoyées:", body.toString());

    try{
        console.log("Envoi de la requête à: ", `${webServerAddress}/auth/logout`);
        const response = await fetch(`${webServerAddress}/auth/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded", 
            },
            body,
        });

        console.log("Statut de la réponse HTTP:", response.status);
        const text = await response.text();
        console.log("Réponse brute du serveur",text);

        if(response.ok) {
            const result = JSON.parse(text);
            console.log("Déconnexion réussie:", result);
            localStorage.setItem("isAuth", false);
            window.location.href = result.redirect;

            return result;
        } else {
            console.error("Échec de la déconnexion:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);
    }
}

function userRegistration() {
    const isConnected = localStorage.getItem("isAuth");
    const navbar = document.getElementById("user-navbar");
    const formComment = document.getElementById("form-comment");
    
    //L'utilisateur est connecté
    if (isConnected === "true"){
        //Bouton de déconnexion
        $("#user-navbar").append('<form id="form-deconnexion"><input class="inputDeconnexion" type="submit" value="Déconnexion"/></form>');

        if (formComment){
            $("#form-comment").before("<h5>Give your opinion / Donner votre avis</h5>");
            $("#input-firstname").append("<input type='text' name='firstname' placeholder='Firstname / Prenom' required/>");
            $("#input-lastname").append("<input type='text' name='lastname' placeholder='Lastname / Nom' required/>");
            $("#txtArea-message").append("<textarea id='message' name='message' rows='5' cols='33' placeholder='Commentary / Commentaire'></textarea>");
            $("#txtArea-message").after("<input class='btn btn-primary' type='submit' value='Envoyer'/>");
        }
    }

    //L'utilisateur est déconnecté
    if (localStorage.getItem("isAuth") === null || isConnected === "false") {
        const a1 = document.createElement("a");
        a1.href = "login.html"; 
        a1.textContent = "Connexion";
    
        const a2 = document.createElement("a");
        a2.href = "creerCompte.html"; 
        a2.textContent = "Créer un compte"; 
    
        navbar.appendChild(a1);
        navbar.appendChild(a2);
    }                
}

async function addComment(event) {
    const recipeId = JSON.parse(localStorage.getItem("data")).id;
    const formData = new FormData(event.target);
    formData.append("idrecipe", recipeId);

    console.log("Données envoyées (FormData):", [...formData.entries()]);
    try {
        const response = await fetch(`${webServerAddress}/comment/${recipeId}`, {
            method: "POST",
            body: formData, // No need to set Content-Type; browser does it for FormData
        });

        console.log("Statut de la réponse HTTP:", response.status);
        const text = await response.text();
        console.log("Réponse brute du serveur:", text);

        if (response.ok) {
            const result = JSON.parse(text);
            console.log("Création du commentaire réussie:", result);
            window.location.reload();
        } else {
            alert("Commentaire invalide");
            console.error("Erreur création commentaire:", response.status, response.statusText);
        }
    } catch (error) {
        alert("Erreur lors de l'envoi du commentaire.");
        console.error("Erreur:", error);
    }
}

async function changePageByRole(){
    try {
        const response = await fetch(`${webServerAddress}/auth/userSession`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const text = await response.text(); // lire d'abord en texte brut
        const result = JSON.parse(text);

        return result;
    } catch (error) {
        console.error("Erreur lors de la recherche de recettes:", error);
        return [];
    }
}

async function displayPage(){
    let varSession = await changePageByRole();

    if (varSession === null){
        return;
    }

    if (varSession.role === "cuisinier" || varSession.role === "DemandeTraducteur" || varSession.role === "DemandeChef"){
        console.log("Cuisinier");
    } 

    if (varSession.role === "traducteur"){
        const alert = document.getElementById("alert-lg");
        if (alert){
            alert.innerHTML += '<button class="button-lg" type="button" onclick="window.location.href=\'translate.html\'">Traduire</button>'
        }
    }
}

function displayPageTranslate(){
    //Récupération des données
    const dataString = localStorage.getItem("data");
    const recipe = JSON.parse(dataString);

    //Nom de la recette
    if (recipe["nameFR"] === undefined){
        $("#nameFR").append("<input type='text' name='nameFR' placeholder='Insérez le nom de la recette' required>");
    }else {
        $("#nameFR").append("<h2>"+recipe["nameFR"]+"<h2>");
    }
    $("#name").append("<h2>"+recipe["name"]+"<h2>");

    //Auteur de la recette
    if (recipe["Author"]){
        $(".author").append("<p> Author : "+recipe["Author"]+"</p>");
    } else {
        $(".author").append("Author: Unknown");
    }

    //Without
    if(recipe["Without"]){
        for (let without of recipe["Without"]){
            $(".p-without").append(without+" ");
        }
    }else {
        $(".p-without").append("Unknown");
    }

    //Description
    if(recipe["descriptionFR"]){
        $(".descriptionFR").append(`<p>${recipe["descriptionFR"]}</p>`);
    }else {
        $(".descriptionFR").append(`<p>Description non disponible</p>`);
    }

    if(recipe["description"]){
        $(".description").append(`<p>${recipe["description"]}</p>`);
        if(recipe["descriptionFR"] === undefined){
            $(".descriptionFR").append(`<textarea type="textarea" name="descriptionFR" rows="5" required></textarea>`);
        }
    } else {
        $(".description").append(`<p>Description not available</p>`);
    }
    const heightDescriptionEn = document.getElementById("description").offsetHeight;
    const heightDescriptionFr = document.getElementById("descriptionFR").offsetHeight;
    if (heightDescriptionEn > heightDescriptionFr){
        document.getElementById('descriptionFR').style.height = heightDescriptionEn+'px';
    }else{
        document.getElementById('description').style.height = heightDescriptionFr+'px';
    }


    //Ingrédients
    if (recipe["ingredients"]){
        //Ingrédients en Anglais
        for (let ingredient of recipe["ingredients"]){
            $(".ingredients").append(`
                <div class="px-3">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item mt-2">${ingredient["name"]}</li>
                        <li class="list-group-item">${ingredient["type"]}</li>
                        <li class="list-group-item mb-2">${ingredient["quantity"]}</li>
                    </ul>
                </div>`);
        }

        //Ingrédients en Français
        if (recipe["ingredientsFR"]){
            for (let [index, ingredientFR] of recipe["ingredientsFR"].entries()){
                $(".ingredientsFR").append(`
                    <div class="px-3">
                        <ul class="list-group my-2">
                            <li>${`<input type="text" name="ingredientFR-name${index}" value="${ingredientFR["name"] === null ? "" : ingredientFR["name"]}" placeholder='Insérez le nom' ${ingredientFR["name"] !== null ? "readonly" : "required"}/>`}</li>
                            <li>${`<input type="text" name="ingredientFR-type${index}" value="${ingredientFR["type"] === null ? "" : ingredientFR["type"]}" placeholder='Insérez le type' ${ingredientFR["type"] !== null ? "readonly" : "required"}/>`}</li>
                            <li>${`<input type="text" name="ingredientFR-quantity${index}" value="${ingredientFR["quantity"] === null ? "" : ingredientFR["quantity"]}" placeholder="Insérez la quantité" ${ingredientFR["quantity"] !== null ? "readonly" : "required"}/>`}</li>
                        </ul>
                    </div>`);
            }
        }else {
            for (let [index, ingredientFR] of recipe["ingredients"].entries()){
                $(".ingredientsFR").append(`
                    <div class="px-3">
                        <ul class="list-group my-2">
                            <li>${`<input type="text" name="ingredientFR-name${index}" placeholder='Insérez le nom' required/>`}</li>
                            <li>${`<input type="text" name="ingredientFR-type${index}" placeholder='Insérez le type' required/>`}</li>
                            <li>${`<input type="text" name="ingredientFR-quantity${index}" placeholder="Insérez la quantité" required/>`}</li>
                        </ul>
                    </div>`);
            }
        }
    }
    //Pour mettre à la même hauteur
    const heightIngredientEn = document.getElementById("ingredients-en").offsetHeight;
    const heightIngredientFR = document.getElementById("ingredients-fr").offsetHeight;
    if (heightIngredientEn > heightIngredientFR){
        document.getElementById('ingredients-fr').style.height = heightIngredientEn+'px';
    }else{
        document.getElementById('ingredients-en').style.height = heightIngredientFR+'px';
    }

    //Setps/ étapes
    if(recipe["steps"]){
        //Pour les étapes en Anglais
        for (let [index, step] of recipe["steps"].entries()){
            $(".steps").append(`
                <div class="step-container border rounded m-2">
                    <p>${step}</p>
                </div>`);
            
            if(recipe["stepsFR"] === undefined){
                $(".etapes").append(`
                    <div class="step-container m-2">
                        <textarea type="textarea" name="stepsFR${index}" rows="5" required></textarea>
                    </div>`);
            }
        }

        //Pour les étapes en FR
        if(recipe["stepsFR"]){
            for (let [index, stepFR] of recipe["stepsFR"].entries()){
                $(".etapes").append(`
                    <div class="step-container m-2">
                        <textarea type="textarea" name="stepsFR${index}" rows="5" readonly>${stepFR}</textarea>
                    </div>`);
            }
        }
    }

    const heightStepsEn = document.getElementById("steps-en").offsetHeight;
    const heightStepsFR = document.getElementById("steps-fr").offsetHeight;
    if (heightStepsEn > heightStepsFR){
        document.getElementById('steps-fr').style.height = heightStepsEn+'px';
    }else{
        document.getElementById('steps-en').style.height = heightStepsFR+'px';
    }
}
/***********************/
/** Pour les recettes **/
/***********************/
async function displayRecipesPageIndex() 
{
    try {
        console.log("Envoi de la requête à: ", `${webServerAddress}/recipe/indexRecipes`);

        // Envoi de la requête GET avec fetch() et récupération de la réponse
        const response = await fetch(`${webServerAddress}/recipe/indexRecipes`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        // Afficher le statut de la réponse
        console.log("Statut de la réponse HTTP:", response.status);

        // Vérifier si la réponse est correcte (statut 200)
        if (response.ok) {
            const result = await response.json(); // Parse la réponse JSON
            renderRecipes(result);
        } else {
            console.error("Échec de la requête:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Erreur lors de l'affichage des recettes omnivores:", error);
    }
}
function renderRecipes(recipes)
{
    let Categories = ["Omnivores", "Végétarien", "Vegan"];

    Categories.forEach(category => {
        renderRecipeCategory (recipes, category);
    });
}

function renderRecipeCategory(recipes, categoryName){
    const categoryRecipes = recipes[categoryName];

    let containerCategory = 
    `
        <div class="container">
            <h2>${categoryName}</h2>
            <div class="row" id="recipes-${categoryName.toLowerCase()}">
                <!-- Les recettes seront affichées ici -->
            </div>
        </div>
    `;

    $("#presentation-recipes").append(containerCategory);

    categoryRecipes.forEach(recipe => {
        $("#recipes-" + categoryName.toLowerCase()).append
        (`
            <div class="recipe" data-id="${recipe.id}" onclick="showRecipeCard(this)">
                <img src="${recipe.imageURL}" alt="food" class="food-image">
                <h2>${recipe.nameFR}</h2>
            </div>
        `);
    });
}

async function showRecipeCard(obj)
{    
    const recipeId = obj.getAttribute("data-id").trim();
    console.log("Envoi de la requête à: ", `${webServerAddress}/recipe/${recipeId}`);
    
    // Envoi de la requête GET avec fetch() et récupération de la réponse
     const response = await fetch(`${webServerAddress}/recipe/${recipeId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json", 
        }
    });
    
    console.log("Réponse du serveur:", response.status);

    // Vérifier si la réponse est OK et récupérer les données
    if (response.ok) {
        const data = await response.json();
        displayContentCard(data);
    } else {
        console.error("Erreur lors de la récupération des données", response.status);
    }
}

async function displayContentCard(data)
{
    $(".recipe-card").removeClass("hide").empty();

    const lang              = data.ingredientsFR ? "fr" : "en";
    const name              = lang === "fr" ? data.nameFR : data.name;
    const author            = lang === "fr" ? data.AuthorFR : data.Author;
    const ingredientsArray  = lang === "fr" ? data.ingredientsFR : data.ingredients
    const ingredientLabel   = lang === "fr" ? "de" : "of"; 

    const names = createNameSection(name, author, data.imageURL);
    const ingredients = createIngredientSection(ingredientsArray, ingredientLabel);

    $(".recipe-card")
        .append(names)
        .append(ingredients)
        .append(`<div onclick='window.location.href="recipe.html"'><span class='btn-voirplus'>Voir plus</span></div>`);
    
    localStorage.setItem("data", JSON.stringify(data));
}

function createNameSection(name, author, imageURL){
    const names = 
    $(`
        <div class='names'>
            <div class='nameRecipe'>${name}</div>
            <div class='nameAuthor'>${author}</div>
            <img src="${imageURL}" alt="food" class="food-image">
        </div>
    `);
    return names;

}
function createIngredientSection(ingredients, label){
    const container = 
    $(`
        <div class='ingredient-container'>
            <h2>Ingredients :</h2>
            <div class='flex-Ingredients'>
            </div>
        </div>
    `);
    const flexContainer = container.find(".flex-Ingredients");
    
    for (let ingredient of ingredients) {
        const $ingredient = 
        $(`
            <div class='ingredient'>
                <div class='img-card'>
                    <img src='${ingredient.imageIng}' alt='Ing-image' class='Ing-image'
                </div>
                <span class='quantity'>${ingredient.quantity}</span>
                <span class='name'>${label} ${ingredient.name}</span>
            </div>
        `);
        flexContainer.append($ingredient);
    }

    return container;
}

async function consultRecipe(){
    const dataString = localStorage.getItem("data");
    const data = JSON.parse(dataString);

    //On vérifie si la langue français est disponible si un des éléments est null (existe pas) on met la recette en anglais
    if (!data["nameFR"] || !data["ingredientsFR"] || !data["stepsFR"]){
        console.log(!data["nameFR"]);
        console.log(!data["ingredientsFR"]);
        console.log(!data["stepsFR"]);

        putElementsofRecipe(data, "en");
    } else {
        $("#main").after
        (`
            <div class="toggle-btn col-2 my-3">
                <select name="lang" id="lg-select">
                    <option value="fr">French</option>
                    <option value="en">English</option>
                </select>
            </div>
        `);
    
        putElementsofRecipe(data, "fr");
    
        $("#lg-select").on("change", function () 
        {
            const lang = $(this).val();
            putElementsofRecipe(data, lang);
        });
    }
}

function putElementsofRecipe(data, lang)
{
    const isFR = lang === "fr";

    const name          = isFR ? data["nameFR"] : data["name"];
    const author        = isFR ? data["AuthorFR"] : data["Author"];
    const description   = isFR ? data["descriptionFR"] : data["description"];
    const ingredients   = isFR ? data["ingredientsFR"] : data["ingredients"];
    const steps         = isFR ? data["stepsFR"] : data["steps"];
    const authorLabel   = isFR ? "Auteur" : "Author";
    const durationLabel = isFR ? "Durée" : "Time";
    
    //Alerte si la recette est en FR
    if (!isFR && (!data["nameFR"] || !data["ingredientsFR"] || !data["stepsFR"])) {
        $(".main-info-recipe").after
        (`
            <div id='alert-lg' class='alert-lg col-1'>
                <p>Cette recette n'est pas traduite entièrement en Français.</p>
            </div>
        `);
    }

    //Affichage de l'en-tête
    $("#recipe-name").html(name);
    $("#auteur").html(`<span>${authorLabel} : </span>${author}`);
    $("#duree").html(`<span>${durationLabel} : </span>${formatTime(data["timers"])}`);
    $("#without").empty();
    if (data["Without"]) 
    {
        $("#without").append(data["Without"].join(", "));
    }
    
    //Description et l'image
    $("#description").html(description);
    $("#img-recipe").html(`<img src="${data["imageURL"]}" alt="img-${data["name"]}">`);

    // Ingrédients
    $("#list-ingredients").empty();
    for (let ingredient of ingredients) {
        $("#list-ingredients").append(`
            <div class='p-2 border rounded'>
                <span>${ingredient["name"]}</span>
                <img src="${ingredient["imageIng"]}" alt="img-${ingredient["name"]}">
                <p>${ingredient["quantity"]}</p>
            </div>`);
    }

     // Étapes
     $("#list-preparation").empty();
     for (let [index,etape] of steps.entries()) {
        $("#list-preparation").append(`
            <div class='p-2 border rounded'>
                <span>${index+1}. ${etape}</span>
            </div>`);
     }
}

/*Pour la barre de recherche dans index.html*/
async function searchRecipes(query) {
    try {
        const response = await fetch(`${webServerAddress}/recipe?search=${encodeURIComponent(query)}`);
        const rawText = await response.text(); // lire d'abord en texte brut
        console.log("Texte brut reçu du serveur:", rawText);

        const result = JSON.parse(rawText);
        console.log("Objet JSON parsé:", result);

        return result;
    } catch (error) {
        console.error("Erreur lors de la recherche de recettes:", error);
        return [];
    }
}


function displaySearchResults(recipes) {
    // Clear all three containers for clean search results
    $("#container-search").empty();
    
    $("#container-search").append(`
        <h2>Recherche</h2>
        <div id="recipes-search" class="row"></div>
    `);

    if (recipes.length === 0) {
        $("#recipes-search").append("<p>Aucune recette trouvée.</p>");
        return;
    }

    for (let recipe of Object.values(recipes)) {
        const recipeCard = `
            <div class="recipe" data-id="${recipe.id}" onclick="showRecipeCard(this)">
                <img src="${recipe.imageURL}" alt="food" class="food-image">
                <h2>${recipe.nameFR || recipe.name}</h2>
            </div>
        `;
        $("#recipes-search").append(recipeCard);
    }
}

function clearSearchResults() {
    $("#presentation-recipes").empty();
    $("#container-search").empty();
}

/***************************/
/** Pour les commentaires **/
/***************************/
async function showComments(){
    const recipeId = JSON.parse(localStorage.getItem("data")).id;

    try {
        //Requête pour avoir les commentaires de la recette
        //console.log("Envoi de la requête à:", `${webServerAddress}/comment/${recipeId}`);
        const response = await fetch(`${webServerAddress}/comment/${recipeId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        //console.log("Statut de la réponse HTTP:", response.status);
        const text = await response.text(); // Lire la réponse en texte brut
        //console.log("Réponse brute du serveur:", text); // Debug
        

        //Requête pour avoir l'id utilisateur de la session en cours
        const response2 = await fetch(`${webServerAddress}/auth/userSession`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const text2 = await response2.text();
        //console.log("Réponse brute du serveur 2 :",text2); 
        const session_user = JSON.parse(text2);

        if (response.ok) {
            const commentaires = JSON.parse(text);
            /*Affichage des commentaires*/
            if (commentaires[recipeId] === undefined){
                return;
            };

            for (let i=0; i< commentaires[recipeId].length; i++){
                let time = new Date(commentaires[recipeId][i].timestamp);
                const date = time.toISOString().split("T")[0];
                const heure = time.toISOString().split("T")[1].split('.')[0];
                $("#commentaires").append(`
                    <div class='block-comment${i} col-md-6 mb-4'> 
                        <div class='d-flex justify-content-between align-items-center mb-1'>
                            <div class='fw-bold'>${commentaires[recipeId][i].firstname} ${commentaires[recipeId][i].lastname} ${date} à  ${heure}</div>
                                ${commentaires[recipeId][i].id_user === session_user.id 
                                    ? `<i class='bi bi-trash btnDeleteComment' role='button' data-timestamp="${commentaires[recipeId][i].timestamp}"></i>`
                                    : ""}
                         </div>
                        <div class="border rounded p-2" style="background:#fff">
                            <p class="mb-2">${commentaires[recipeId][i].message}</p>
                            ${commentaires[recipeId][i].imageUrl 
                                ? `<img src="${commentaires[recipeId][i].imageUrl}" alt="Image du commentaire" class="img-fluid rounded" style="max-height: 200px;">`
                                : ""}
                         </div>
                    </div>`);
            }
            if ($(".btnDeleteComment").length){
                activateRemove();
            }
        } else {
            alert("Comment is invalid");
            console.error("Échec de l'affichage des commentaires:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des commentaires", error);
    }
}

function formatTime(timers){
    if (timers == null){ return "-";}

    const minutesTotal = timers.reduce((tempsTotal, valeurCourante)=> tempsTotal + valeurCourante,0);
    const heures = Math.floor(minutesTotal / 60);
    const minutes = minutesTotal % 60;

    //On gère l'affichage
    if (heures === 0)
        return `${minutes}min`;
    if (minutes === 0)
        return `${heures}h00`;
    return `${heures}h${minutes}`;
}

function activateRemove(){
    const btns = document.getElementsByClassName("btnDeleteComment");
    //console.log(btns);
    //Si la personne met plusieurs commentaires
    for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function(){
            deleteComment(this);
        });
    }
}

async function deleteComment(obj){
    const recipeId = JSON.parse(localStorage.getItem("data")).id;
    const timestamp = obj.getAttribute('data-timestamp');

    try {
        console.log("Envoi de la requête à:", `${webServerAddress}/comment/${recipeId}`);
        const response = await fetch(`${webServerAddress}/comment/${recipeId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({timestamp}),
        });

        // Afficher le statut de la réponse
        console.log("Statut de la réponse HTTP:", response.status);

        // Vérifier si la réponse est correcte (statut 200)
        if (response.ok) {
            const result = await response.json(); // Parse la réponse JSON
            console.log("Retour du serveur:", result);  // Affiche les recettes véganes
            window.location.reload();
        } else {
            console.error("Échec de la requête:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Erreur lors de l'envoie de la requête:", error);
    }
}

async function addTranslation(event){
    const body = new URLSearchParams(new FormData(event.target));
    
    //On récupère l'id
    const recipeId = JSON.parse(localStorage.getItem("data")).id;
    body.append("idrecipe", recipeId);

    console.log("Données envoyées:", body.toString());
    try {
        console.log("Envoi de la requête à:", `${webServerAddress}/recipe/translate/${recipeId}`);
        const response = await fetch(`${webServerAddress}/recipe/translate/${recipeId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body
        });

        console.log("Statut de la réponse HTTP:", response.status);
        const text = await response.text(); // Lire la réponse en texte brut
        
        console.log("Réponse brute du serveur:", text); // Debug

        if (response.ok) {
            const result = JSON.parse(text);
            console.log("Traduction réussie:", result);
            alert("Traduction de recette réussie !");
            window.location.href = result.redirect; // Redirection vers index.html
        } else {
            alert("Traduction is invalid");
            console.error("Échec de l'ajout de la traduction :", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Erreur lors de la création de traduction:", error);
    }
}