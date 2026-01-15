class RhymeEngineCLI {
    /**
     * Check if rhymeAPI is available (from preload script)
     */
    static checkAPI() {
        if (typeof window === 'undefined' || !window.rhymeAPI) {
            throw new Error('rhymeAPI not available. Make sure preload script is loaded.');
        }
        return window.rhymeAPI;
    }

    /**
     * Convert rating to tailwind class (similar to old engine)
     */
    static getTailwindClass(rating) {
        if (rating >= 10) {
            return 'text-yellow-600 hover:text-yellow-500';
        } else if (rating >= 8) {
            return 'text-yellow-500 hover:text-yellow-400';
        } else if (rating >= 6) {
            return 'text-yellow-500/80 hover:text-yellow-500';
        } else if (rating >= 4) {
            return 'text-yellow-500/60 hover:text-yellow-500';
        } else if (rating >= 3) {
            return 'text-yellow-500/40 hover:text-yellow-500';
        } else {
            return 'text-yellow-500/20 hover:text-yellow-500';
        }
    }

    /**
     * Find rhyming words using Go CLI (via IPC)
     * @param {string} word - The word to find rhymes for
     * @param {number} maxResults - Maximum number of results (default: 100)
     * @returns {Promise<Array>} Array of rhyme results
     */
    static async rhyme(word, maxResults = 100) {
        if (!word || word.trim() === '') {
            return [];
        }

        try {
            const api = this.checkAPI();
            const result = await api.findRhymes(word, maxResults);

            if (!result.success) {
                console.error('CLI error:', result.error);
                return [];
            }

            // Convert CLI results to format expected by UI
            return result.rhymes.map(rhyme => ({
                word: rhyme.word,
                rating: rhyme.rating,
                tailwindClass: this.getTailwindClass(rhyme.rating),
                stress: rhyme.stress,
                stressed: rhyme.stressed,
                rhyme_suffix: rhyme.rhyme_suffix,
            }));

        } catch (error) {
            console.error('Error executing CLI:', error);
            return [];
        }
    }

    /**
     * Get word stress information (via IPC)
     * @param {string} word - The word to analyze
     * @returns {Promise<Object>} Stress information
     */
    static async getStress(word) {
        if (!word || word.trim() === '') {
            return null;
        }

        try {
            const api = this.checkAPI();
            return await api.getStress(word);
        } catch (error) {
            console.error('Error getting stress:', error);
            return null;
        }
    }
}

module.exports = RhymeEngineCLI;
