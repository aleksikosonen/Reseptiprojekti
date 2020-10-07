//muuttujia DOM metodeille
const searchInput = document.querySelector(".search_field");
const searchForm = document.querySelector(".search");
const searchResults = document.querySelector(".resultGuide");
const resList = document.querySelector(".search_results_list");
const mapButton = document.getElementById("map"); // tällä saaa map buttonin toimimaan, kato lightbox täältä http://users.metropolia.fi/~janneval/media/viikko3.html
const recipe = document.querySelector(".recipe");
//const logoButton = document.querySelector(".logo");
//const shoppinList = document.querySelector('.shopping__description');
const addToList = document.getElementById("addToList");
const groceryList = document.querySelector(".groceryList");
//const deleteBtn = document.getElementById("deleteButton");
//const guideUse = document.querySelector('.guideForUseSmall');
const groceryGuide = document.querySelector('.myGroceryList');

//2 Globaalia muuttujaa reseptien ainesosien pätkimistä varten
let ingredientsData;
let unifiedIngredients;

//2 globaalia muuttujaa ostoslista ominaisuutta varten
let shopItems;
let shopListItems = [];

//event listeneri hakukentälle
searchForm.addEventListener("submit", e =>{
    e.preventDefault();
    searchControl();
});

//kun URLässä oleva hash muuttuu, ajetaan funktio "controlRecipe"
//window.onhashchange = controlRecipe;
//myös jos URLässä on hash jo valmiiksi, ja sivu ladataan, ajetaan funktio "controlRecipe"

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

function guidGenerator() {
    var S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

const url = window.location.href;
const lastPart = url.substr(url.lastIndexOf('/') + 1);

function clearSearchInput(){
    //hakunkentän nollaamiseen käytettävä funktio
    searchInput.value = "";
};


//funktio millä haetaan hakukentälle arvo
const getSearchInput = () => searchInput.value;


//funktio millä kumitetaan vanhat hakutulokset pois
function clearSearchResults() {
    resList.innerHTML = "";
};


//kumitetaan aikaisemmin kirjoitettu HTML tyhjäksi
function clearRecipe() {
    recipe.innerHTML = "";
};


//Hakukoneiston ajamiseen tarkoitettu ohjelma
async function searchControl() {
    //haetaan näkymästä input
    const input = getSearchInput();
    //jos input on olemassa, tehdään api haku ja renderöidään tulokset
    if(input){
        //valmistellaan UI hakutuloksia varten
        clearSearchResults();
        clearSearchInput();

        //haetaan reseptit
        try{
            guideText();
            reseptiHaku(input);

        }catch(error){
            alert("Something went wrong while searching for recipes");
        }
    }
};


//asetetaan ohjeet hakukoineiston printtaamalle alueelle
function guideText() {
    const mark = `
            <p class="resultGuide">Here you have the results, click one to see more</p>
            `
    if (searchResults.innerHTML.length < 1){      
        searchResults.insertAdjacentHTML('afterbegin', mark);
    }
}    


//funktio missä haetaan reseptejä APIsta ja kirjoitetaan hakukenttä alueeseen
function reseptiHaku(query){
    const url = `https://forkify-api.herokuapp.com/api/search?q=${query}`;
    fetch(url)
    .then(response =>response.json())
    .then((jsonData) => {
        jsonData.recipes;
        jsonData.recipes.forEach(function(e){
            const mark = `
        <li>
            <a class="results_link" href="#${e.recipe_id}">
                <figure class="results_fig">
                    <img src="${e.image_url}" alt="${e.title}">
                </figure>
                <div class="results_data">
                    <h1 class="results_name">${e.title}</h1>
                    <p class="results_author">${e.publisher}</p>
                </div>
            </a>
        </li>
    `;
            resList.insertAdjacentHTML("beforeend", mark);
            if (window.outerWidth>=1000) {
                locate();
            }
        })
    })
    .catch((error) => {
        alert("Oops! We couldn't find anything with your search :( You can try again (try searching for example lamb or ice cream!)")
    });
        
}


//funktio reseptien esittämisen kontrolloimiseksi
async function controlRecipe(){
    //luodaan Hashissä olevasta IDstä muuttuja jossa oleva # muutetaan tyhjäksi jotta
    //korvaamme # merkin tyhjällä jotta saamme IDn koostumaan pelkistä numeroista
    const id = window.location.hash.replace("#", "");

    //jos löytyy ID niin tyhjennetään vanhat reseptit näkymästä, haetaan IDn mukainen resepti APIsta ja renderöidään tämä näkymään
    if(id){
        //valmistellaan ui
        clearRecipe();
        try{
            //renderöidään resepti
            reseptiRender(id);
        }catch(error){
            alert("Error rendering recipe!");
        }
    }

};


//funktio valitun reseptin hakemiseksi ja renderöimiseksi
function reseptiRender(id){
    //haetaan APIsta reseptin tiedot käyttäen parametrina syötettiä reseptin IDtä
    const url = `https://forkify-api.herokuapp.com/api/get?rId=${id}`;
    fetch(url)
    .then(response =>response.json())
    .then((jsonData) => {
        //kirjoitetaan HTMLään resepti
        ingredientsData = jsonData.recipe.ingredients;
        unifiedIngredients = unifyIngredients();
        const mark = `
        <figure class="recipe_figure">
            <img src="${jsonData.recipe.image_url}" alt="${jsonData.recipe.title}" class="recipe__img">
            <h1 class="recipe__title">
                <span>${jsonData.recipe.title}</span>
            </h1>
        </figure>
        <div class="recipe__ingredients">
            <ul class="recipe__ingredient-list">
                ${unifiedIngredients.map(el => createIngredient(el)).join('')}
            </ul>
            <div>
            <button id="addToList" href="#" onclick="addToCart()">Add ingredients to shopping list</button>
            </div>
        </div>
 
        <div class="recipe__directions">
            <h2 class="heading-2">How to cook it</h2>
            <p class="recipe__directions-text">
                This recipe was designed by 
                <span class="recipe__by">"${jsonData.recipe.publisher}"</span>. Please visit their webside for more indepth directions from the link below.</p>
                <a class="btn-small recipe__btn" href="${jsonData.recipe.source_url}" target="_blank">
                <span class="directions">Directions</span> 
            </a>
        </div>
            `;
        recipe.insertAdjacentHTML("afterbegin", mark);
        locate();
    });
};


//Navigoidaan sivu keskimmäiseen reseptinäkymään
 function locate() {
    document.querySelector('.recipe').scrollIntoView({
        behavior: 'smooth'
    });
}

// Navigoidaan sivu ostoslistanäkymään
function locateToGrocery() {
    document.querySelector('.grocery').scrollIntoView({
        behavior: 'smooth'
    });
}



//funktio valmistusaineiden yhdistämiseksi
 function unifyIngredients(){
    /**tehdään kaksi arrayta, missä ensimmäisessä on resepteissä löydetyissä muodoissa olevat mittayksiköt
     * sen jälkeen tehdään array missä muodossa halutaan ne esittää**/

    const longUnits = ["tablespoons", "tablespoon", "ounces", "ounce", "teaspoons", "teaspoon", "cups", "pounds"];
    const shortUnits = ["tbsp", "tbsp", "oz", "oz", "tsp", "tsp", "cup", "pound"];
    
        
        //funktio millä muutetaan valmistusaineet array muotoon, eritellään määrät, mittayksiköt sekä ainesosat
        const ingredientsNew = ingredientsData.map(e => {
            
            let ingredient = e.toLowerCase();
            longUnits.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, shortUnits[i])
            });
            //poistetaan ylimääräiset sulut 
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

            //pätkitään valmistusaineet määriin, mittayksiköihin sekä ainesosiin
            const arrIng = ingredient.split(" ");
            const unitIndex = arrIng.findIndex(e2 => shortUnits.includes(e2))
            
            let ingredientObject;

            if (unitIndex > -1) {
                // Valmistusaineessa on mittayksikkö
                const arrCount = arrIng.slice(0, unitIndex);
                let count;

                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+')).toFixed(2);
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+')).toFixed(2);
                }

                ingredientObject = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if (parseInt(arrIng[0], 10)) {
                // Valmistusaineessa ei ole mittayksikköä mutta arrayn ensimmäinen elementti on numero
                ingredientObject = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // Valmistusaineessa ei ole mittayksikköä eikä numeroa ensimmäisellä paikalla
                ingredientObject = {
                    count: "",
                    unit: '',
                    ingredient
                }
            }
            return ingredientObject;
        }); return ingredientsNew;
        
};


