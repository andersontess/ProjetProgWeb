"use strict"

const webServerAddress = "http://localhost:8080";


/*********************************************
 **                                         **
 **   Gestion des événements utilisateurs   **
 **               Formulaires               **
 **                                         **
 *********************************************/

// Pour le formulaire de création de compte 
const formCreationCompte = document.getElementById("creationCompte");
if (formCreationCompte) {
	// Ajout d'un écouteur d'événement pour le formulaire de création de compte
	formCreationCompte.addEventListener("submit", async (event) => {
        // Empêcher la soumission du formulaire par défaut (rechargement de la page)
        event.preventDefault();
        await creationCompte(event);
        event.target.reset();
    });
}

// Pour le formulaire de connexion
const formConnexion = document.getElementById("connexion");
if (formConnexion) {
	formConnexion.addEventListener("submit", async (event) => {
        event.preventDefault();
        await connexion(event);
        event.target.reset();
    });
}

//Pour le formulaire de la traduction
const formTranslate = document.getElementById("form-translate");
if (formTranslate){
    displayPageTranslate();
    formTranslate.addEventListener("submit", async (event) => {
        event.preventDefault();
        await addTranslation(event);
        event.target.reset();
    });
}

const formComment = document.getElementById("form-comment");
if (formComment){
    formCommentAuthUser();

    //Lorsque l'utilisateur soumet un commentaire
    formComment.addEventListener("submit", async(event)=>{
        event.preventDefault();
        await addComment(event);
        event.target.reset();
    });
}

//Pour le formulaire de creation de recette
const formCreationRecettte = document.getElementById("form-create");
if (formCreationRecettte){

    //Lorsque l'utilisateur soumet la recette
    formCreationRecettte.addEventListener("submit", async(event)=>{
        event.preventDefault();
        await addRecipe(event);
        event.target.reset();
    });
}

/*********************************************
 **                                         **
 **   Gestion des événements utilisateurs   **
 **                 Cliques                 **
 **                                         **
 *********************************************/

// Pour fermer la carte de recette, lorsque l'utilisateur clique à côté
const divRecipeCard = document.getElementById("recipe-card");
if (divRecipeCard){
    document.addEventListener('click', ()=>{
        $(".recipe-card").addClass("hide");
    });
}

// Pour la barre de navigation
const navbar = document.getElementById("user-navbar");
if (navbar){
    // "then" attend la fin de la fonction avant de continuer (il le faut car sinon form-deconnexion est n'existe pas)
    navbarAuthUser().then(() =>{
        
        //Pour le boutton de deconnexion (Il doit être ici car le formulaire est créée dans navbarAuthUser)
        const btnDeconnexion = document.getElementById("btn-deconnexion");
        if (btnDeconnexion){
            btnDeconnexion.addEventListener("click", async(event)=>{
                event.preventDefault();
                await deconnexion(event);
                event.target.reset();
            });
        }

        // Pour le boutton de profil 
        const btnProfil = document.getElementById("btn-profil");
        if (btnProfil){
            btnProfil.addEventListener("click", async(event)=> {
                event.preventDefault();
                await sendToProfile();
                event.target.reset();
            });
        }
    });
}

//Pour afficher les recettes, like par l'utilisateur
const btnRecipesLiked = document.getElementById("recipes-likes");
if (btnRecipesLiked){
    btnRecipesLiked.addEventListener('click', ()=> {
        $("#result").empty();
        getRecipesLiked();
    });
}

//Pour modifier la photo de profil
const btnImageProfile = document.getElementById("img-user");
if (btnImageProfile){
    btnImageProfile.addEventListener('click', ()=> {
        document.getElementById("fileInput").click();
    });
}

const fileInput = document.getElementById("fileInput");
if (fileInput){
    fileInput.addEventListener("change", function (event) {
        handleImageSelected(event);
    });
}



// Pour supprimer le compte lorsque l'utilisateur clique sur le button
const btnDeleteAccount = document.getElementById("deleteAccount");
if (btnDeleteAccount){
    btnDeleteAccount.addEventListener('click', ()=>{
        console.log("A faire !");
    });
}

/*********************************************
 **                                         **
 **         Gestion de l'affichage          **
 **               des pages                 **
 **                                         **
 *********************************************/

/* ============ PAGE index.html ============*/
const recipeContainer = document.getElementById("presentation-recipes");
if (recipeContainer){
    displayRecipesPageIndex();
}

const searchInput = document.getElementById("searchedRecipe");
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

