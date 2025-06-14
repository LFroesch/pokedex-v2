# Pokedex CLI 🎮

A command-line Pokemon exploration tool built with Go. Catch Pokemon, explore locations, and build your Pokedex using the PokeAPI!

## Tech Stack
- **Language:** Go 1.22+
- **API:** PokeAPI integration with custom client
- **Cache:** In-memory cache with TTL for API responses
- **Testing:** Built-in Go testing framework

## Features
- **Explore locations** and discover Pokemon
- **Catch Pokemon** with probability-based mechanics
- **Manage your Pokedex** - view caught Pokemon details
- **Smart caching** - reduces API calls and improves performance
- **Pagination** - navigate through location areas
- **Inspect Pokemon** - view stats, types, and abilities

## Quick Start

1. **Clone and install**
   ```bash
   git clone <your-repo>
   cd pokedex
   go mod tidy
   ```

2. **Build and run**
   ```bash
   go build && ./pokedex
   ```

3. **Start exploring**
   ```
   Pokedex > help
   Pokedex > map
   Pokedex > explore pallet-town-area
   Pokedex > catch pikachu
   ```

## Commands

| Command | Description | Example |
|---------|-------------|---------|
| `help` | Show available commands | `help` |
| `map` | List next page of locations | `map` |
| `mapb` | List previous page of locations | `mapb` |
| `explore <area>` | Show Pokemon in location | `explore viridian-forest-area` |
| `catch <pokemon>` | Attempt to catch Pokemon | `catch pikachu` |
| `inspect <pokemon>` | View caught Pokemon details | `inspect pikachu` |
| `pokedex` | List all caught Pokemon | `pokedex` |
| `release <pokemon>` | Release a caught Pokemon | `release rattata` |
| `exit` | Close the Pokedex | `exit` |

## How Catching Works

Pokemon catching uses a probability system based on base experience:
- **Roll**: Random number between 0 and (base_experience × 2)
- **Success**: If roll ≥ base_experience, Pokemon is caught
- **Difficulty**: Higher base experience = harder to catch

## Project Structure

```
pokedex/
├── main.go                     # Entry point
├── repl.go                     # CLI interface and command routing
├── command_*.go                # Individual command implementations
├── internal/
│   ├── pokeapi/               # PokeAPI client and types
│   │   ├── pokeapi.go         # Client setup
│   │   ├── pokemon_req.go     # Pokemon API requests
│   │   ├── location_area_req.go # Location API requests
│   │   └── types_*.go         # API response types
│   └── pokecache/             # Caching system
│       ├── pokecache.go       # Cache implementation
│       └── pokecache_test.go  # Cache tests
└── go.mod                     # Dependencies
```

## Dependencies

- `golang.org/x/exp/rand` - Enhanced random number generation

---

*CLI Pokemon adventure by Lucas - Built as part of Boot.dev coursework*