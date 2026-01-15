package cmd

import (
	"encoding/json"
	"fmt"

	"rhyme-cli/rhyme"
	"rhyme-cli/stress"

	"github.com/spf13/cobra"
)

var compareCmd = &cobra.Command{
	Use:   "compare [word1] [word2]",
	Short: "Compare two words for rhyming",
	Long:  "Check if two words rhyme and return the rhyme rating (using stress-aware algorithm)",
	Args:  cobra.ExactArgs(2),
	Run: func(cmd *cobra.Command, args []string) {
		word1 := args[0]
		word2 := args[1]

		// Calculate rhyme rate using stress-aware algorithm
		rhymeRate := rhyme.GetRhymeRateWithStress(word1, word2)

		// Get stress information for both words
		word1Stress := stress.GuessStress(word1)
		word2Stress := stress.GuessStress(word2)

		// Determine if words rhyme (threshold is 3.0, matching the rhyme command)
		threshold := 3.0
		doRhyme := rhymeRate >= threshold

		result := map[string]interface{}{
			"success":   true,
			"word1":     word1,
			"word2":     word2,
			"rating":    rhymeRate,
			"rhyme":     doRhyme,
			"threshold": threshold,
		}

		// Add stress information for word1
		if word1Stress.Stress > 0 {
			result["word1_stress"] = word1Stress.Stress
			result["word1_stressed"] = word1Stress.Stressed
			result["word1_rhyme_suffix"] = rhyme.GetRhymeSuffix(word1)
		}

		// Add stress information for word2
		if word2Stress.Stress > 0 {
			result["word2_stress"] = word2Stress.Stress
			result["word2_stressed"] = word2Stress.Stressed
			result["word2_rhyme_suffix"] = rhyme.GetRhymeSuffix(word2)
		}

		jsonOutput, err := json.MarshalIndent(result, "", "  ")
		if err != nil {
			checkErr(err)
		}

		fmt.Println(string(jsonOutput))
	},
}

func init() {
	rootCmd.AddCommand(compareCmd)
}