/* ============ PAGE recipe.html ============*/
const containerRecipe = document.getElementById("info-recipe");
if (containerRecipe){
    displayPageRecipe();
    getComments();
    displayPageRecipeByRole().then(() =>{
        const btnLike = document.getElementById("heart");
        if(btnLike){
            btnLike.addEventListener('click', (event)=>{
                animationBtnLike(event.currentTarget);
            });
        }
    });

    reloadPageRecipe().then(() => {
        checkBtnLiked();
    })
}

/* ============ PAGE profile.html ============*/
    const containerProfile = document.getElementById("profile-user");
    if (containerProfile){
        displayPageProfile();
        displayPageProfileByRole().then(() =>{
            const btnRecipesCreated = document.getElementById("recipes-create");
            if (btnRecipesCreated){
                btnRecipesCreated.addEventListener('click', ()=> {
                    $("#result").empty();
                    getRecipesCreated();
                });
            }
        });
    }


/* var email = document.getElementById("email");

email.addEventListener("keyup", function (event) {
  if (email.validity.typeMismatch) {
    email.setCustomValidity("L'email est invalide");
  } else {
    email.setCustomValidity("");
  } 
});*/

/*********************************************
 **                                         **
 **      Gestion de l'authentification      **
 **               utilisateur               **
 **                                         **
 *********************************************/

 //Permet de créer un compte utilisateur
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
        const text = await response.text();             // Lire la réponse en texte brut
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

// Permet de connecter un utilisateur
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
            window.location.href = result.redirect; // Redirection vers index.html

            return result;
        } else {
            console.error("Échec de la connexion:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
    }
}

