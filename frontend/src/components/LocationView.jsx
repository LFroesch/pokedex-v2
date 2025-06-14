import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { pokemonApi } from '../services/api';

export function LocationView() {
  const { area } = useParams();
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [catchingPokemon, setCatchingPokemon] = useState(null);
  const [catchResult, setCatchResult] = useState(null);

  useEffect(() => {
    loadLocation();
  }, [area]);

  const loadLocation = async () => {
    try {
      setLoading(true);
      const data = await pokemonApi.exploreLocation(area);
      setLocationData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load location data');
      console.error('Error loading location:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCatchPokemon = async (pokemonName) => {
    setCatchingPokemon(pokemonName);
    setCatchResult(null);

    try {
      const result = await pokemonApi.catchPokemon(pokemonName);
      setCatchResult(result);
      
      // If caught, update local state instead of refetching
      if (result.caught) {
        setLocationData(prevData => ({
          ...prevData,
          pokemon: prevData.pokemon.map(pokemon => 
            pokemon.name === pokemonName 
              ? { ...pokemon, caught: true }
              : pokemon
          )
        }));
      }
    } catch (err) {
      console.error('Error catching pokemon:', err);
      setCatchResult({
        pokemon: pokemonName,
        caught: false,
        message: 'Failed to catch Pokemon'
      });
    } finally {
      setCatchingPokemon(null);
    }
  };

  const dismissCatchResult = () => {
    setCatchResult(null);
  };

  const formatLocationName = (name) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatPokemonName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const getTypeColor = (typeName) => {
    const typeColors = {
      normal: 'bg-gray-400',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-blue-200',
      fighting: 'bg-red-700',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-600',
      flying: 'bg-indigo-400',
      psychic: 'bg-pink-500',
      bug: 'bg-green-400',
      rock: 'bg-yellow-800',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-700',
      dark: 'bg-gray-800',
      steel: 'bg-gray-500',
      fairy: 'bg-pink-300',
    };
    return typeColors[typeName] || 'bg-gray-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <div className="text-xl text-gray-600">Exploring {formatLocationName(area)}...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Exploration Failed</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Link to="/" className="btn-primary">
          Back to Map
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link to="/" className="text-pokemon-red hover:text-red-700 font-medium mb-2 inline-block">
          ← Back to Map
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {formatLocationName(locationData.name)}
        </h1>
        <p className="text-lg text-gray-600">
          Found {locationData.pokemon?.length || 0} Pokemon species in this area
        </p>
      </div>

      {/* Catch Result Modal */}
      {catchResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`bg-white rounded-xl p-8 text-center max-w-md mx-4 relative ${
            catchResult.caught ? 'catch-success' : ''
          }`}>
            {/* Close button */}
            <button
              onClick={dismissCatchResult}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              ×
            </button>
            
            <div className="text-6xl mb-4">
              {catchResult.caught ? '🎉' : '💨'}
            </div>
            <h3 className="text-2xl font-bold mb-2">
              {catchResult.caught ? 'Success!' : 'Escaped!'}
            </h3>
            <p className="text-gray-600 mb-4">{catchResult.message}</p>
            <div className="text-sm text-gray-500 mb-4">
              Roll: {catchResult.roll} / {catchResult.base_experience}
            </div>
            
            <button
              onClick={dismissCatchResult}
              className="btn-primary"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Pokemon Grid */}
      {locationData.pokemon && locationData.pokemon.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locationData.pokemon.map((pokemonData, index) => (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    {formatPokemonName(pokemonData.name)}
                  </h3>
                  {pokemonData.id && (
                    <p className="text-gray-500 text-sm mb-2">#{pokemonData.id}</p>
                  )}
                  
                  {/* Types */}
                  {pokemonData.types && (
                    <div className="mb-2">
                      <div className="flex flex-wrap gap-1">
                        {pokemonData.types.map((typeInfo, typeIndex) => (
                          <span
                            key={typeIndex}
                            className={`px-2 py-1 rounded-full text-white text-xs font-medium ${getTypeColor(typeInfo.type.name)}`}
                          >
                            {typeInfo.type.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="text-center ml-4 relative">
                  {pokemonData.sprites?.front_default ? (
                    <img 
                      src={pokemonData.sprites.front_default} 
                      alt={pokemonData.name}
                      className="w-20 h-20 mx-auto"
                    />
                  ) : (
                    <div className="text-4xl w-20 h-20 flex items-center justify-center">🦎</div>
                  )}
                  
                  {/* Caught indicator */}
                  {pokemonData.caught && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      ✓
                    </div>
                  )}
                </div>
              </div>
              
              {pokemonData.caught ? (
                <Link
                  to={`/pokemon/${pokemonData.name}`}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  <span className="mr-2">✓</span>
                  View in Pokedex
                </Link>
              ) : (
                <button
                  onClick={() => handleCatchPokemon(pokemonData.name)}
                  disabled={catchingPokemon === pokemonData.name}
                  className={`w-full ${
                    catchingPokemon === pokemonData.name
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'btn-primary'
                  } ${
                    catchingPokemon === pokemonData.name
                      ? 'pokeball-shake'
                      : ''
                  }`}
                >
                  {catchingPokemon === pokemonData.name ? (
                    <span className="flex items-center justify-center">
                      <span className="mr-2">⚾</span>
                      Throwing Pokeball...
                    </span>
                  ) : (
                    'Throw Pokeball'
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👻</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Pokemon Found</h2>
          <p className="text-gray-600">This area seems to be empty!</p>
        </div>
      )}
    </div>
  );
}