package cmd

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"rhyme-cli/db"

	"github.com/spf13/cobra"
)

var importCmd = &cobra.Command{
	Use:   "import [file]",
	Short: "Import words from a text file",
	Long:  "Import words from a text file (one word per line) into the SQLite database",
	Args:  cobra.ExactArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		if err := db.Init(); err != nil {
			checkErr(err)
		}
		defer db.Close()

		filename := args[0]
		file, err := os.Open(filename)
		if err != nil {
			checkErr(fmt.Errorf("failed to open file: %w", err))
		}
		defer file.Close()

		var words []string
		scanner := bufio.NewScanner(file)
		for scanner.Scan() {
			word := strings.TrimSpace(scanner.Text())
			if word != "" {
				words = append(words, word)
			}
		}

		if err := scanner.Err(); err != nil {
			checkErr(fmt.Errorf("failed to read file: %w", err))
		}

		fmt.Fprintf(os.Stderr, "Importing %d words...\n", len(words))
		if err := db.ImportWords(words); err != nil {
			checkErr(err)
		}

		count, err := db.GetWordCount()
		if err != nil {
			checkErr(err)
		}

		result := map[string]interface{}{
			"success": true,
			"imported": len(words),
			"total_words": count,
		}

		jsonOutput, err := json.MarshalIndent(result, "", "  ")
		if err != nil {
			checkErr(err)
		}

		fmt.Println(string(jsonOutput))
	},
}