// Permet de déconnecter un utilisateur
async function deconnexion(){
    try{
        console.log("Envoi de la requête à: ", `${webServerAddress}/auth/logout`);
        const response = await fetch(`${webServerAddress}/auth/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded", 
            },
        });

        console.log("Statut de la réponse HTTP:", response.status);
        const text = await response.text();
        console.log("Réponse brute du serveur",text);

        if(response.ok) {
            const result = JSON.parse(text);
            console.log("Déconnexion réussie:", result);
            window.location.href = result.redirect;

            return result;
        } else {
            console.error("Échec de la déconnexion:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);
    }
}

//Permet de déconnecter un utilisateur
async function checkloggedInUser() {
    try{
        const response = await fetch(`${webServerAddress}/auth/userSession`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
    
        const textServ= await response.text();
        //console.log("Réponse brute du serveur :", textServ); 
        const session_user = JSON.parse(textServ);
        
        if (response.ok) {
            return session_user;
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi de la requête checkloggedInUser:", error);
    }
}

/*********************************************
 **                                         **
 **      Modification des informations      **
 **             de l'utilisateur            **
 **                                         **
 *********************************************/
async function handleImageSelected(event){
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    
    try {
        const response = await fetch(`${webServerAddress}/auth/addPhoto`, {
            method: "POST",
            body: formData, // No need to set Content-Type; browser does it for FormData
        });

        console.log("Statut de la réponse HTTP:", response.status);
        const text = await response.text();
        console.log("Réponse brute du serveur:", text);

        if (response.ok) {
            const result = JSON.parse(text);
            window.location.reload();
        } else {
            alert("Image invalide");
            console.error("Erreur lors de l'ajout de l'image:", response.status, response.statusText);
        }
    } catch (error) {
        alert("Erreur lors de l'envoi de l'image.");
        console.error("Erreur:", error);
    }
}

/*********************************************
 **                                         **
 **       Actions utilisateur sur les       **
 **                recettes                 **
 **                                         **
 *********************************************/
async function addRecipe(event){
    const body = new URLSearchParams(new FormData(event.target));

    try{
        console.log("Envoi de la requête à:", `${webServerAddress}/recipe/addRecipe`);
        const response = await fetch(`${webServerAddress}/recipe/addRecipe`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body
        });

        //console.log("Statut de la réponse HTTP:", response.status);
        const text = await response.text(); // Lire la réponse en texte brut
        console.log("Réponse brute du serveur:", text); // Debug

        if (response.ok) {
            const result = await JSON.parse(text);
            showAlert(result.message,"green");
        } else {
            alert("Recipe invalid");
            console.error("Échec de l'ajout de la recette :", response.status, response.statusText);
        }
    } catch{
        alert("Erreur lors de l'envoi de la requête");
        console.error("Erreur:", error);
    }
}

// Permet de récupérer une recette en lui donnant l'id
async function getRecipe(recipeId)
{    
    try{
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
            return data;
        } else {
            console.error("Erreur lors de la récupération des données", response.status);
        }
    } catch (error) {
        alert("Erreur lors de l'envoi de la requête de la récupération de la recette");
        console.error("Erreur:", error);
    }
}

async function sendToRecipe(input){
    const recipeId = input.getAttribute("data-id").trim();
    const recipe = await getRecipe(recipeId);
    
    localStorage.setItem("data", JSON.stringify(recipe));
    window.location.href = "recipe.html";
}

async function reloadPageRecipe(){
    const recipeId = JSON.parse(localStorage.getItem("data")).id;
    const recipe = await getRecipe(recipeId);

    localStorage.setItem("data", JSON.stringify(recipe));
}

//L'utilisateur ajoute un commentaire
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
            showAlert('Commentaire créé avec succès !',"green");
        } else {
            alert("Commentaire invalide");
            console.error("Erreur création commentaire:", response.status, response.statusText);
        }
    } catch (error) {
        alert("Erreur lors de l'envoi du commentaire.");
        console.error("Erreur:", error);
    }
}

// L'utilisateur utiliser la barre de recherche
async function searchRecipes(query) {
    try {
        const response = await fetch(`${webServerAddress}/recipe?search=${encodeURIComponent(query)}`);
        const rawText = await response.text();      // lire d'abord en texte brut
        console.log("Texte brut reçu du serveur:", rawText);

        const result = JSON.parse(rawText);
        console.log("Objet JSON parsé:", result);

        return result;
    } catch (error) {
        console.error("Erreur lors de la recherche de recettes:", error);
        return [];
    }
}

//L'utilisateur ajoute une traduction
async function addTranslation(event){
    const body = new URLSea
    rchParams(new FormData(event.target));
    
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

        //console.log("Statut de la réponse HTTP:", response.status);
        const text = await response.text(); // Lire la réponse en texte brut
        //console.log("Réponse brute du serveur:", text); // Debug

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

async function addLikeToRecipe(){
    //On récupère les données utiles
    const recipeId = JSON.parse(localStorage.getItem("data")).id;

    try {
        console.log("Envoi de la requête à:", `${webServerAddress}/recipe/${recipeId}/like`);
        const response = await fetch(`${webServerAddress}/recipe/${recipeId}/like`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body : JSON.stringify({
                "recipeId": recipeId
            })
        });

        console.log("Statut de la réponse HTTP:", response.status);
        const text = await response.text(); // Lire la réponse en texte brut
        console.log("Réponse brute du serveur:", text); // Debug

        if (response.ok) {
            const result = JSON.parse(text);
            showAlert(result.message, "pink");
        } else {
            alert("Like not valid");
            console.error("Échec de l'ajout du like :", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Erreur lors de l'envoie de la requête like:", error);
    }  
}

async function removeLikeFromRecipe(){
    //On récupère les données utiles
    const recipeId = JSON.parse(localStorage.getItem("data")).id;

    try {
        console.log("Envoi de la requête à:", `${webServerAddress}/recipe/${recipeId}/like`);
        const response = await fetch(`${webServerAddress}/recipe/${recipeId}/like`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body : JSON.stringify({
                "recipeId": recipeId
            })
        });

        console.log("Statut de la réponse HTTP:", response.status);
        const text = await response.text(); // Lire la réponse en texte brut
        console.log("Réponse brute du serveur:", text); // Debug

        if (response.ok) {
            const result = JSON.parse(text);
        } else {
            alert("Like not valid");
            console.error("Échec de l'ajout du like :", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Erreur lors de l'envoie de la requête like:", error);
    }  
}

/*********************************************
 **                                         **
 **       Gestion de l'affichage en         **
 **        fonction de l'utilisateur        **
 **                                         **
 *********************************************/
async function navbarAuthUser(){
    const session = await checkloggedInUser();

    //L'utilisateur est connecté
    if (!session || Object.values(session).length > 0){
        //Bouton de déconnexion
        $("#user-navbar").append
        (`
            <button id="btn-profil" class="input-form"><a>Profil</a></button>
            <button id="btn-deconnexion" class="input-form"><a>Déconnexion</a></button>
        `);
    }else {
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

// Modifie la page recipe en fonction du rôle de l'utilisateu
async function displayPageRecipeByRole(){
    let varSession = await checkloggedInUser();

    //Pas connecté
    if (varSession.length ===0){
        return;
    }

    //Connecté 
    if (varSession.role === "cuisinier" || varSession.role === "DemandeTraducteur" || varSession.role === "DemandeChef"){
        console.log("Cuisinier");
    } 

    if (varSession.role === "traducteur"){
        const alert = document.getElementById("alert-lg");
        if (alert){
            alert.innerHTML += '<button class="button-lg" type="button" onclick="window.location.href=\'translate.html\'">Traduire</button>'
        }
    }
    
    // L'utilisateur est connecté alors on ajoute un button like
    if ($("#alert-lg").length){
        $("#alert-lg").after(`<div id='heart' class='button-like'></div>`);
    }else {
        $("#lg-select").after(`<div id='heart' class='button-like'></div>`);
    }
}

async function formCommentAuthUser(){
    const formComment = document.getElementById("form-comment");
    const session = await checkloggedInUser();

    //L'utilisateur est connecté
    if (!session || Object.values(session).length > 0){
        if (formComment){
            $("#form-comment").before("<h5>Give your opinion / Donner votre avis</h5>");
            $("#input-firstname").append("<input type='text' name='firstname' placeholder='Firstname / Prenom' required/>");
            $("#input-lastname").append("<input type='text' name='lastname' placeholder='Lastname / Nom' required/>");
            $("#txtArea-message").append("<textarea id='message' name='message' rows='5' cols='33' placeholder='Commentary / Commentaire'></textarea>");
            $("#input-image").append(`<input class="form-control" type="file" id="image" name="image" accept="image/*">`);
            $("#txtArea-message").after("<input class='btn btn-primary' type='submit' value='Envoyer'/>");
        }
    }else {
        $("#form-comment").append("<h4>Connectez vous pour pouvoir écrire un commentaire !</h4>")
    }
}     

async function checkBtnLiked(){
    // Pour obtenir la recette
    const dataString = localStorage.getItem("data");
    const data = JSON.parse(dataString);
    // Pour obtenir l'id utilisateur
    const session = await checkloggedInUser();
    const userId = session.id;

    const likes = data['likes'];

    for (let like of likes){
        if (like === userId){
            $("#heart").addClass("active");
        }
    }
}

async function getRecipesLiked(){
    try {
        console.log("Envoi de la requête à: ", `${webServerAddress}/recipe/RecipesLiked`);
        const response = await fetch(`${webServerAddress}/recipe/RecipesLiked`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Afficher le statut de la réponse
        console.log("Statut de la réponse HTTP:", response.status);

        // Vérifier si la réponse est correcte (statut 200)
        if (response.ok) {
            const result = await response.json();        // Parse la réponse JSON
            console.log(result);
            renderRecipes(result, "liked");                  // Affichage des recettes obtenus
        } else {
            console.error("Échec du retour:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi de la requete :", error);
    }
}

async function getRecipesCreated(){
    try {
        console.log("Envoi de la requête à: ", `${webServerAddress}/recipe/RecipesCreated`);
        const response = await fetch(`${webServerAddress}/recipe/RecipesCreated`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Afficher le statut de la réponse
        console.log("Statut de la réponse HTTP:", response.status);

        // Vérifier si la réponse est correcte (statut 200)
        if (response.ok) {
            const result = await response.json();        // Parse la réponse JSON
            console.log(result);
            renderRecipes(result, "created");                  // Affichage des recettes obtenus
        } else {
            console.error("Échec du retour:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi de la requete :", error);
    }
}
/*********************************************
 **                                         **
 **       Affichage du contenu              **
 **               des pages                 **
 **                                         **
 ********************************************/

/* ============ PAGE index.html ============*/

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
            const result = await response.json();   // Parse la réponse JSON
            renderRecipesIndex(result);                  // Affichage des recettes obtenus
        } else {
            console.error("Échec de la requête:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Erreur lors de l'affichage des recettes omnivores:", error);
    }
}

function renderRecipesIndex(recipes)
{
    //Les catégories qu'on veut afficher
    let Categories = ["Omnivores", "Végétarien", "Vegan"];

    //Pour chaque catégorie, on boucle pour l'afficher
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
            <div class="recipe" data-id="${recipe.id}" onclick="displayContentCard(this)">
                <img src="${recipe.imageURL}" alt="food" class="food-image">
                <h2>${recipe.nameFR}</h2>
            </div>
        `);
    });
}

