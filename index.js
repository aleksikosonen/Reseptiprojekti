//muuttujia DOM metodeille
const searchInput = document.querySelector(".search_field");
const searchForm = document.querySelector(".search");
const searchResults = document.querySelector(".resultGuide");
const resList = document.querySelector(".search_results_list");
const mapButton = document.getElementById("map"); // tällä saaa map buttonin toimimaan, kato lightbox täältä http://users.metropolia.fi/~janneval/media/viikko3.html
const recipe = document.querySelector(".recipe");
const logoButton = document.querySelector(".logo");
const shoppinList = document.querySelector('.shopping__description');

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
        console.log(jsonData);
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
        console.log(jsonData);
        //kirjoitetaan HTMLään resepti
        ingredientArray = [];
        arvo = Object.keys(jsonData.recipe.ingredients).length;
        for (let i=0; i<arvo; i++) {
            ingredientArray[i] = jsonData.recipe.ingredients[i];
        }
        const mark = `
        <figure class="recipe_figure">
            <img src="${jsonData.recipe.image_url}" alt="${jsonData.recipe.title}" class="recipe__img">
            <h1 class="recipe__title">
                <span>${jsonData.recipe.title}</span>
            </h1>
        </figure>
        <div class="recipe__ingredients">
            <ul class="recipe__ingredient-list">
                <!--${jsonData.recipe.ingredients/**.map(JSON.parse(jsonData) => createIngredient(el)).join('')**/}-->
                ${ingredientArray}
            </ul>
            <div>
            <button id="addToCart">Add ingredients to cart</button>
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
function unifyIngredients(ingredient){
    /**tehdään kaksi arrayta, missä ensimmäisessä on resepteissä löydetyissä muodoissa olevat mittayksiköt
     * sen jälkeen tehdään array missä muodossa halutaan ne esittää
**/
    const longUnits = ["tablespoons", "tablespoon", "ounces", "ounce", "teaspoons", "teaspoon", "cups", "pounds"];
    const shortUnits = ["tbsp", "tbsp", "oz", "oz", "tsp", "tsp", "cup", "pound"];
    
    //funktio millä muutetaan valmistusaineet array muotoon, eritellään määrät, mittayksiköt sekä ainesosat
    const ingredientsNew = ingredient.map(e => {
        let ingredient = e.toLowerCase();
        longUnits.forEach((unit, i) => {
            ingredient = ingredient.replace(unit, shortUnit[i])
        });

        //poistetaan ylimääräiset sulut 
        ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

        //pätkitään valmistusaineet määriin, mittayksiköihin sekä ainesosiin
        const arrIng = ingredient.split(" ");
        const unitIndex = arrIng.findIndex(e2 => unitsshort.includes(e2))
        
        let ingredientObject;

        if (unitIndex > -1) {
            // Valmistusaineessa on mittayksikkö
            const arrCount = arrIng.slice(0, unitIndex);
            let count;

            if (arrCount.length === 1) {
                count = eval(arrIng[0].replace('-', '+'));
            } else {
                count = eval(arrIng.slice(0, unitIndex).join('+'));
            }

            objIng = {
                count,
                unit: arrIng[unitIndex],
                ingredient: arrIng.slice(unitIndex + 1).join(' ')
            };

        } else if (parseInt(arrIng[0], 10)) {
            // Valmistusaineessa ei ole mittayksikköä mutta arrayn ensimmäinen elementti on numero
            objIng = {
                count: parseInt(arrIng[0], 10),
                unit: '',
                ingredient: arrIng.slice(1).join(' ')
            }
        } else if (unitIndex === -1) {
            // Valmistusaineessa ei ole mittayksikköä eikä numeroa ensimmäisellä paikalla
            objIng = {
                count: 1,
                unit: '',
                ingredient
            }
        }
        return ingredientObject;
    }); return ingredientsNew;
};


function createIngredient(ingredient) {`
    <li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${formatCount(ingredient.count)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.ingredient}
        </div>
    </li>
`};

/*const mapButton2 = document.querySelector('.mapButton2');
mapButton2.addEventListener('onclick', openInPage);

function openInPage() {
    window.alert(kartta.html);
}*/

//Funktio ingridientsin käsittelyyn, jatketaan tästä maanantaina

const groButton = document.querySelector('.shopping__delete');
groButton.addEventListener('click', addIngridients);

function addIngridients() {
    shoppinList.innerHTML='';
    for (let i=0; i<ingredientArray.length;i++) {
        shoppinList.innerHTML += '<li>' + ingredientArray[i] + '</li>';
    }
}