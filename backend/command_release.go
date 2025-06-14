package main

import (
	"errors"
	"fmt"
)

func callbackRelease(cfg *config, args ...string) error {
	if len(args) != 1 {
		return errors.New("no pokemon name provided")
	}
	pokemonName := args[0]

	pokemon, err := cfg.pokeapiClient.GetPokemon(pokemonName)
	if err != nil {
		return err
	}

	fmt.Printf("Releasing %s into the wild!\n", pokemon.Name)

	// Release Logic
	delete(cfg.caughtPokemon, pokemon.Name)

	return nil
}
