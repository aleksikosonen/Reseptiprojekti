//muuttujia DOM metodeille
const searchInput = document.querySelector(".search_field");
const searchForm = document.querySelector(".search");
const searchResults = document.querySelector(".resultGuide");
const resList = document.querySelector(".search_results_list");
const mapButton = document.getElementById("map"); // tällä saaa map buttonin toimimaan, kato lightbox täältä http://users.metropolia.fi/~janneval/media/viikko3.html
const recipe = document.querySelector(".recipe");
const logoButton = document.querySelector(".logo");
const shoppinList = document.querySelector('.shopping__description');
const addToList = document.getElementById("addToList");
const groceryList = document.querySelector(".groceryList");
const deleteBtn = document.getElementById("deleteButton");


//2 Globaalia muuttujaa reseptien ainesosien pätkimistä varten
let ingredientsData;
let unifiedIngredients;

//event listeneri hakukentälle
searchForm.addEventListener("submit", e =>{
    e.preventDefault();
    searchControl();
});

//kun URLässä oleva hash muuttuu, ajetaan funktio "controlRecipe"
//window.onhashchange = controlRecipe;
//myös jos URLässä on hash jo valmiiksi, ja sivu ladataan, ajetaan funktio "controlRecipe"
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


function clearInput(){
    //hakunkentän nollaamiseen käytettävä funktio
    searchInput.value = "";
};

//haetaan hakukentälle arvo
const getInput = () => searchInput.value;

//kumitetaan vanhat tulokset pois
function clearResults() {
    resList.innerHTML = "";
};


//kumitetaan aikaisemmin kirjoitettu HTML tyhjäksi
function clearRecipe() {
    recipe.innerHTML = "";
};


//Hakukoneiston ajamiseen tarkoitettu ohjelma
async function searchControl() {
    //haetaan näkymästä input
    const input = getInput();
    if(input){
        //valmistellaan UI
        clearResults();
        clearInput();

        //haetaan reseptit
        try{
            guideText();
            reseptiHaku(input);
            //renderRecipe(etsiOhjelma(input));
            //renderöidään tulokset

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


//funktio reseptien näyttämisen kontrolloimiseksi
async function controlRecipe(){
    //luodaan Hashissä olevasta IDstä muuttuja jossa oleva # muutetaan tyhjäksi jotta
    //pystymme lukemaan pelkkiä numeroita IDstä
    const id = window.location.hash.replace("#", "");

    //jos löytyy ID niin toteutetaan seuraava osio
    if(id){
        //jos ID löytyy niin
        clearRecipe();
        try{
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
                This recipe was carefully designed and tested by
                <span class="recipe__by">${jsonData.recipe.publisher}</span>. Please check out directions at their website.
            </p>
        
            <a class="btn-small recipe__btn" href="${jsonData.recipe.source_url}" target="_blank">
                <span>Directions</span>
                <svg class="search__icon">
                </svg>
 
            </a>
        </div>
            `;
        recipe.insertAdjacentHTML("afterbegin", mark);
        locate();
    });
};


//Navigoidaan sivu oikeaan näkymään
 function locate() {
    document.querySelector('.recipe').scrollIntoView({
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
    <div class="recipe__ingredient">
        <span class="recipe__unit">${ingredient.unit}</span>
        ${ingredient.ingredient}
    </div>
</li>
`;

 
function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
let shopItems = [];
let shopListItems = [];

function addToCart(){
    unifiedIngredients.forEach(e =>{
        shopItems = ostosLista(e.count, e.unit, e.ingredient);
        shopListItems.push(shopItems);
        //console.log(shopItems);
        renderItem(shopItems);
    });
    
    console.log(shopListItems[1]);
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
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredient}</p>
            <button class="deleteButton">Delete Item</button>
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
