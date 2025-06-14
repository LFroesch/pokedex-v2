package main

import (
	"flag"
	"fmt"
	"log"
	"time"

	"github.com/LFroesch/pokedex-v2/internal/pokeapi"
)

func main() {
	// Add flag to choose between CLI and web mode
	webMode := flag.Bool("web", false, "Run in web server mode")
	port := flag.String("port", "8080", "Port for web server")
	flag.Parse()

	pokeClient := pokeapi.NewClient(5*time.Second, time.Minute*5)

	cfg := &config{
		caughtPokemon: map[string]pokeapi.Pokemon{},
		pokeapiClient: pokeClient,
	}

	if *webMode {
		// Web server mode
		fmt.Printf("Starting Pokedex API server on port %s...\n", *port)
		router := setupRouter(cfg)
		log.Fatal(router.Run(":" + *port))
	} else {
		// CLI mode (existing)
		startRepl(cfg)
	}
}
