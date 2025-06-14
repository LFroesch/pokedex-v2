import axios from 'axios';

const API_BASE = import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export const pokemonApi = {
  // Get location areas (map) with pagination support
  getLocations: async (url = null) => {
    const endpoint = url ? `/locations?url=${encodeURIComponent(url)}` : '/locations';
    const response = await api.get(endpoint);
    return response.data;
  },

  // Explore specific location
  exploreLocation: async (area) => {
    const response = await api.get(`/locations/${area}`);
    return response.data;
  },

  // Attempt to catch pokemon
  catchPokemon: async (name) => {
    const response = await api.post(`/pokemon/${name}/catch`);
    return response.data;
  },

  // Get caught pokemon (pokedex)
  getPokedex: async () => {
    const response = await api.get('/pokedex');
    return response.data;
  },

  // Get specific pokemon details
  getPokemon: async (name) => {
    const response = await api.get(`/pokemon/${name}`);
    return response.data;
  },

  // Release pokemon
  releasePokemon: async (name) => {
    const response = await api.delete(`/pokemon/${name}`);
    return response.data;
  },
};