package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"golang.org/x/exp/rand"
)

func setupRouter(cfg *config) *gin.Engine {
	r := gin.Default()

	// CORS for frontend - more permissive for development
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "DELETE", "PUT", "OPTIONS"},
		AllowHeaders:     []string{"*"},
		AllowCredentials: false,
	}))

	api := r.Group("/api")
	{
		// Get location areas (map command) with pagination support
		api.GET("/locations", func(c *gin.Context) {
			pageURL := c.Query("url") // Allow passing specific URL
			var targetURL *string

			if pageURL != "" {
				targetURL = &pageURL
			} else {
				targetURL = cfg.nextLocationAreaURL
			}

			resp, err := cfg.pokeapiClient.ListLocationAreas(targetURL)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				return
			}

			// Update pagination URLs
			cfg.nextLocationAreaURL = resp.Next
			cfg.prevLocationAreaURL = resp.Previous

			c.JSON(http.StatusOK, gin.H{
				"locations": resp.Results,
				"next":      resp.Next,
				"previous":  resp.Previous,
				"count":     resp.Count,
			})
		})

		// Explore location area
		api.GET("/locations/:area", func(c *gin.Context) {
			area := c.Param("area")

			locationArea, err := cfg.pokeapiClient.GetLocationAreas(area)
			if err != nil {
				c.JSON(http.StatusNotFound, gin.H{"error": "Location not found"})
				return
			}

			// Fetch additional Pokemon data including sprites
			pokemonList := make([]map[string]interface{}, 0)
			for _, encounter := range locationArea.PokemonEncounters {
				pokemon, err := cfg.pokeapiClient.GetPokemon(encounter.Pokemon.Name)
				if err != nil {
					// If we can't get pokemon details, still include basic info
					pokemonList = append(pokemonList, map[string]interface{}{
						"name":   encounter.Pokemon.Name,
						"url":    encounter.Pokemon.URL,
						"caught": false, // Default to not caught if we can't get details
					})
					continue
				}

				// Check if this Pokemon is already caught
				_, isCaught := cfg.caughtPokemon[pokemon.Name]

				pokemonList = append(pokemonList, map[string]interface{}{
					"name":    pokemon.Name,
					"id":      pokemon.ID,
					"sprites": pokemon.Sprites,
					"types":   pokemon.Types,
					"caught":  isCaught,
				})
			}

			c.JSON(http.StatusOK, gin.H{
				"name":    locationArea.Name,
				"pokemon": pokemonList,
			})
		})

		// Catch pokemon
		api.POST("/pokemon/:name/catch", func(c *gin.Context) {
			pokemonName := c.Param("name")

			pokemon, err := cfg.pokeapiClient.GetPokemon(pokemonName)
			if err != nil {
				c.JSON(http.StatusNotFound, gin.H{"error": "Pokemon not found"})
				return
			}

			// Catch logic (same as CLI)
			res := rand.Intn(pokemon.BaseExperience * 2)
			success := res >= pokemon.BaseExperience

			if success {
				cfg.caughtPokemon[pokemon.Name] = pokemon
			}

			c.JSON(http.StatusOK, gin.H{
				"pokemon":         pokemon.Name,
				"caught":          success,
				"roll":            res,
				"base_experience": pokemon.BaseExperience,
				"message": func() string {
					if success {
						return pokemon.Name + " was caught!"
					}
					return pokemon.Name + " escaped!"
				}(),
			})
		})

		// Get pokedex (caught pokemon)
		api.GET("/pokedex", func(c *gin.Context) {
			pokemon := make([]map[string]interface{}, 0)
			for _, p := range cfg.caughtPokemon {
				pokemon = append(pokemon, map[string]interface{}{
					"name":    p.Name,
					"id":      p.ID,
					"height":  p.Height,
					"weight":  p.Weight,
					"types":   p.Types,
					"sprites": p.Sprites,
				})
			}

			c.JSON(http.StatusOK, gin.H{
				"pokemon": pokemon,
				"count":   len(pokemon),
			})
		})

		// Get specific pokemon details with flavor text
		api.GET("/pokemon/:name", func(c *gin.Context) {
			name := c.Param("name")

			pokemon, exists := cfg.caughtPokemon[name]
			if !exists {
				c.JSON(http.StatusNotFound, gin.H{"error": "Pokemon not caught yet"})
				return
			}

			// Fetch species data for flavor text
			var flavorText string
			// Construct species URL from pokemon ID
			speciesURL := fmt.Sprintf("https://pokeapi.co/api/v2/pokemon-species/%d", pokemon.ID)

			speciesResp, err := http.Get(speciesURL)
			if err == nil {
				defer speciesResp.Body.Close()
				var speciesData map[string]interface{}
				if json.NewDecoder(speciesResp.Body).Decode(&speciesData) == nil {
					// Get English flavor text entries
					if flavorTextEntries, ok := speciesData["flavor_text_entries"].([]interface{}); ok {
						for _, entry := range flavorTextEntries {
							if entryMap, ok := entry.(map[string]interface{}); ok {
								if language, ok := entryMap["language"].(map[string]interface{}); ok {
									if language["name"] == "en" {
										if text, ok := entryMap["flavor_text"].(string); ok {
											flavorText = text
											break
										}
									}
								}
							}
						}
					}
				}
			}

			// Add flavor text to response
			response := map[string]interface{}{
				"name":        pokemon.Name,
				"id":          pokemon.ID,
				"height":      pokemon.Height,
				"weight":      pokemon.Weight,
				"types":       pokemon.Types,
				"sprites":     pokemon.Sprites,
				"stats":       pokemon.Stats,
				"flavor_text": flavorText,
			}

			c.JSON(http.StatusOK, response)
		})

		// Release pokemon
		api.DELETE("/pokemon/:name", func(c *gin.Context) {
			name := c.Param("name")

			_, exists := cfg.caughtPokemon[name]
			if !exists {
				c.JSON(http.StatusNotFound, gin.H{"error": "Pokemon not found in pokedex"})
				return
			}

			delete(cfg.caughtPokemon, name)

			c.JSON(http.StatusOK, gin.H{
				"message": name + " was released into the wild!",
				"pokemon": name,
			})
		})
	}

	return r
}
