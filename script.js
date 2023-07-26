document.addEventListener("DOMContentLoaded", function() {
 
const homePage = document.querySelector(".home");
const pokedexContainer = document.querySelector(".pokedex");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("modal");
const modalName = document.getElementById("modalName");
const modalNumber = document.getElementById("modalNumber");
const modalTypes = document.getElementById("modalTypes");
const modalAbilities = document.getElementById("modalAbilities");
const modalImage = document.getElementById("modalImage");
const modalClose = document.querySelector(".close");
const appTitle = document.querySelector(".app-title");
const goToPokedexBtn = document.getElementById("goToPokedexBtn");

// Function to switch between home page and pokedex page
function showHomePage() {
  homePage.style.display = "block";
  pokedexContainer.style.display = "none";
}

function showPokedexPage() {
  homePage.style.display = "none";
  pokedexContainer.style.display = "grid";
}

// Function to handle navigation to the Pokédex
function goToPokedex() {
  showPokedexPage();
}

// Function to display Pokémon in the Pokédex
function displayPokemon(pokemon) {
    const card = document.createElement("div");
    card.classList.add("pokemon-card");
  
    const number = document.createElement("p");
    number.textContent = `#${pokemon.id.toString().padStart(3, '0')}`;
  
    const name = document.createElement("h2");
    name.textContent = pokemon.name;
  
    // Add the Pokémon number and name to the card
    card.appendChild(number);
    card.appendChild(name);
  
    // Display the Pokémon sprite on the card
    const sprite = document.createElement("img");
    sprite.src = pokemon.sprites.front_default;
    sprite.alt = pokemon.name;
    card.appendChild(sprite);
  
    card.addEventListener("click", () => openModal(pokemon));
  
    pokedexContainer.appendChild(card);
  }
  
// Function to fetch Pokémon data from the PokéAPI
async function fetchPokemonData(pokemonName) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching Pokémon data:", error);
  }
}

// Function to open the modal and display detailed Pokémon information
async function openModal(pokemon) {
  const data = await fetchPokemonData(pokemon.name);

  modalName.textContent = pokemon.name;
  modalNumber.textContent = `#${data.id.toString().padStart(3, '0')}`;
  modalTypes.textContent = `Types: ${data.types.map(t => t.type.name).join(", ")}`;
  modalAbilities.textContent = `Abilities: ${data.abilities.map(a => a.ability.name).join(", ")}`;
  modalImage.src = data.sprites.front_default;

  modal.style.display = "block";
}

// Function to close the modal
function closeModal() {
  modal.style.display = "none";
}

// Event listener for the close button in the modal
modalClose.addEventListener("click", closeModal);

// Event listener for the search input
searchInput.addEventListener("input", async (e) => {
    const searchTerm = e.target.value.toLowerCase();
    pokedexContainer.innerHTML = "";

    if (searchTerm) {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=50&offset=0`);
      const data = await response.json();
      const filteredPokemon = data.results.filter(pokemon => pokemon.name.includes(searchTerm));
      filteredPokemon.forEach(async (pokemon) => {
        const data = await fetchPokemonData(pokemon.name);
        displayPokemon(data);
      });
    } else {
      // If the search bar is empty, display all Pokémon in number-ordered state
      populatePokemonGallery();
    }
  });

// Event listener for the "Go to Pokédex" button
goToPokedexBtn.addEventListener("click", goToPokedex);

// Populate Pokémon gallery on the homepage
async function populatePokemonGallery() {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=50`);
    const data = await response.json();

      // Sort the Pokémon data based on their numbers in ascending order
    data.results.sort((a, b) => {
        const numA = parseInt(a.url.split("/").slice(-2, -1)[0]);
        const numB = parseInt(b.url.split("/").slice(-2, -1)[0]);
        return numA - numB;
      });
  
    const galleryContainer = document.querySelector(".pokemon-gallery");
  
    data.results.forEach(async (pokemon) => {
      const pokemonData = await fetchPokemonData(pokemon.name);
      const pokemonImage = document.createElement("img");
      pokemonImage.src = pokemonData.sprites.front_default;
      pokemonImage.alt = pokemon.name;
      pokemonImage.title = `${pokemonData.id.toString().padStart(3, '0')} - ${pokemon.name}`; // Display the Pokémon number and name as the tooltip
  
      pokemonImage.addEventListener("click", () => openModal(pokemonData));
  
      galleryContainer.appendChild(pokemonImage);
    });
  }

// Event listener for the app title to go back to the home page
appTitle.addEventListener("click", showHomePage);

// Show the home page on initial load
showHomePage();

// Populate Pokémon gallery on the homepage
populatePokemonGallery();
});