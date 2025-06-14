import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { MapView } from './components/MapView';
import { LocationView } from './components/LocationView';
import { PokedexView } from './components/PokedexView';
import { PokemonDetail } from './components/PokemonDetail';

function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Map', icon: '🗺️' },
    { path: '/pokedex', label: 'Pokedex', icon: '📖' },
  ];

  return (
    <nav className="bg-white shadow-lg border-b-4 border-pokemon-red">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="text-2xl">⚾</div>
            <h1 className="text-xl font-bold text-gray-800">Pokedex Web</h1>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  location.pathname === item.path
                    ? 'bg-pokemon-red text-white shadow-md'
                    : 'text-gray-600 hover:text-pokemon-red hover:bg-red-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <main className="max-w-6xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<MapView />} />
            <Route path="/location/:area" element={<LocationView />} />
            <Route path="/pokedex" element={<PokedexView />} />
            <Route path="/pokemon/:name" element={<PokemonDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;