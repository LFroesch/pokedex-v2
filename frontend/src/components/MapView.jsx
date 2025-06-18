import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pokemonApi } from '../services/api';

export function MapView() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ next: null, previous: null, count: 0 });

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async (url = null) => {
    try {
      setLoading(true);
      const data = await pokemonApi.getLocations(url);
      setLocations(data.locations);
      setPagination({
        next: data.next,
        previous: data.previous,
        count: data.count
      });
      setError(null);
    } catch (err) {
      setError('Failed to load locations. Make sure the Go server is running!');
      console.error('Error loading locations:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatLocationName = (name) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-4xl mb-4">⚾</div>
          <div className="text-xl text-gray-600">Loading Pokemon world...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Connection Error</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={loadLocations}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Pokedex World</h1>
        <p className="text-lg text-gray-600">Choose a location to explore and find Pokemon!</p>
      </div>
        {/* Pagination */}
      <div className="flex justify-center items-center space-x-4 mt-8">
        <button
          onClick={() => loadLocations(pagination.previous)}
          disabled={!pagination.previous || loading}
          className={`px-4 py-2 rounded-lg font-medium ${
            pagination.previous && !loading
              ? 'btn-primary'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          ← Previous
        </button>
        
        <span className="text-gray-600">
          Total: {pagination.count} locations
        </span>
        
        <button
          onClick={() => loadLocations(pagination.next)}
          disabled={!pagination.next || loading}
          className={`px-4 py-2 rounded-lg font-medium ${
            pagination.next && !loading
              ? 'btn-primary'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next →
        </button>
      </div>
      <br/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {locations.map((location) => (
          <Link
            key={location.name}
            to={`/location/${location.name}`}
            className="card card-hover p-4 text-center"
          >
            <div className="text-4xl mb-2">🌍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {formatLocationName(location.name)}
            </h3>
            <div className=" text-pokemon-red font-medium">
              Explore →
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-4 mt-8">
        <button
          onClick={() => loadLocations(pagination.previous)}
          disabled={!pagination.previous || loading}
          className={`px-4 py-2 rounded-lg font-medium ${
            pagination.previous && !loading
              ? 'btn-primary'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          ← Previous
        </button>
        
        <span className="text-gray-600">
          Total: {pagination.count} locations
        </span>
        
        <button
          onClick={() => loadLocations(pagination.next)}
          disabled={!pagination.next || loading}
          className={`px-4 py-2 rounded-lg font-medium ${
            pagination.next && !loading
              ? 'btn-primary'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next →
        </button>
      </div>

      {locations.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏜️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Locations Found</h2>
          <p className="text-gray-600">The Pokemon world seems empty!</p>
        </div>
      )}
    </div>
  );
}