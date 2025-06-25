package main

import (
	"log"
	"net/http"
	"time"
)

func startCronJob() {
	ticker := time.NewTicker(14 * time.Minute)
	go func() {
		for range ticker.C {
			resp, err := http.Get("https://pokedex-v2.onrender.com/locations")
			if err != nil {
				log.Printf("Error while sending request: %v", err)
				continue
			}
			defer resp.Body.Close()

			if resp.StatusCode == 200 {
				log.Println("GET request sent successfully")
			} else {
				log.Printf("GET request failed: %d", resp.StatusCode)
			}
		}
	}()
}
