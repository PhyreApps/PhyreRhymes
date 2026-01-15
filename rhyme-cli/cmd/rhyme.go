package cmd

import (
	"encoding/json"
	"fmt"

	"rhyme-cli/db"
	"rhyme-cli/rhyme"

	"github.com/spf13/cobra"
)

var maxResults int
var useEnhanced bool

var rhymeCmd = &cobra.Command{
	Use:   "rhyme [word]",
	Short: "Find rhyming words",
	Long:  "Find words that rhyme with the given word",
	Args:  cobra.ExactArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		if err := db.Init(); err != nil {
			checkErr(err)
		}
		defer db.Close()

		word := args[0]
		allWords, err := db.GetAllWords()
		if err != nil {
			checkErr(err)
		}

		if len(allWords) == 0 {
			result := map[string]interface{}{
				"success": false,
				"error":   "No words in database. Please import words first using 'import' command.",
			}
			jsonOutput, _ := json.MarshalIndent(result, "", "  ")
			fmt.Println(string(jsonOutput))
			return
		}

		var rhymes []rhyme.RhymeResult
		if useEnhanced {
			rhymes = rhyme.FindRhymesEnhanced(word, allWords, maxResults)
		} else {
			rhymes = rhyme.FindRhymes(word, allWords, maxResults)
		}

		result := map[string]interface{}{
			"success": true,
			"word":    word,
			"count":   len(rhymes),
			"rhymes":  rhymes,
		}

		jsonOutput, err := json.MarshalIndent(result, "", "  ")
		if err != nil {
			checkErr(err)
		}

		fmt.Println(string(jsonOutput))
	},
}

func init() {
	rhymeCmd.Flags().IntVarP(&maxResults, "max", "m", 100, "Maximum number of results to return")
	rhymeCmd.Flags().BoolVarP(&useEnhanced, "enhanced", "e", false, "Use enhanced rhyming algorithm (multi-layered scoring)")
}
