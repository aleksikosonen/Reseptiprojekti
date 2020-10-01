//muuttujia DOM metodeille
const searchInput = document.querySelector(".search_field");
const searchForm = document.querySelector(".search");
const searchResults = document.querySelector(".results");
const resList = document.querySelector(".search_results_list");
const mapButton = document.getElementById("map"); // tällä saaa map buttonin toimimaan, kato lightbox täältä http://users.metropolia.fi/~janneval/media/viikko3.html
const recipe = document.querySelector(".recipe");
const logoButton = document.querySelector(".logo");

//event listeneri hakukentälle
searchForm.addEventListener("submit", e =>{
    e.preventDefault();
    searchControl();
});

//kun URLässä oleva hash muuttuu, ajetaan funktio "controlRecipe"
window.onhashchange = controlRecipe;
//myös jos URLässä on hash jo valmiiksi, ja sivu ladataan, ajetaan funktio "controlRecipe"
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe()));

//kun logoa painetaan päästään takaisin etusivulle
logoButton.addEventListener("click", goHome);
function goHome()
{
window.location.href="./index.html"
}

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
            guideText();
            await reseptiHaku(input);
            //renderRecipe(etsiOhjelma(input));
            //renderöidään tulokset

        }catch(error){
            alert("Something went wrong again");
        }
    }
};

function guideText() {
    const mark = `
            <p class="resultGuide">Here you have the results, click one to see more</p>`
    searchResults.insertAdjacentHTML('afterbegin', mark);
}    

//funktio missä tehdään API hakuja ja kirjoitetaan hakukenttä alueeseen
function reseptiHaku(query){
    const url = `https://forkify-api.herokuapp.com/api/search?q=${query}`;
    fetch(url)
    .then(response =>response.json())
    .then((jsonData) => {
        console.log(jsonData);
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

        const mark = `
        <figure class="recipe_figure">
            <img src="${jsonData.recipe.image_url}" alt="${jsonData.recipe.title}" class="recipe__img">
            <h1 class="recipe__title">
                <span>${jsonData.recipe.title}</span>
            </h1>
        </figure>
        <div class="recipe__ingredients">
            <ul class="recipe__ingredient-list">
            ${jsonData.recipe.ingredients/**.map(el => createIngredient(el)).join('')**/}
            </ul>
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
    });
};