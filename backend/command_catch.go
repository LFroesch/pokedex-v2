package main

import (
	"errors"
	"fmt"

	"golang.org/x/exp/rand"
)

func callbackCatch(cfg *config, args ...string) error {
	if len(args) != 1 {
		return errors.New("no pokemon name provided")
	}
	pokemonName := args[0]

	pokemon, err := cfg.pokeapiClient.GetPokemon(pokemonName)
	if err != nil {
		return err
	}
	res := rand.Intn(pokemon.BaseExperience * 2)

	fmt.Printf("Throwing a Pokeball at %s...\n", pokemon.Name)
	// debug print
	fmt.Printf("Catch roll: %v \n", res)
	fmt.Printf("Base xp: %v \n", pokemon.BaseExperience)

	if res < pokemon.BaseExperience {
		fmt.Printf("%s escaped!\n", pokemon.Name)
		return nil
	}

	fmt.Printf("%s was caught!\n", pokemon.Name)

	// Catch Logic
	cfg.caughtPokemon[pokemon.Name] = pokemon

	// Debug Print
	fmt.Println("Currently caught Pokemon:")
	for _, pokemon := range cfg.caughtPokemon {
		fmt.Printf("- %s\n", pokemon.Name)
	}

	return nil
}
