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

Find words that rhyme with a given word (using stress-aware algorithm):

```bash
./rhyme-cli rhyme [word] [--max N]
```

Options:
- `--max, -m`: Maximum number of results to return (default: 100)

Example:
```bash
./rhyme-cli rhyme бедните --max 10
```

Output (JSON):
```json
{
  "success": true,
  "word": "бедните",
  "count": 10,
  "target_stress": 1,
  "target_stressed": "бèдните",
  "target_rhyme_suffix": "бедните",
  "rhymes": [
    {
      "word": "бездните",
      "rating": 7.9,
      "stress": 1,
      "stressed": "бèздните",
      "rhyme_suffix": "бездните"
    },
    ...
  ]
}
```

**Note:** The algorithm only returns words with matching stress position and stress letter.

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

The rhyming algorithm uses stress-aware matching:
- **Stress position matching**: Only words with the same stress position (from end) are considered
- **Stress letter matching**: Only words with the same stressed letter are considered
- **Rhyme suffix matching**: Compares the rhyming part (from stressed syllable to end)
- **Phonetic similarity**: Accounts for similar-sounding letter replacements (Bulgarian language specific)
- **Multi-layered scoring**: Combines multiple factors for accurate rhyme detection
