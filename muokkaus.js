const searchInput = document.querySelector(".search_field");
const searchForm = document.querySelector(".search");
const searchResults = document.querySelector(".results");
const resList= document.querySelector(".search_results_list");

searchForm.addEventListener("submit", e =>{
  e.preventDefault();
  searchControl();
});

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
      await etsiOhjelma(input);
      //renderRecipe(etsiOhjelma(input));
      //renderöidään tulokset

    }catch(error){
      alert("Something went wrong again");
    }
  }
};

  function etsiOhjelma(query){
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

/*function renderRecipe(recipes){
  console.log(recipes);
  const mark = `
        <li>
            <a class="results_link" href="#${recipes.recipe_id}">
                <figure class="results_fig">
                    <img src="${recipes.image_url}" alt="${recipes.title}">
                </figure>
                <div class="results_data">
                    <h1 class="results_name">${recipes.title}</h1>
                    <p class="results_author">${recipes.publisher}</p>
                </div>
            </a>
        </li>
    `;
  resList.insertAdjacentHTML("beforeend", mark);
};*/
