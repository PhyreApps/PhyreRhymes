package cmd

import (
	"encoding/json"
	"fmt"

	"rhyme-cli/db"
	"rhyme-cli/rhyme"
	"rhyme-cli/stress"

	"github.com/spf13/cobra"
)

var maxResults int

var rhymeCmd = &cobra.Command{
	Use:   "rhyme [word]",
	Short: "Find rhyming words",
	Long:  "Find words that rhyme with the given word (using stress-aware algorithm)",
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

		// Използваме само stress-aware алгоритъма
		rhymes := rhyme.FindRhymes(word, allWords, maxResults)

		// Добавяме информация за ударението на търсената дума
		targetStress := stress.GuessStress(word)

		result := map[string]interface{}{
			"success": true,
			"word":    word,
			"count":   len(rhymes),
			"rhymes":  rhymes,
		}

		// Добавяме ударението на търсената дума ако е намерено
		if targetStress.Stress > 0 {
			result["target_stress"] = targetStress.Stress
			result["target_stressed"] = targetStress.Stressed
			result["target_rhyme_suffix"] = rhyme.GetRhymeSuffix(word)
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
}
