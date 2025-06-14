import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { pokemonApi } from '../services/api';

export function PokemonDetail() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [releasing, setReleasing] = useState(false);

  useEffect(() => {
    loadPokemon();
  }, [name]);

  const loadPokemon = async () => {
    try {
      setLoading(true);
      const data = await pokemonApi.getPokemon(name);
      setPokemon(data);
      setError(null);
    } catch (err) {
      setError('Pokemon not found in your Pokedex');
      console.error('Error loading pokemon:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRelease = async () => {
    if (!confirm(`Are you sure you want to release ${formatPokemonName(pokemon.name)}?`)) {
      return;
    }

    try {
      setReleasing(true);
      await pokemonApi.releasePokemon(pokemon.name);
      navigate('/pokedex');
    } catch (err) {
      console.error('Error releasing pokemon:', err);
      alert('Failed to release Pokemon');
    } finally {
      setReleasing(false);
    }
  };

  const formatPokemonName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const formatStatName = (statName) => {
    const statNames = {
      'hp': 'HP',
      'attack': 'Attack',
      'defense': 'Defense',
      'special-attack': 'Sp. Attack',
      'special-defense': 'Sp. Defense',
      'speed': 'Speed'
    };
    return statNames[statName] || statName;
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

  const getStatBarColor = (statValue) => {
    if (statValue >= 100) return 'bg-green-500';
    if (statValue >= 80) return 'bg-yellow-500';
    if (statValue >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <div className="text-xl text-gray-600">Loading Pokemon details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pokemon Not Found</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Link to="/pokedex" className="btn-primary">
          Back to Pokedex
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link to="/pokedex" className="text-pokemon-red hover:text-red-700 font-medium mb-2 inline-block">
          ← Back to Pokedex
        </Link>
      </div>

      {/* Pokemon Card */}
      <div className="card p-8 max-w-2xl mx-auto">
        <div className="text-center mb-6">
          {pokemon.sprites?.front_default ? (
            <img 
              src={pokemon.sprites.front_default} 
              alt={pokemon.name}
              className="w-32 h-32 mx-auto mb-4"
            />
          ) : (
            <div className="text-8xl mb-4">🦎</div>
          )}
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {formatPokemonName(pokemon.name)}
          </h1>
          <p className="text-xl text-gray-500">#{pokemon.id}</p>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{pokemon.height}</div>
            <div className="text-gray-600">Height</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{pokemon.weight}</div>
            <div className="text-gray-600">Weight</div>
          </div>
        </div>

        {/* Flavor Text */}
        {pokemon.flavor_text && (
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-700 italic leading-relaxed">
              {pokemon.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ')}
            </p>
          </div>
        )}

        {/* Types */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Type(s)</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {pokemon.types && pokemon.types.map((typeInfo, index) => (
              <span
                key={index}
                className={`px-4 py-2 rounded-full text-white font-medium ${getTypeColor(typeInfo.type.name)}`}
              >
                {typeInfo.type.name}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        {pokemon.stats && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Base Stats</h3>
            <div className="space-y-3">
              {pokemon.stats.map((stat, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-24 text-sm font-medium text-gray-600">
                    {formatStatName(stat.stat.name)}
                  </div>
                  <div className="w-12 text-center text-sm font-bold">
                    {stat.base_stat}
                  </div>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${getStatBarColor(stat.base_stat)}`}
                        style={{ width: `${Math.min((stat.base_stat / 150) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleRelease}
            disabled={releasing}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              releasing
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg'
            }`}
          >
            {releasing ? 'Releasing...' : 'Release Pokemon'}
          </button>
        </div>
      </div>
    </div>
  );
}