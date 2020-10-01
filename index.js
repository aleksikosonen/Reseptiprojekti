//muuttujia DOM metodeille
const searchInput = document.querySelector(".search_field");
const searchForm = document.querySelector(".search");
const searchResults = document.querySelector(".results");
const resList = document.querySelector(".search_results_list");
const mapButton = document.getElementById("map"); // tällä saaa map buttonin toimimaan, kato lightbox täältä http://users.metropolia.fi/~janneval/media/viikko3.html
const recipe = document.querySelector(".recipe");

//event listeneri hakukentälle
searchForm.addEventListener("submit", e =>{
    e.preventDefault();
    searchControl();
});

//luetaan kun URLässä oleva Hash muuttuu reseptin IDksi
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

function clearInput(){
    //hakunkentän nollaamiseen käytettävä funktio
    searchInput.value = "";
};

//haetaan hakukentälle arvo
const getInput = () => searchInput.value;

//kumitetaan vanhat tulokset pois
function clearResults() {
    resList.innerHTML ="";
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
        //luodaan uusi haku olio
        //valmistellaan UI
        clearResults();
        clearInput();

        //haetaan reseptit
        try{
            await reseptiHaku(input);
            //renderRecipe(etsiOhjelma(input));
            //renderöidään tulokset

        }catch(error){
            alert("Something went wrong again");
        }
    }
};


//funktio missä tehdään API hakuja ja kirjoitetaan hakukenttä alueeseen
function reseptiHaku(query){
    const url = `https://forkify-api.herokuapp.com/api/search?q=${query}`;
    fetch(url)
    .then(response =>response.json())
    .then((jsonData) => {
        //console.log(jsonData);
        jsonData.recipes;
        //return jsonData.recipes;
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
        })
    });
}


//funktio reseptien näyttämisen kontrolloimiseksi
async function controlRecipe(){
    //luodaan Hashissä olevasta IDstä muuttuja jossa oleva # muutetaan tyhjäksi jotta
    //pystymme lukemaan pelkkiä numeroita IDstä
    const id = window.location.hash.replace("#", "");
    console.log(id);
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
    const url = `https://forkify-api.herokuapp.com/api/get?rId=${id}`;
    fetch(url)
    .then(response =>response.json())
    .then((jsonData) => {
        console.log(jsonData);
             const mark = `
            <figure class="recipe_figure">
            <img src="${jsonData.recipe.img}" alt="${jsonData.recipe.title}" class="recipe__img">
            <h1 class="recipe__title">
                <span>${jsonData.recipe.title}</span>
            </h1>
        </figure>

        <div class="recipe__details">
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-stopwatch"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${/**recipe.time**/""}</span>
                <span class="recipe__info-text"> minutes</span>
            </div>
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-man"></use>
                </svg>

                <div class="recipe__info-buttons">
                    <button class="btn-tiny btn-decrease">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-minus"></use>
                        </svg>
                    </button>
                    <button class="btn-tiny btn-increase">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-plus"></use>
                        </svg>
                    </button>
                </div>

            </div>
        </div>

        <div class="recipe__ingredients">
            <ul class="recipe__ingredient-list">
        ${jsonData.recipe.ingredients/**.map(el => createIngredient(el)).join('')**/}
            </ul>

            <button class="btn-small recipe__btn recipe__btn--add">
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-shopping-cart"></use>
                </svg>
                <span>Add to shopping list</span>
            </button>
        </div>

        <div class="recipe__directions">
            <h2 class="heading-2">How to cook it</h2>
            <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__by">${jsonData.recipe.author}</span>. Please check out directions at their website.
            </p>
            <a class="btn-small recipe__btn" href="${jsonData.recipe.url}" target="_blank">
                <span>Directions</span>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-right"></use>
                </svg>

            </a>
        </div>
            `;
            recipe.insertAdjacentHTML("afterbegin", mark);
        });

};