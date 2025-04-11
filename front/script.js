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

//Pour le bouton fermer des recettes
const btnCloseRecipe = document.getElementById("btn-close");
if (btnCloseRecipe){
    btnCloseRecipe.addEventListener("click", function(){
        $(".recipe-card").addClass("hide"); //JQuery
    });
}

//Lance toutes les scripts utiles lors du chargement d'une page
const recipeContainer = document.getElementById("recipes");
const navbar = document.getElementById("user-navbar");
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
        displayOmnivoresRecipe();
        displayVegetariensRecipe();
        displayVeganRecipes();
    }

    //Pour la page recipe.html
    const container = document.getElementById("info-recipe");
    if (container){
        consultRecipe();
        showComments();
    }
});


const searchInput = document.getElementById("searchedRecipe");
document.addEventListener("DOMContentLoaded", () =>{
    if (searchInput) {
        searchInput.addEventListener("input", async () => {
            const searchTerm = searchInput.value.trim();
            if (searchTerm.length > 1) {
                const recipes = await searchRecipes(searchTerm);
                displaySearchResults(recipes);
            } else {
                // Optional: reset to default recipes when input is empty
                clearSearchResults();
                displayOmnivoresRecipe();
                displayVegetariensRecipe();
                displayVeganRecipes();
            }
        });
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

        if (response.ok) {
            const result = JSON.parse(text);
            console.log("Déconnexion réussie:", result);
            localStorage.setItem("isAuth", false);
            window.location.href = result.redirect; // redirection vers login.html

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
    
    console.log("IsConnected : ", isConnected);
    
    //L'utilisateur est connecté
    if (isConnected === "true"){
        //Bouton de déconnexion
        $("#user-navbar").append('<form id="form-deconnexion"><input class="inputDeconnexion" type="submit" value="Déconnexion"/></form>');

        if (formComment){
            $("#form-comment").before("<h5>Give your opinion / Donner votre avis</h5>");
            $("#input-firstname").append("<input type='text' name='firstname' placeholder='Firstname/Prenom' required/>");
            $("#input-lastname").append("<input type='text' name='lastname' placeholder='Lastname/Nom' required/>");
            $("#txtArea-message").append("<textarea id='message' name='message' rows='5' cols='33'></textarea>");
            $("#txtArea-message").after("<input class='btn btn-primary' type='submit' value='Envoyer'/>");
        }
    }

    //L'utilisateur est déconnecté
    if (localStorage.getItem("isAuth" === null) || isConnected === "false") {
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
    const body = new URLSearchParams(new FormData(event.target));
    body.append("idrecipe", recipeId);

    console.log("Données envoyées:", body.toString());
    try {
        console.log("Envoi de la requête à:", `${webServerAddress}/comment/${recipeId}`);
        const response = await fetch(`${webServerAddress}/comment/${recipeId}`, {
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
            console.log("Création du commentaire réussie:", result);
            //window.location.reload();

            return result;
        } else {
            alert("Password is invalid");
            console.error("Échec de la création du commentaire:", response.status, response.statusText);
        }
    } catch (error) {
        alert("Le commentaire n'a pas pu être créé");
        console.error("Erreur lors de la création du commentaire:", error);
    }
}

/***********************/
/** Pour les recettes **/
/***********************/
async function displayOmnivoresRecipe() {
    try {
        console.log("Envoi de la requête à: ", `${webServerAddress}/recipe/omnivoresRecipes`);

        // Envoi de la requête GET avec fetch() et récupération de la réponse
        const response = await fetch(`${webServerAddress}/recipe/omnivoresRecipes`, {
            method: "GET",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        });

        // Afficher le statut de la réponse
        console.log("Statut de la réponse HTTP:", response.status);

        // Vérifier si la réponse est correcte (statut 200)
        if (response.ok) {
            const result = await response.json(); // Parse la réponse JSON
            console.log("Recettes omnivores récupérés:", result);  // Affiche les recettes véganes
            for(let i = 0; i < result.length; i++){
                $("#recipes-omnivores").append('<div class="recipe" data-id="'+result[i].id+'" onclick="showRecipe(this)"><img src="'+result[i].imageURL+'" alt="food" class="food-image"><h2>'+result[i].nameFR+'</h2></div>');
            }
        } else {
            console.error("Échec de la requête:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Erreur lors de l'affichage des recettes omnivores:", error);
    }
}

async function displayVegetariensRecipe() {
    try {
        console.log("Envoi de la requête à: ", `${webServerAddress}/recipe/vegeRecipes`);

        // Envoi de la requête GET avec fetch() et récupération de la réponse
        const response = await fetch(`${webServerAddress}/recipe/vegeRecipes`, {
            method: "GET",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        });

        // Afficher le statut de la réponse
        console.log("Statut de la réponse HTTP:", response.status);

        // Vérifier si la réponse est correcte (statut 200)
        if (response.ok) {
            const result = await response.json(); // Parse la réponse JSON
            console.log("Recettes omnivores récupérés:", result);  // Affiche les recettes véganes
            for(let i = 0; i < result.length; i++){
                $("#recipes-vegetariens").append('<div class="recipe" data-id="'+result[i].id+'" onclick="showRecipe(this)"><img src="'+result[i].imageURL+'" alt="food" class="food-image"><h2>'+result[i].nameFR+'</h2></div>');
            }
        } else {
            console.error("Échec de la requête:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Erreur lors de l'affichage des recettes omnivores:", error);
    }
}

async function displayVeganRecipes() {
    try {
        console.log("Envoi de la requête à: ", `${webServerAddress}/recipe/veganRecipes`);

        // Envoi de la requête GET avec fetch() et récupération de la réponse
        const response = await fetch(`${webServerAddress}/recipe/veganRecipes`, {
            method: "GET",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        });

        // Afficher le statut de la réponse
        console.log("Statut de la réponse HTTP:", response.status);

        // Vérifier si la réponse est correcte (statut 200)
        if (response.ok) {
            const result = await response.json(); // Parse la réponse JSON
            console.log("Recettes véganes récupérées:", result);  // Affiche les recettes véganes
            for (let i = 0; i < result.length; i++) {
                $("#recipes-vegans").append('<div class="recipe" data-id="'+result[i].id+'" onclick="showRecipe(this)"><img src="'+result[i].imageURL+'" alt="food" class="food-image"><h2>'+result[i].nameFR+'</h2></div>');
            }
        } else {
            console.error("Échec de la requête:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Erreur lors de l'affichage des recettes véganes:", error);
    }
}

async function showRecipe(obj){
    //const recipeId = encodeURIComponent(obj.getAttribute("value"));
    
    const recipeId = obj.getAttribute("data-id").trim();
    console.log("Envoi de la requête à: ", `${webServerAddress}/recipe/${recipeId}`);
    
    // Envoi de la requête GET avec fetch() et récupération de la réponse
     const response = await fetch(`${webServerAddress}/recipe/${recipeId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",  // Assurez-vous que le serveur attend du JSON
        }
    });
    
    console.log("Réponse du serveur:", response.status);

    // Vérifier si la réponse est OK et récupérer les données
    if (response.ok) {
        const data = await response.json();
        $(".recipe-card").removeClass("hide");
        $(".names").remove();
        $(".ingredient-container").remove();
        $(".toRecipe").remove();
        $(".btn-voirplus").remove();

        //Pour les noms et l'image
        let $names = $("<div class='names'>");
        let $nameReceipe = $("<div class='nameRecipe'>");
        let $nameAuthor = $("<div class='nameAuthor'>");
        //Pour la liste des ingrédients
        let $containerIng = $("<div class='ingredient-container'>");
        let $flexIngredients = $("<div class='flex-Ingredients'>");
        
        //Nom de la receitte
        $nameReceipe.append(data.nameFR);
        $names.append($nameReceipe);
        //Nom de l'auteur de la recette
        $nameAuthor.append(data.Author);
        $names.append($nameAuthor);
        //Image de la recette
        $names.append("<img src='"+data.imageURL+"' alt='food' class='food-image'>");
        //Liste des ingrédients
        $containerIng.append("<h2>Ingredients : </h2>");
        $containerIng.append($flexIngredients);
        
        if (data.ingredientsFR != null){
            for (let ingredient of data.ingredientsFR){
                let $ingredient = $("<div class='ingredient'>");
                let $img_card = $("<div class='img-card'>");
        
                $ingredient.append($img_card);
                $img_card.append("<img src='"+ingredient.imageIng+"' alt='Ing' class='Ing-image'>");
        
                
                $ingredient.append("<span class='quantity'>"+ingredient.quantity+"</span>");
                $ingredient.append("<span class='name'>de "+ingredient.name+"</span>");
        
                $flexIngredients.append($ingredient);
            }
        }else {
            for (let ingredient of data.ingredients){
                let $ingredient = $("<div class='ingredient'>");
                let $img_card = $("<div class='img-card'>");
        
                $ingredient.append($img_card);
                $img_card.append("<img src='"+ingredient.imageIng+"' alt='Ing' class='Ing-image'>");
        
                
                $ingredient.append("<span class='quantity'>"+ingredient.quantity+"</span>");
                $ingredient.append("<span class='name'>of "+ingredient.name+"</span>");
        
                $flexIngredients.append($ingredient);
            }
        }
        
        $(".recipe-card").append($names);
        $(".recipe-card").append($containerIng);
        $(".recipe-card").append("<div onclick='sendToPageRecipe()'><span class='btn-voirplus'>Voir plus</span></div>");
        localStorage.setItem("data", JSON.stringify(data)); //On save au cas où l'utilisateur voudrait regarder plus    
    } else {
        console.error("Erreur lors de la récupération des données", response.status);
    }
}

async function sendToPageRecipe(){
    window.location.href="recipe.html";
}

async function consultRecipe(){
    const dataString = localStorage.getItem("data");
    const data = JSON.parse(dataString);

    //On vérifie si la langue français est disponible
    if (data["nameFR"] == null || data["ingredientsFR"] == null || data["descriptionFR"] == null){
        $(".main-info-recipe").after("<div class='alert-lg col-1'>Cette recette n'est pas traduite entièrement en Français.</div>")
        
        //En-tête
        $("#recipe-name").append(data["name"]);
        $("#auteur").append(data["Author"]);
        $("#duree").append(formatTime(data["timers"]));

        //Box de gauche
        if (data["Without"] != null)
        {
            for(let sans of data["Without"])
            {
                $("#without").append(sans +", ");
            }
        }
        $("#description").append(data["description"]);
        $("#img-recipe").append("<img src="+data["imageURL"]+" alt=img-"+data["name"]+">");
        
        //Box de droit
        for (let ingredient of data["ingredients"]){
            $("#list-ingredients").append(
                "<div class='p-2 border rounded'>"+
                    "<span>"+ingredient["name"]+"</span>"+
                    "<img src="+ingredient["imageIng"]+" alt=img-"+ingredient["name"]+">"+
                    "<p>"+ingredient["quantity"]+"</p>"+
                "</div>");
        }

        let index = 1;
        for (let etape of data["steps"]){
            $("#list-preparation").append(
                "<div class='p-2 border rounded'>"+
                    "<span>"+index+". "+etape+"</span>"+
                "</div>");
                index++;
        }
    }else {
        //En-tête
        $("#recipe-name").append(data["nameFR"]);
        $("#auteur").append(data["Author"]);
        $("#duree").append(formatTime(data["timers"]));

        //Box de gauche
        if (data["Without"] != null)
        {
            for(let sans of data["Without"])
            {
                $("#without").append(sans +", ");
            }
        }
        $("#description").append(data["descriptionFR"]);
        $("#img-recipe").append("<img src="+data["imageURL"]+" alt=img-"+data["name"]+">");
        
        //Box de droit
        for (let ingredient of data["ingredientsFR"]){
            $("#list-ingredients").append(
                "<div class='p-2 border rounded'>"+
                    "<span>"+ingredient["name"]+"</span>"+
                    "<img src="+ingredient["imageIng"]+" alt=img-"+ingredient["name"]+">"+
                    "<p>"+ingredient["quantity"]+"</p>"+
                "</div>");
        }

        let index = 1;
        for (let etape of data["setpsFR"]){
            $("#list-preparation").append(
                "<div class='p-2 border rounded'>"+
                    "<span>"+index+". "+etape+"</span>"+
                "</div>");
                index++;
        }
    }  
}

function formatTime(timers){
    if (timers == null){ return "-"; }

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

async function showComments(){
    const recipeId = JSON.parse(localStorage.getItem("data")).id;

    try {
        console.log("Envoi de la requête à:", `${webServerAddress}/comment/${recipeId}`);
        const response = await fetch(`${webServerAddress}/comment/${recipeId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log("Statut de la réponse HTTP:", response.status);
        const text = await response.text(); // Lire la réponse en texte brut
        console.log("Réponse brute du serveur:", text); // Debug
        

        if (response.ok) {
            const commentaires = JSON.parse(text);
            /*Affichage des commentaires*/
            if (commentaires[recipeId] === undefined){
                return;
            };

            console.log("Nb commentaires :", commentaires[recipeId].length);

            for (let i=0; i< commentaires[recipeId].length; i++){
                let time = new Date(commentaires[recipeId][i].timestamp);
                const date = time.toISOString().split("T")[0];
                const heure = time.toISOString().split("T")[1].split('.')[0];
                $("#commentaires").append("<div class='block-comment"+i+" col-md-6 mb-4'><div class='fw-bold'>"+commentaires[recipeId][i].firstname+" "+commentaires[recipeId][i].lastname+ " " + date + " à " + heure +"</div>");
                $(".block-comment"+i+"").append("<div class='border rounded p-1'>"+commentaires[recipeId][i].message+"</div>");
            }
        } else {
            alert("Comment is invalid");
            console.error("Échec de l'affichage des commentaires:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des commentaires", error);
    }
}


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
    $("#recipes-omnivores").empty();
    $("#recipes-vegetariens").empty();
    $("#recipes-vegans").empty();

    if (recipes.length === 0) {
        $("#recipes-omnivores").append("<p>Aucune recette trouvée.</p>");
        return;
    }

    for (let recipe of recipes) {
        const recipeCard = `
            <div class="recipe" data-id="${recipe.id}" onclick="showRecipe(this)">
                <img src="${recipe.imageURL}" alt="food" class="food-image">
                <h2>${recipe.nameFR || recipe.name}</h2>
            </div>
        `;
        $("#recipes-omnivores").append(recipeCard);
    }
}

function clearSearchResults() {
    $("#recipes-omnivores").empty();
    $("#recipes-vegetariens").empty();
    $("#recipes-vegans").empty();
}



