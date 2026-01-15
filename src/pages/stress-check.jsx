import { SearchIcon, InformationCircleIcon } from '@heroicons/react/solid'
import React from 'react';
const RhymeEngineCLI = require('../rhyme-engine-cli');

export default function StressCheck() {
    const [query, setQuery] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [result, setResult] = React.useState(null);
    const [error, setError] = React.useState(null);

    async function checkStress() {
        if (query === '') {
            alert('Моля въведете дума за проверка');
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
        <>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">Проверка на ударение</h1>
                <p className="text-white/60 text-sm">
                    Въведете дума на български език, за да видите къде е ударението й.
                </p>
            </div>

            <div className="flex gap-2 mt-1 mb-4">
                <input
                    type="text"
                    name="query"
                    id="query"
                    value={query}
                    onChange={function (e) {
                        setQuery(e.target.value);
                    }}
                    onKeyDown={function (e) {
                        if (e.key === 'Enter') {
                            checkStress();
                        }
                    }}
                    className="w-full bg-white/10 placeholder-white/60 focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm sm:text-sm border-gray-300/10 text-white px-4 py-2"
                    placeholder="Напишете думата за проверка..."
                />
                <button
                    className="inline-flex justify-center rounded-md border border-white/10 shadow-sm px-4 py-2 bg-white/10 text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                    onClick={function (e) {
                        checkStress();
                    }}>
                    <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                    Провери
                </button>
            </div>

            {loading && (
                <div className="text-white/60 mb-4">
                    Проверявам ударението на: <span className="font-semibold">{query}</span>
                </div>
            )}

            {error && (
                <div className="text-red-400 mb-4 p-4 bg-red-500/10 rounded-md border border-red-500/20">
                    <div className="flex items-center">
                        <InformationCircleIcon className="h-5 w-5 mr-2" />
                        {error}
                    </div>
                </div>
            )}

            {result && (
                <div className="space-y-4">
                    <div className="p-6 rounded-md shadow-lg bg-white/10 ring-1 ring-black ring-opacity-5">
                        <div className="mb-4">
                            <h2 className="text-lg font-semibold text-white mb-2">Резултат</h2>
                            <div className="text-3xl font-bold text-yellow-400 mb-2">
                                {result.stressed || result.word}
                            </div>
                            <div className="text-white/60 text-sm">
                                Оригинална дума: <span className="font-mono">{result.word}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="bg-white/5 p-4 rounded-md">
                                <div className="text-white/60 text-xs uppercase mb-1">Сричка с ударение</div>
                                <div className="text-white text-lg font-semibold">
                                    {result.stress || 'N/A'}
                                </div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-md">
                                <div className="text-white/60 text-xs uppercase mb-1">Увереност</div>
                                <div className="text-white text-lg font-semibold">
                                    {result.confidence ? (result.confidence * 100).toFixed(0) + '%' : 'N/A'}
                                </div>
                            </div>
                        </div>

                        {result.stress_letter && (
                            <div className="mt-4 bg-white/5 p-4 rounded-md">
                                <div className="text-white/60 text-xs uppercase mb-1">Ударена буква</div>
                                <div className="text-white text-lg font-semibold">
                                    "{result.stress_letter}" на позиция {result.stress_pos}
                                </div>
                            </div>
                        )}

                        {result.syllables && result.syllables.length > 0 && (
                            <div className="mt-4">
                                <div className="text-white/60 text-xs uppercase mb-2">Срички</div>
                                <div className="flex flex-wrap gap-2">
                                    {result.syllables.map((syllable, index) => (
                                        <span
                                            key={index}
                                            className={`px-3 py-1 rounded-md text-sm ${
                                                index + 1 === result.stress
                                                    ? 'bg-yellow-500/30 text-yellow-300 font-bold'
                                                    : 'bg-white/5 text-white/80'
                                            }`}
                                        >
                                            {syllable}
                                            {index + 1 === result.stress && ' (ударение)'}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
