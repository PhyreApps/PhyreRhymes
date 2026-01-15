# Rhyme Engine Recommendations

## Current Implementation Analysis

Your current implementation uses:
- Last letter matching (2, 3, 4 letters)
- Vowel position matching
- Similar-sounding letter replacements

This is a **good foundation**, but here are recommendations to make it even better:

## Recommended Multi-Layered Approach

### 1. **Hybrid Scoring System** ✅ (Implemented in `engine.go`)

Combine multiple methods with weighted scores:
- **Exact ending match** (3x weight) - Most reliable
- **Syllable-based matching** (2.5x weight) - Better than letter matching
- **Phonetic normalization** (2x weight) - Handles similar sounds
- **Vowel pattern matching** (1.5x weight) - Captures vowel sequences
- **Similar-sounding letters** (1x weight) - Your existing logic

### 2. **Syllable-Based Matching** ✅ (Implemented)

Instead of just matching last N letters, extract the **last syllable**:
- Find the last vowel
- Include consonants after it
- This matches how Bulgarian rhymes actually work

### 3. **Database Optimization** (Recommended)

Add a `rhyme_key` column to your database:
```sql
ALTER TABLE words ADD COLUMN rhyme_key TEXT;
CREATE INDEX idx_rhyme_key ON words(rhyme_key);
```

This allows fast lookups:
```sql
SELECT word FROM words WHERE rhyme_key = ? ORDER BY word LIMIT 100;
```

### 4. **Phonetic Normalization** ✅ (Implemented)

Normalize similar-sounding letters to a canonical form:
- т/д → т
- с/з → с
- к/г → к
- etc.

This helps find rhymes even when letters differ slightly.

### 5. **Optional: Add goruut for IPA** (Future Enhancement)

If you want even better accuracy, integrate `goruut`:
- Converts words to IPA (International Phonetic Alphabet)
- More accurate phonetic matching
- Requires additional dependency

## Usage

### Option 1: Use Enhanced Engine (Recommended)

```go
// In rhyme.go, update FindRhymes to use:
rhymeRate := GetEnhancedRhymeRate(findRhymesForWord, word)
```

### Option 2: Keep Current + Add Enhanced as Option

Add a flag to choose between engines:
```bash
./rhyme-cli rhyme божидар --enhanced
```

## Performance Considerations

1. **Pre-compute rhyme keys** during import
2. **Index rhyme_key** in database for fast lookups
3. **Cache similar-sounding variants** for frequently searched words
4. **Batch processing** for large word lists

## Testing Recommendations

Test with known Bulgarian rhymes:
- "сняг" / "як" (should match)
- "любов" / "кръв" (should match)
- "море" / "горе" (should match)

Compare results between:
- Current algorithm
- Enhanced algorithm
- Manual verification

## Next Steps

1. ✅ Enhanced engine created (`rhyme/engine.go`)
2. ⏳ Update `FindRhymes` to use enhanced engine
3. ⏳ Add database schema for `rhyme_key`
4. ⏳ Update import to pre-compute rhyme keys
5. ⏳ Add optional goruut integration