//Pour afficher la carte d'une recette
async function displayContentCard(obj)
{   
    const recipeId = obj.getAttribute("data-id").trim();
    const data = await getRecipe(recipeId);
    console.log(data);

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

// Pour afficher la recherche de l'utilisateur
function displaySearchResults(recipes) {
    // On enlève la recherche précédente en vidant l'élément
    $("#container-search").empty();
    
    $("#container-search").append
    (`
        <h2>Recherche</h2>
        <div id="recipes-search" class="row"></div>
    `);

    if (recipes.length === 0) {
        $("#recipes-search").append
        (`
            <div class="content-center">
                <h4>Aucune recette trouvée.</h4>
                <img class="img-not-find-recipe" src="img/no-recipe.png" alt="img-no-recipe">
            </div>
        `);
        return;
    }

    for (let recipe of Object.values(recipes)) {
        const recipeCard = 
        `
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

/* ============ PAGE recipe.html ============*/

// L'utilisateur veut consulter une recette, donc on l'affiche
async function displayPageRecipe(){
    // Pour obtenir la recette
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
    if (!isFR && (!data["nameFR"] || !data["ingredientsFR"] || !data["stepsFR"])) 
    {
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
    for (let ingredient of ingredients) 
    {
        $("#list-ingredients").append
        (`
            <div class='p-2 border rounded'>
                <span>${ingredient["name"]}</span>
                <img src="${ingredient["imageIng"]}" alt="img-${ingredient["name"]}">
                <p>${ingredient["quantity"]}</p>
            </div>
        `);
    }

    // Étapes
    $("#list-preparation").empty();
    for (let [index,etape] of steps.entries()) 
    {
        $("#list-preparation").append
        (`
            <div class='p-2 border rounded'>
                <span>${index+1}. ${etape}</span>
            </div>
        `);
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

/* ============ PAGE translate.html ============*/

function displayPageTranslate(){
    //Récupération des données
    const dataString = localStorage.getItem("data");
    const recipe = JSON.parse(dataString);

    renderNamePageTranslate(recipe);
    renderAuthorPageTranslate(recipe);
    renderWithoutPageTranslate(recipe);
    renderDescriptionsPageTranslate(recipe);
    renderIngredientsPageTranslate(recipe);
    renderStepsPageTranslate(recipe);
}

// ----------- Début des fonctions pour displayPageTranslate -----------
function renderNamePageTranslate(recipe)
{
    if (!recipe.nameFR) 
    {
        $("#nameFR").append("<input type='text' name='nameFR' placeholder='Insérez le nom de la recette' required>");
    } else {
        $("#nameFR").append(`<h2>${recipe.nameFR}</h2>`);
    }
    $("#name").append(`<h2>${recipe.name}</h2>`);
}

function renderAuthorPageTranslate(recipe){
    const authorText = recipe.Author ? `Author : ${recipe.Author}` : "Author: Unknown";
    $(".author").append(`<p>${authorText}</p>`);
}

function renderWithoutPageTranslate(recipe){
    const withoutText = recipe.Without?.join(" ") || "Unknown";
    $(".p-without").append(withoutText);
}

function renderDescriptionsPageTranslate(recipe){
    $(".description").append(`<p>${recipe.description || "Description not available"}</p>`);

    if (recipe.descriptionFR) {
        $(".descriptionFR").append(`<p>${recipe.descriptionFR}</p>`);
    } else {
        $(".descriptionFR").append(`<p>Description non disponible</p>`);
        if (recipe.description) {
            $(".descriptionFR").append(`<textarea name="descriptionFR" rows="5" required></textarea>`);
        }
    }

    equalizeHeights("description", "descriptionFR");
}

function renderIngredientsPageTranslate(recipe){
    if (!recipe.ingredients) return;

    // Anglais
    for (const ing of recipe.ingredients) {
        $(".ingredients").append(`
            <div class="px-3">
                <ul class="list-group list-group-flush my-2">
                    <li class="list-group-item">${ing.name}</li>
                    <li class="list-group-item">${ing.type}</li>
                    <li class="list-group-item">${ing.quantity}</li>
                </ul>
            </div>`);
    }

    // Français
    const frIngredients = recipe.ingredientsFR || recipe.ingredients;
    frIngredients.forEach((ing, index) => {
        $(".ingredientsFR").append(`
            <div class="px-3">
                <ul class="list-group my-2">
                    <li><input type="text" name="ingredientFR-name${index}" placeholder="Insérez le nom" value="${ing.name || ''}" ${ing.name ? "readonly" : "required"}></li>
                    <li><input type="text" name="ingredientFR-type${index}" placeholder="Insérez le type" value="${ing.type || ''}" ${ing.type ? "readonly" : "required"}></li>
                    <li><input type="text" name="ingredientFR-quantity${index}" placeholder="Insérez la quantité" value="${ing.quantity || ''}" ${ing.quantity ? "readonly" : "required"}></li>
                </ul>
            </div>`);
    });

    equalizeHeights("ingredients-en", "ingredients-fr");
}
function renderStepsPageTranslate(recipe){
    if (!recipe.steps) return;

    // Anglais
    recipe.steps.forEach((step, index) => {
        $(".steps").append(`
            <div class="step-container border rounded m-2">
                <p>${step}</p>
            </div>`);

        // Si pas de stepsFR, champ de saisie vide
        if (!recipe.stepsFR) {
            $(".etapes").append(`
                <div class="step-container m-2">
                    <textarea name="stepsFR${index}" rows="5" required></textarea>
                </div>`);
        }
    });

    // Français (readonly)
    if (recipe.stepsFR) {
        recipe.stepsFR.forEach((stepFR, index) => {
            $(".etapes").append(`
                <div class="step-container m-2">
                    <textarea name="stepsFR${index}" rows="5" readonly>${stepFR}</textarea>
                </div>`);
        });
    }

    equalizeHeights("steps-en", "steps-fr");
}

function equalizeHeights(id1, id2) {
    const el1 = document.getElementById(id1);
    const el2 = document.getElementById(id2);
    if (el1 && el2) {
        const h1 = el1.offsetHeight;
        const h2 = el2.offsetHeight;
        if (h1 > h2) el2.style.height = h1 + 'px';
        else el1.style.height = h2 + 'px';
    }
}
// ----------- Fin des fonctions pour displayPageTranslate -----------

/* ============ PAGE profile.html ============*/
async function sendToProfile(){
    window.location.href = "profile.html";
}

async function displayPageProfile(){
    const session = await checkloggedInUser();

    renderImgProfile(session);
    renderInfoProfile(session);
}

async function displayPageProfileByRole(){
    let varSession = await checkloggedInUser();

    console.log(varSession);
    //Pas connecté
    if (varSession.length ===0){
        return;
    }

    if (varSession.role === "chef"){
        const btnRecipesLiked = document.getElementById("recipes-likes");
        if (btnRecipesLiked){
            $(btnRecipesLiked).after(`<button id="recipes-create" class="btn-nav">Créations</button>`);
        }
    }
}

// ----------- Début des fonctions pour displayPageProfile -----------
function renderImgProfile(session){
    const containerImg = $("#img-user");
    let insert;

    //Condition
    !session.img 
    ? insert = `<img class="imgProfile" src="img/users/default-profile.png" alt="img-user">`
    : insert = `<img src=${session.img} alt="img-user">`;

    containerImg.append(insert);
}

function renderInfoProfile(session){
    const containerInfo = $("#info-user");
    const IconsRole = {
        cuisinier: 'fa-utensils',
        DemandeChef: 'fa-utensils',
        DemandeTraducteur: 'fa-utensils',
        chef: 'fa-kitchen-set',
        traducteur: 'fa-language'
    };

    Object.entries(session).slice(1,4).forEach(([nom, valeur]) =>{
        let iconClass = '';
        
        if (nom === "mail") {
            iconClass = 'fa-envelope';
        } else if (nom === "username") {
            iconClass = 'fa-user';
        } else if (nom === "role") {
            console.log(IconsRole[valeur]);
            iconClass = IconsRole[valeur] || 'fa-user-tag'; // Fallback icon
        }

        if (iconClass) {
            containerInfo.append(`<p><i class="fas ${iconClass}"></i> : ${valeur}</p>`);
        }
    });
}

function renderRecipes(recipes, caller){
    if (recipes.length == 0 && caller === "liked"){
        $("#result").append(`<img src="img/no-like2.png" class="noLike" alt="Img-noLike">`);
    }else if (recipes.length == 0 && caller === "created"){
        $("#result").append(`<img scr="img/no-recipe-created.png" class="noLike" alt="Img-noRecipe">`);
    }

    recipes.forEach(recipe => {
        $("#result").append
        (`
            <div class="recipe" data-id="${recipe.id}" onclick="sendToRecipe(this)" ">
                <img src="${recipe.imageURL}" alt="food" class="food-image">
                <h2>${recipe.nameFR}</h2>
            </div>
        `);
    });

    if (caller === "created"){
        $("#result").append
        (`
            <div class="recipe" style="height:315.99" onclick="window.location.href=\'createRecipe.html\'" ">
                <h2 class="titre-ajout">Ajouter une recette</h2>
                <div class="add-hover"></div>
            </div>
        `);
    }

}
// ----------- Fin des fonctions pour displayPageProfile -----------

/* ============ PAGE createRecipe.html ============*/
function addDiet(language) {
    //conditions
    const inputId = language === "fr" ? "dietInputFR" : "dietInput";
    const tagsContainerId = language === "fr" ? "dietTagsFR" : "dietTags";
    const inputName = language === "fr" ? "WithoutFR[]" : "Without[]";

    const input = document.getElementById(inputId);
    const value = input.value.trim();

    if (value) {
        const div = document.createElement("div");
        div.className = "diet-tag";
        div.textContent = value;

        // Bouton pour supprimer 
        const closeBtn = document.createElement("i");
        closeBtn.className = "bi bi-x-circle fs-5 align-self-center ms-2";
        closeBtn.style.cursor = "pointer";
        closeBtn.onclick = () => div.remove();
        div.appendChild(closeBtn);

        // Input caché pour l'envoi
        const hidden = document.createElement("input");
        hidden.type = "hidden";
        hidden.name = inputName;
        hidden.value = value;
        div.appendChild(hidden);

        document.getElementById(tagsContainerId).appendChild(div);
        input.value = ""; // reset l'input
    }
}
let ingredientCount = { en: 0, fr: 0 };
function addIngredient(language) {
    const index = ingredientCount[language]++;
    const containerIng = document.createElement("div");
    containerIng.classList.add("container-recipe", "d-flex", "justify-content-between", "position-relative", "mb-3", "p-4");

    const inputName = language === "fr" ? "ingredientsFR" : "ingredients";

    const closeBtn = document.createElement("i");
    closeBtn.className = "bi bi-x-circle fs-5 position-absolute top-0 end-0 m-2 text-danger";
    closeBtn.style.cursor = "pointer";
    closeBtn.onclick = () => containerIng.remove();

    const placeholders = {
        en: { name: "Name", quantity: "Quantity", type: "Type", imgName: "ingredients[][imageIng]" },
        fr: { name: "Nom", quantity: "Quantité", type: "Type", imgName: "ingredientsFR[][imageIng]" }
    };

    const ph = placeholders[language];

    const containerInput = document.createElement("div");
    containerInput.classList.add("d-flex", "flex-column", "gap-2");
    containerInput.innerHTML = `
        <input name="${inputName}[${index}][name]" placeholder="${ph.name}" required>
        <input name="${inputName}[${index}][quantity]" placeholder="${ph.quantity}" required>
        <input name="${inputName}[${index}][type]" placeholder="${ph.type}" required>
    `;

    const containerImg = document.createElement("div");

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.name = ph.imgName;
    fileInput.accept = "image/*";
    fileInput.classList.add("mb-2");

    const previewDiv = document.createElement("div");
    previewDiv.classList.add("previewImg");

    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = function (event) {
                previewDiv.innerHTML = `<img src="${event.target.result}" alt="Preview" style="display:block; margin:auto; max-width: 100px; max-height: 100px;">`;
            };
            reader.readAsDataURL(file);
        } else {
            previewDiv.innerHTML = "";
        }
    });

    containerImg.appendChild(fileInput);
    containerImg.appendChild(previewDiv);

    containerIng.appendChild(closeBtn);
    containerIng.appendChild(containerInput);
    containerIng.appendChild(containerImg);

    document.getElementById(`ingredientsList${language === 'fr' ? 'FR' : ''}`).appendChild(containerIng);
}

function supElement(el){
    el.parentElement.remove();
}

let stepsCount = { en: 0, fr: 0 };
function addStep(language) {
    const index = stepsCount[language]++;
    const containerId = (language === 'fr') ? 'stepsListFR' : 'stepsList';
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Conteneur non trouvé : ' + containerId);
        return;
    }

    // Créer d'abord le conteneur !
    const stepContainer = document.createElement('div');
    stepContainer.classList.add('container-recipe', 'mb-3', 'p-4', 'position-relative');

    // Maintenant que stepContainer existe, tu peux créer le bouton de fermeture
    const closeBtn = document.createElement("i");
    closeBtn.className = "bi bi-x-circle fs-5 position-absolute top-0 end-0 m-2 text-danger";
    closeBtn.style.cursor = "pointer";
    closeBtn.onclick = () => stepContainer.remove(); 
    stepContainer.appendChild(closeBtn);

    // Ajouter le contenu HTML
    $(stepContainer).append(`
        <div class="row">
            <div class="col-6">
                <textarea class="w-100 form-control" name="${language === 'fr' ? 'stepsFR[' + index + '][instruction]' : 'steps[' + index + '][instruction]'}" placeholder="Instruction" required></textarea>
            </div>
            <div class="col-6">
                <input class="w-100 form-control" name="${language === 'fr' ? 'stepsFR[' + index + '][timers]' : 'steps[' + index + '][timers]'}" type="number" placeholder="Duration in minutes" required>
            </div>
        </div>
    `);
    container.appendChild(stepContainer);
}


/*********************************/
/**     Pour les commentaires   **/
/*********************************/

/*******************************************
Pour obtenir les commentaires de la recette
*******************************************/
async function getComments(){
    const recipeId = JSON.parse(localStorage.getItem("data")).id;
    const session = await checkloggedInUser();

    try {
        //Requête pour avoir les commentaires de la recette
        //console.log("Envoi de la requête à:", `${webServerAddress}/comment/${recipeId}`);
        const response = await fetch(`${webServerAddress}/comment/${recipeId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const text = await response.text(); // Lire la réponse en texte brut
        //console.log("Réponse brute du serveur:", text); // Debug
        
        if (response.ok) {
            const commentaires = JSON.parse(text);
            displayComments(commentaires, session, recipeId);
        } else {
            alert("Comment is invalid");
            console.error("Échec de l'affichage des commentaires:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des commentaires", error);
    }
}

/********************************************
Pour afficher les commentaires de la recette
********************************************/
function displayComments(commentaires, session, recipeId){
    //Si l'id n'existe pas alors il y a pas de recettes
    if (!commentaires[recipeId]) {
        return;
    }

    commentaires[recipeId].forEach((commentaire, i) => {
        const time = new Date(commentaire.timestamp);
        const date = time.toISOString().split("T")[0];
        const heure = time.toISOString().split("T")[1].split('.')[0];

        const isAuthor = commentaire.id_user === session.id;
        const deleteBtn = isAuthor
            ? `<i class="bi bi-trash btnDeleteComment" role="button" data-timestamp="${commentaire.timestamp}"></i>`
            : "";
        
        const commentHTML = 
        `
            <div class="block-comment${i} col-md-6 mb-4"> 
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <div class="fw-bold">
                        ${commentaire.firstname} ${commentaire.lastname} ${date} à ${heure}
                    </div>
                    ${deleteBtn}
                </div>
                <div class="border rounded p-2 bg-white">
                    <p class="mb-2">${commentaire.message}</p>
                    ${commentaire.imageUrl 
                        ? `<img src="${commentaire.imageUrl}" alt="Image du commentaire" class="img-fluid rounded" style="max-height: 200px;">`
                        : ""}
                </div>
            </div>
        `;
        $("#commentaires").append(commentHTML);
    });

    //Active le boutton de suppresion du commentaire
    if ($(".btnDeleteComment").length) {
        activateRemoveBtn();
    }
}

function activateRemoveBtn(){
    const btns = document.getElementsByClassName("btnDeleteComment");

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

function showAlert(message, color){
    let customAlert = document.getElementById('customAlert');
    let texteAlert = document.getElementById('alert-txt');
    let backTitle = document.querySelector(".alert-content h2");
    let lineTimer = document.querySelector(".alert-content");

    // Pour qu'elle soit visible
    setTimeout(()=>{
        $(texteAlert).empty();
        texteAlert.append(message);
        backTitle.style.background= color;
        lineTimer.classList.add('custom-'+color);
        customAlert.style.display = 'flex';
    }, 1000) //1s

    // Pour enlever l'alerte
    setTimeout(() =>{
        customAlert.style.display = 'none';
        reloadPageRecipe();
    }, 3000); //3s
}


/*********************************************
 **                                         **
 **               Animations                **
 **                                         **
 *********************************************/
function animationBtnLike(btnClicked){
    var scaleCurve = mojs.easing.path('M0,100 L25,99.9999983 C26.2328835,75.0708847 19.7847843,0 100,0');
    var el = document.querySelector('.button-like'),
    // mo.js timeline obj
    timeline = new mojs.Timeline(),
    
    // tweens for the animation:
    
    // burst animation
    tween1 = new mojs.Burst({
        parent: el,
        radius:   { 0: 100 },
        angle:    { 0: 45 },
        y: -10,
        count: 10,
        radius: 100, 
        children: {
            shape:        'circle',
            radius:       30,
            fill:         [ 'red', 'pink' ],
            strokeWidth:  15,
            duration:     500,
        }
    });
    
    let tween2 = new mojs.Tween({
        duration : 900,
        onUpdate: function(progress) {
            var scaleProgress = scaleCurve(progress);
            el.style.WebkitTransform = el.style.transform = 'scale3d(' + scaleProgress + ',' + scaleProgress + ',1)';
        }
    });
        
    let tween3 = new mojs.Burst({
        parent: el,
        radius:   { 0: 100 },
        angle:    { 0: -45 },
        y: -10,
        count:    10,
        radius:       125,
        children: {
            shape:        'circle',
            radius:       30,
            fill:         [ 'white', 'red' ],
            strokeWidth:  15,
            duration:     400,
        }
    });
    
    // add tweens to timeline:
    timeline.add(tween1, tween2, tween3);

    // when clicking the button start the timeline/animation:
    if ($(btnClicked).hasClass('active')){
        $(btnClicked).removeClass('active');
        removeLikeFromRecipe();
    }else{
        timeline.play();
        $(btnClicked).addClass('active');
        addLikeToRecipe();
    }
};