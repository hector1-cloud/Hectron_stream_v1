package main

import (
	"context"
	"fmt"
	"os"

	"google.golang.org/genai"
)

// generateWithText shows how to generate text using a text prompt.
func main() {
	ctx := context.Background()

    // Agrega datos reales de este proyecto
	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		HTTPOptions: genai.HTTPOptions{APIVersion: "v1"},
	})
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to create genai client: %v\n", err)
        os.Exit(1)
	}

	resp, err := client.Models.GenerateContent(ctx,
		"gemini-3.7-flash",
		genai.Text("How does AI work?"),
		nil,
	)
	if err != nil {
		fmt.Fprintf(os.Stderr, "failed to generate content: %v\n", err)
        os.Exit(1)
	}

	fmt.Println(resp.Text())
}
