import React, { useEffect, useState } from 'react';
import './App.css';

const PokemonList = () => {
  const [pokemons, setPokemons] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchPokemons = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
      const data = await response.json();
      setPokemons(data.results);
    } catch (error) {
      console.error('Failed to fetch Pokemons:', error);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, []);

  const fetchDetail = async (name) => {
    setDetailLoading(true);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await response.json();
      setSelectedPokemon(data);
    } catch (error) {
      console.error('Failed to fetch Pokemon details:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-shell">
      <h1 className="title">
        <a href="https://pokeapi.co" target="_blank" rel="noopener noreferrer">
          PokéAPI
        </a>
      </h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Pokémon"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="pokemon-container">
        {filteredPokemons.map((pokemon) => {
          const id = pokemon.url.split('/').filter(Boolean).pop();

          return (
            <button
              type="button"
              key={pokemon.name}
              className="pokemon-card"
              onClick={() => fetchDetail(pokemon.name)}
            >
              <div className="pokemon-image">
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                  alt={pokemon.name}
                />
              </div>
              <div className="pokemon-number">#{String(id).padStart(3, '0')}</div>
              <div className="pokemon-name">{pokemon.name}</div>
            </button>
          );
        })}
      </div>

      {(selectedPokemon || detailLoading) && (
        <div className="pokemon-overlay" onClick={() => setSelectedPokemon(null)}>
          <div className="pokemon-detail" onClick={(e) => e.stopPropagation()}>
            {detailLoading && <p className="loading-text">Loading Pokémon stats...</p>}
            {selectedPokemon && !detailLoading && (
              <>
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setSelectedPokemon(null)}
                  aria-label="Close Pokémon details"
                >
                  ×
                </button>

                <img
                  className="detail-image"
                  src={selectedPokemon.sprites.front_default}
                  alt={selectedPokemon.name}
                />
                <h2>{selectedPokemon.name}</h2>

                <div className="type-row">
                  {selectedPokemon.types.map((type) => (
                    <span key={type.type.name} className={`type-badge type-${type.type.name}`}>
                      {type.type.name}
                    </span>
                  ))}
                </div>

                <p className="measurements">
                  Height: {selectedPokemon.height / 10} m &nbsp; Weight: {selectedPokemon.weight / 10} kg
                </p>

                <div className="stats">
                  {selectedPokemon.stats.map((stat) => (
                    <div key={stat.stat.name} className="stat-row">
                      <span className="stat-name">{stat.stat.name.replace('-', ' ')}</span>
                      <div className="stat-bar-track">
                        <div
                          className="stat-bar-fill"
                          style={{ width: `${Math.min((stat.base_stat / 255) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="stat-value">{stat.base_stat}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonList;