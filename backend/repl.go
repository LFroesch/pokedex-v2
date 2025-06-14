package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"

	"github.com/LFroesch/pokedex/internal/pokeapi"
)

type config struct {
	pokeapiClient       pokeapi.Client
	nextLocationAreaURL *string
	prevLocationAreaURL *string
	caughtPokemon       map[string]pokeapi.Pokemon
}

func startRepl(cfg *config) {
	// Create a scanner that scans the std input of the CLI
	scanner := bufio.NewScanner(os.Stdin)

	for {
		// print prompt
		fmt.Print("Pokedex >")

		// scan field
		scanner.Scan()
		text := scanner.Text()

		cleaned := cleanInput(text)
		if len(cleaned) == 0 {
			continue
		}
		commandName := cleaned[0]
		args := []string{}
		if len(cleaned) > 1 {
			args = cleaned[1:]
		}

		availableCommands := getCommands()
		command, ok := availableCommands[commandName]
		if !ok {
			fmt.Println("invalid command, use help to list available commands")
			continue
		}
		err := command.callback(cfg, args...)
		if err != nil {
			fmt.Println(err)
		}
	}
}

type cliCommand struct {
	name        string
	description string
	callback    func(*config, ...string) error
}

func getCommands() map[string]cliCommand {
	return map[string]cliCommand{
		"help": {
			name:        "help",
			description: "Prints the help menu",
			callback:    callbackHelp,
		},
		"map": {
			name:        "map",
			description: "Lists the next page of location areas",
			callback:    callbackMap,
		},
		"mapb": {
			name:        "mapb",
			description: "Lists the previous page of location areas",
			callback:    callbackMapb,
		},
		"inspect": {
			name:        "release <pokemon_name>",
			description: "release a caught Pokemon",
			callback:    callbackInspect,
		},
		"release": {
			name:        "inspect <pokemon_name>",
			description: "View details about a caught Pokemon",
			callback:    callbackRelease,
		},
		"pokedex": {
			name:        "pokedex",
			description: "View your caught pokemon in your pokedex",
			callback:    callbackPokedex,
		},
		"explore": {
			name:        "explore <location_area>",
			description: "Lists the pokemon in a location area",
			callback:    callbackExplore,
		},
		"catch": {
			name:        "catch <pokemon_name>",
			description: "Attempt to catch a pokemon and add it to your pokedex",
			callback:    callbackCatch,
		},
		"exit": {
			name:        "exit",
			description: "Turns off the Pokedex",
			callback:    callbackExit,
		},
	}
}

// takes a string and returns it as a slice lowered
func cleanInput(str string) []string {
	lowered := strings.ToLower(str)
	words := strings.Fields(lowered)
	return words
}
