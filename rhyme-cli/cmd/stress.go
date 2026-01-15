package cmd

import (
	"encoding/json"
	"fmt"

	"rhyme-cli/stress"

	"github.com/spf13/cobra"
)

var stressCmd = &cobra.Command{
	Use:   "stress [word]",
	Short: "Determine word stress",
	Long:  "Determine the stress position in a Bulgarian word and return it with visual marking",
	Args:  cobra.ExactArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		word := args[0]
		
		// Определяне на ударението (автономен алгоритъм)
		result := stress.GuessStress(word)
		
		// JSON изход
		jsonOutput, err := json.MarshalIndent(result, "", "  ")
		if err != nil {
			checkErr(err)
		}
		
		fmt.Println(string(jsonOutput))
	},
}

func init() {
	rootCmd.AddCommand(stressCmd)
}
