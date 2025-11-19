"use strict";
let pokemons = [];
let currentIndex = 0;
const nameElement = document.getElementById("pokemon-name");
const imageElement = document.getElementById("pokemon-image");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
async function loadPokemons(limit = 151) {
    try {
        nameElement.textContent = "Cargando...";
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
        const data = await response.json();
        const pokemonPromises = data.results.map(async (pokemon) => {
            const details = await fetch(pokemon.url);
            const detailsData = await details.json();
            return {
                id: detailsData.id,
                name: detailsData.name.charAt(0).toUpperCase() + detailsData.name.slice(1),
                image: detailsData.sprites.front_default || ""
            };
        });
        pokemons = await Promise.all(pokemonPromises);
        renderPokemon(currentIndex);
        prevBtn.disabled = false;
        nextBtn.disabled = false;
    }
    catch (error) {
        console.error("Error al cargar pokémons:", error);
        nameElement.textContent = "Error al cargar datos";
    }
}
function renderPokemon(index) {
    const pokemon = pokemons[index];
    if (!pokemon)
        return;
    nameElement.textContent = pokemon.name;
    imageElement.src = pokemon.image;
}
prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + pokemons.length) % pokemons.length;
    renderPokemon(currentIndex);
});
nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % pokemons.length;
    renderPokemon(currentIndex);
});
prevBtn.disabled = true;
nextBtn.disabled = true;
loadPokemons(151);
