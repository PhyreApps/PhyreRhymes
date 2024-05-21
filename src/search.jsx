import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import React from 'react';
const RhymeEngine = require('./rhyme-engine');
export default function Search() {

    const [query, setQuery] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [results, setResults] = React.useState([]);

    function searchForRhymes() {
        if (query === '') {
            alert('Моля въведете дума за търсене');
            return;
        }
        setLoading(true);
        setTimeout(function () {
            let rhymes = RhymeEngine.rhyme(query);
            setResults(rhymes);
            setLoading(false);
        }, 1);
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
                <button className="inline-flex justify-center rounded-md border border-white/10 shadow-sm px-4 py-2 bg-white/10 text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500" onClick={function (e) {
                    searchForRhymes();
                }}>
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                    Търси
                </button>
            </div>

            <div>
                <div>
                    {loading ? <>

                        <div>
                            Търсене за: {query}
                        </div>


                    </> : <>

                    </>}
                </div>

                {results.length > 0 ? <>
                        <div className="text-wrap p-4 capitalize rounded-md shadow-lg bg-white/10 ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {results.map((result) => (
                                <span key={result.word}>

                                    {result.rating === 1.5
                                        ?
                                        <span className="text-yellow-400">{result.word}</span>
                                        :
                                        result.rating === 1
                                            ?
                                            <span className="text-green-800">{result.word}</span>
                                            :
                                            result.rating === 0.5
                                                ?
                                                <span className="text-yellow-100">{result.word}</span>
                                                :
                                                <span className="text-yellow-200">{result.word}</span>
                                    }
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
