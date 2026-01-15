import { SearchIcon, InformationCircleIcon, CheckCircleIcon } from '@heroicons/react/solid'
import React from 'react';
const RhymeEngineCLI = require('../rhyme-engine-cli');

export default function StressCheck() {
    const [query, setQuery] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [result, setResult] = React.useState(null);
    const [error, setError] = React.useState(null);

    async function checkStress() {
        if (query === '') {
            return;
        }
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const stressInfo = await RhymeEngineCLI.getStress(query);
            if (stressInfo) {
                setResult(stressInfo);
            } else {
                setError('Не можахме да определим ударението на тази дума.');
            }
        } catch (err) {
            console.error('Error checking stress:', err);
            setError('Грешка при проверка на ударение. Моля проверете дали CLI-то е компилирано.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-white mb-4">
                    Проверка на <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">ударение</span>
                </h1>
                <p className="text-white/70 text-lg">
                    Определи къде е ударението в българска дума
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
                                    checkStress();
                                }
                            }}
                            className="block w-full pl-12 pr-4 py-4 bg-gray-900/50 backdrop-blur-lg border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500/50 text-lg"
                            placeholder="Въведи дума за проверка на ударение..."
                        />
                    </div>
                    <button
                        onClick={checkStress}
                        disabled={loading || !query}
                        className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold rounded-xl hover:from-yellow-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-950 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/20"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Проверявам...
                            </span>
                        ) : (
                            'Провери'
                        )}
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="max-w-3xl mx-auto">
                    <div className="bg-red-900/30 border border-red-800/50 text-red-300 px-4 py-3 rounded-xl backdrop-blur-lg">
                        <div className="flex items-center">
                            <InformationCircleIcon className="h-5 w-5 mr-2" />
                            {error}
                        </div>
                    </div>
                </div>
            )}

            {/* Result */}
            {result && (
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-800/50 shadow-2xl">
                        {/* Main Word Display */}
                        <div className="text-center mb-8">
                            <div className="text-6xl font-bold mb-3 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                                {result.stressed || result.word}
                            </div>
                            <div className="text-white/60 text-lg">
                                Оригинална дума: <span className="font-mono text-white">{result.word}</span>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-gray-800/50 backdrop-blur-sm p-5 rounded-xl border border-gray-700/30">
                                <div className="text-white/60 text-xs uppercase mb-2 tracking-wider">Сричка с ударение</div>
                                <div className="text-3xl font-bold text-yellow-400">
                                    {result.stress || 'N/A'}
                                </div>
                            </div>
                            <div className="bg-gray-800/50 backdrop-blur-sm p-5 rounded-xl border border-gray-700/30">
                                <div className="text-white/60 text-xs uppercase mb-2 tracking-wider">Увереност</div>
                                <div className="text-3xl font-bold text-pink-400">
                                    {result.confidence ? (result.confidence * 100).toFixed(0) + '%' : 'N/A'}
                                </div>
                            </div>
                            {result.stress_letter && (
                                <div className="bg-gray-800/50 backdrop-blur-sm p-5 rounded-xl border border-gray-700/30">
                                    <div className="text-white/60 text-xs uppercase mb-2 tracking-wider">Ударена буква</div>
                                    <div className="text-3xl font-bold text-purple-400">
                                        "{result.stress_letter}"
                                    </div>
                                    <div className="text-white/50 text-sm mt-1">Позиция {result.stress_pos}</div>
                                </div>
                            )}
                        </div>

                        {/* Syllables */}
                        {result.syllables && result.syllables.length > 0 && (
                            <div className="mt-6">
                                <div className="text-white/70 text-sm uppercase mb-3 tracking-wider flex items-center">
                                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                                    Срички
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {result.syllables.map((syllable, index) => (
                                        <span
                                            key={index}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                index + 1 === result.stress
                                                    ? 'bg-gradient-to-r from-yellow-400 to-pink-500 text-white shadow-lg scale-105'
                                                    : 'bg-white/5 text-white/70 border border-white/10'
                                            }`}
                                        >
                                            {syllable}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
