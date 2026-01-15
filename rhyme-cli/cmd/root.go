package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "rhyme-cli",
	Short: "A CLI tool for finding rhyming words",
	Long:  "A command-line tool for finding rhyming words using SQLite database",
}

func Execute() error {
	return rootCmd.Execute()
}

func init() {
	rootCmd.AddCommand(importCmd)
	rootCmd.AddCommand(rhymeCmd)
}

func initDB() error {
	if _, err := os.Stat("rhymes.db"); os.IsNotExist(err) {
		// Database will be created on first connection
	}
	return nil
}

func checkErr(err error) {
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
}
