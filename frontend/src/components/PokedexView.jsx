import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pokemonApi } from '../services/api';

export function PokedexView() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPokedex();
  }, []);

  const loadPokedex = async () => {
    try {
      setLoading(true);
      const data = await pokemonApi.getPokedex();
      setPokemon(data.pokemon);
      setError(null);
    } catch (err) {
      setError('Failed to load Pokedex');
      console.error('Error loading pokedex:', err);
    } finally {
      setLoading(false);
    }
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
          <div className="text-4xl mb-4">📖</div>
          <div className="text-xl text-gray-600">Loading your Pokedex...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Failed to Load Pokedex</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={loadPokedex}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (pokemon.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📖</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Pokedex</h1>
        <div className="text-6xl mb-4">🫗</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Pokemon Caught Yet</h2>
        <p className="text-gray-600 mb-6">
          Start exploring locations to catch your first Pokemon!
        </p>
        <Link to="/" className="btn-primary">
          Explore Locations
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Pokedex</h1>
        <p className="text-lg text-gray-600">
          You've caught {pokemon.length} Pokemon species!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pokemon.map((p) => (
          <Link
            key={p.name}
            to={`/pokemon/${p.name}`}
            className="card card-hover p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {formatPokemonName(p.name)}
                </h3>
                <p className="text-gray-500 text-sm">#{p.id}</p>
              </div>
              <div className="text-center">
                {p.sprites?.front_default ? (
                  <img 
                    src={p.sprites.front_default} 
                    alt={p.name}
                    className="w-16 h-16 mx-auto"
                  />
                ) : (
                  <div className="text-3xl">🦎</div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Type(s):</p>
              <div className="flex flex-wrap gap-2">
                {p.types && p.types.map((typeInfo, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getTypeColor(typeInfo.type.name)}`}
                  >
                    {typeInfo.type.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
              <div>
                <span className="font-medium">Height:</span> {p.height}
              </div>
              <div>
                <span className="font-medium">Weight:</span> {p.weight}
              </div>
            </div>

            <div className="text-pokemon-red font-medium text-center">
              View Details →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}