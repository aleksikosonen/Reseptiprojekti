
//dom metodeille valmiit muuttujat
const searchInput = document.querySelector(".search_field");
const searchForm = document.querySelector(".search");
const searchResults = document.querySelector(".results");
const resList= document.querySelector(".search_results_list");

//staattisille asioille mitä joutuu toistamaan monesti
const staattinen = {
    key: "e1379a2526mshd09229b9160cf7p150153jsn8840697f2eb0" 
};




class Search{
    //API etsintöjen oma luokka
    constructor(query){
        this.query = query;
    }
    //Haetaan APIsta reseptejä
    async getResults() {
        try{
            const res = await fetch(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
            console.log(res);
            this.result = res.data.recipes;
            console.log(this.result);
            console.log("pääsin tänne asti");
        }catch(error){
            //error viesti jos ei tule vastausta
            alert("Something went wrong :O");
        } 
    }
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

//funktio missä renderöidään reseptit
function renderRecipe(recipe){
    const mark = `
        <li>
            <a class="results_link" href="#${recipe.recipe_id}">
                <figure class="results_fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results_data">
                    <h1 class="results_name">${recipe.title}</h1>
                    <p class="results_author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    resList.insertAdjacentHTML("beforeend", mark);
};

//eri olioille käytettävä tila
 const state = {};

//haun ohjain
async function searchControl() {
    //haetaan näkymästä input
    const input = getInput();
    if(input){
        //luodaan uusi haku olio
        state.search = new Search(input);

        //valmistellaan UI 
        clearResults();
        clearInput();
        
        
        //haetaan reseptit
        try{
            await state.search.getResults();
            //renderöidään tulokset

            renderResults(state.search.result);

        }catch(error){
            alert("Something went wrong again");
        }
    }
};

searchForm.addEventListener("submit", e =>{
    e.preventDefault();
    searchControl();
});
