# Rhyme CLI

A command-line tool for finding rhyming words using SQLite database.

## Installation

1. Make sure you have Go installed (version 1.21 or later)
2. Install dependencies:
   ```bash
   go mod tidy
   ```
3. Build the CLI:
   ```bash
   go build -o rhyme-cli
   ```

## Usage

### Import words from a text file

Import words from a text file (one word per line):

```bash
./rhyme-cli import path/to/words.txt
```

Example:
```bash
./rhyme-cli import ../src/dict/bg-spellchecked.txt
```

Output (JSON):
```json
{
  "success": true,
  "imported": 433471,
  "total_words": 433471
}
```

### Find rhyming words

Find words that rhyme with a given word:

```bash
./rhyme-cli rhyme [word] [--max N]
```

Options:
- `--max, -m`: Maximum number of results to return (default: 100)

Example:
```bash
./rhyme-cli rhyme божидар --max 50
```

Output (JSON):
```json
{
  "success": true,
  "word": "божидар",
  "count": 50,
  "rhymes": [
    {
      "word": "божидар",
      "rating": 2.5
    },
    ...
  ]
}
```

## Database

The tool uses SQLite database (`rhymes.db`) to store words. The database is created automatically on first use.

## Determine Word Stress

Find the stress position in a Bulgarian word:

```bash
./rhyme-cli stress [word]
```

Example:
```bash
./rhyme-cli stress копие
```

Output (JSON):
```json
{
  "word": "копие",
  "stressed": "ко̀пие",
  "stress": 1,
  "confidence": 0.98,
  "syllables": ["ко", "пи", "е"]
}
```

The stress detection uses:
- Dictionary lookup (highest confidence)
- Rule-based heuristics (suffix patterns)
- Syllable analysis
- Fallback to penultimate syllable (most common in Bulgarian)

## Algorithm

The rhyming algorithm is based on:
- Last letter matching (2, 3, 4 letters)
- Vowel position matching
- Similar sounding letter replacements (Bulgarian language specific)