//funktio millä kirjoitetaan HTMLään reseptin ainesosat
const createIngredient = ingredient => `
<li class="recipe__item">
    <div class="recipe__count">${ingredient.count}</div>
    <div class="recipe__unit">${ingredient.unit}</div>
    <div class="recipe__ingredient">
        <!--<span class="recipe__unit">${ingredient.unit}</span>-->
        ${ingredient.ingredient}
    </div>
</li>
`;

 
// Funktio jolla viedään valittu resepti ostoskoriin
function addToCart(){
    unifiedIngredients.forEach(e =>{
        shopItems = ostosLista(e.count, e.unit, e.ingredient);
        shopListItems.push(shopItems);
        //console.log(shopItems);
        renderItem(shopItems);
    });
    locateToGrocery();
    console.log(shopListItems[1]);
    if (groceryGuide.innerHTML.length < 1) {
        const groceryGuideText = `
            <p>Here you have your grocerylist!</p>
            <p>Feel free to delete the items you don't need to purchase</p>
            `;
        groceryGuide.insertAdjacentHTML('afterbegin', groceryGuideText);
    }
    };


function ostosLista (count, unit, ingredient) {
 item = {
     id: guidGenerator(),
     count,
     unit,
     ingredient
 }
    return item;
};


function deleteItem(id){
    const item = shopListItems.findIndex(e => e.id === id);
    shopListItems.splice(item, 1);
    const rItem = document.querySelector(`[data-itemid="${id}"]`);
    if (rItem) rItem.parentElement.removeChild(rItem);

};



const renderItem = item => {
    const markup = `
        <li class="shopping_item" data-itemid=${item.id}>
            <div class="shopping_count">
                <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
                <p class="groceryUnit">${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredient}</p>
            <button class="deleteButton">
                <img src="Ikonit/deleteikoni.png" width="15px" height="15px"/>
            </button>        
            </li>   
    `;
    groceryList.insertAdjacentHTML('beforeend', markup);
};


groceryList.addEventListener('click', e => {
    const id = e.target.closest('.shopping_item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.deleteButton, .deleteButton *')) {
        // Delete from state
        deleteItem(id);

    // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});
