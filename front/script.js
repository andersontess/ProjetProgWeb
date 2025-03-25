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
// async function sendComment(event) {
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
            window.location.href = result.redirect; // Redirection vers index.html

            return result;
        } else {
            console.error("Échec de la création de compte:", response.status, response.statusText);
        }
    } catch (error) {
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
            window.location.href = result.redirect; // Redirection vers index.html

            return result;
        } else {
            console.error("Échec de la connexion:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
    }
}
