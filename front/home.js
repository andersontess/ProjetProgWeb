//Affiche les recettes dans la page d'accueil
$(document).ready(function(){
    //Obtenir les receites dans le fichier json en ajax
    $.ajax({
        url: 'json/recipes.json',
        dataType: 'json',
        numbers: 4,
        success: function(recipe){
            //Afficher les recettes omnivores/ Vegetarian /Vegan
            for(let i = 0; i < recipe.length; i++){
                    if (recipe[i].Without!=null){
                        for (let j=0; j < recipe[i].Without.length; j++){
                        if (recipe[i].Without[j] == "Omnivore"){
                            $('#recipes-omnivores').append('<div class="recipe" value="'+recipe[i].nameFR+'" onclick="getRecipe(this)"><img src="'+recipe[i].imageURL+'" alt="food" class="food-image"><h2>'+recipe[i].nameFR+'</h2></div>');
                        } 
                        if (recipe[i].Without[j] == "Vegetarian"){
                            $('#recipes-vegetariens').append('<div class="recipe" value="'+recipe[i].nameFR+'" onclick="getRecipe(this)"><img src="'+recipe[i].imageURL+'" alt="food" class="food-image"><h2>'+recipe[i].nameFR+'</h2></div>');
                        }
                        if (recipe[i].Without[j] == "Vegan"){
                            $('#recipes-vegans').append('<div class="recipe" value="'+recipe[i].nameFR+'" onclick="getRecipe(this)"><img src="'+recipe[i].imageURL+'" alt="food" class="food-image"><h2>'+recipe[i].nameFR+'</h2></div>');
                        }
                    }                            
                }
            }
        }
    });
});

//Permet d'afficher une seule recette lorsqu'on clique sur la recette
function getRecipe(obj){
    $.ajax({
        method: "POST",
        url: "getrecipes.php",
        data:{"nomrecette": obj.getAttribute("value")},
        dataType: 'json',
    }).done( function(data){
        console.log(data);
        $(".recipe-card").removeClass("hide");
        displayCardRecipe(data);
    }).fail( function(e) {
        console.log(e);
        alert("Erreur");
    });
};

//Affiche le contenu de la recette
function displayCardRecipe(data){
    $(".names").remove();
    $(".ingredient-container").remove();
    $(".toRecipe").remove();
    
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
    $(".recipe-card").append("<a class='toRecipe' href='recipe.php'>Voir plus</a>");
}

//Bouton pour fermer la card recette
$(".")