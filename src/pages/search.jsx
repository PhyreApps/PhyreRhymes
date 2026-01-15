import { SearchIcon } from '@heroicons/react/solid'
import React from 'react';
const RhymeEngineCLI = require('../rhyme-engine-cli');
export default function Search() {

    const [query, setQuery] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [results, setResults] = React.useState([]);
    const [error, setError] = React.useState(null);

    async function searchForRhymes() {
        if (query === '') {
            alert('Моля въведете дума за търсене');
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
        <>
            <div className="flex gap-2 mt-1 mb-2">
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
                            searchForRhymes();
                        }
                    }}
                    className="w-full bg-white/10 placeholder-white/60 focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm sm:text-sm border-gray-300/10"
                    placeholder="Напишете думата която искате да римувате..."
                />
                <button
                    className="inline-flex justify-center rounded-md border border-white/10 shadow-sm px-4 py-2 bg-white/10 text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                    onClick={function (e) {
                        searchForRhymes();
                    }}>
                    <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                    Търси
                </button>
            </div>

            <div>
                <div>
                    {loading && (
                        <div className="text-white/60 mb-2">
                            Търсене за: <span className="font-semibold">{query}</span>
                        </div>
                    )}
                    {error && (
                        <div className="text-red-400 mb-2 p-2 bg-red-500/10 rounded">
                            {error}
                        </div>
                    )}
                </div>

                {results.length > 0 ? <>
                        <div
                            className="text-wrap p-4 capitalize rounded-md shadow-lg bg-white/10 ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {results.map((result) => (

                                <span key={result.word}>

                                     <span className={result.tailwindClass}>{result.word}</span>

                                    &nbsp;  &nbsp;
                                </span>
                            ))}
                        </div>
                        <div className="flex justify-center">
                            <button
                                className="mt-2 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                                onClick={function (e) {
                                    // loadMore();
                                }}>
                                Зареди още
                            </button>
                        </div>
                    </>
                    : <></>}

            </div>
        </>
    )
}
