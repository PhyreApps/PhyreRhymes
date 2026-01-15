import { SearchIcon, SparklesIcon } from '@heroicons/react/solid'
import React from 'react';
const RhymeEngineCLI = require('../rhyme-engine-cli');

export default function Search() {
    const [query, setQuery] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [results, setResults] = React.useState([]);
    const [error, setError] = React.useState(null);

    async function searchForRhymes() {
        if (query === '') {
            return;
        }
        setLoading(true);
        setError(null);
        try {
            let rhymes = await RhymeEngineCLI.rhyme(query, 100);
            setResults(rhymes);
        } catch (err) {
            console.error('Error searching for rhymes:', err);
            setError('Грешка при търсене на рими. Моля проверете дали CLI-то е компилирано.');
            setResults([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-white mb-4">
                    Намери <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">рими</span>
                </h1>
                <p className="text-white/70 text-lg">
                    Открий перфектните рими за твоите стихове
                </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
                <div className="relative flex gap-3">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-white/40" />
                        </div>
                        <input
                            type="text"
                            name="query"
                            id="query"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    searchForRhymes();
                                }
                            }}
                            className="block w-full pl-12 pr-4 py-4 bg-gray-900/50 backdrop-blur-lg border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500/50 text-lg"
                            placeholder="Въведи дума за търсене на рими..."
                        />
                    </div>
                    <button
                        onClick={searchForRhymes}
                        disabled={loading || !query}
                        className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold rounded-xl hover:from-yellow-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-950 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/20"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Търсене...
                            </span>
                        ) : (
                            'Търси'
                        )}
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="max-w-3xl mx-auto">
                    <div className="bg-red-900/30 border border-red-800/50 text-red-300 px-4 py-3 rounded-xl backdrop-blur-lg">
                        {error}
                    </div>
                </div>
            )}

            {/* Results */}
            {results.length > 0 && (
                <div className="max-w-6xl mx-auto">
                    <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-800/50 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-white flex items-center">
                                <SparklesIcon className="h-5 w-5 mr-2 text-yellow-400" />
                                Намерени рими: {results.length}
                            </h2>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {results.map((result) => (
                                <span
                                    key={result.word}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 cursor-pointer ${result.tailwindClass}`}
                                >
                                    {result.word}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!loading && results.length === 0 && query && !error && (
                <div className="max-w-3xl mx-auto text-center py-12">
                    <p className="text-white/50 text-lg">Няма намерени рими за "{query}"</p>
                </div>
            )}
        </div>
    )
}
