import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import React from 'react';
const RhymeEngine = require('./rhyme-engine');
export default function Search() {

    const [query, setQuery] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [results, setResults] = React.useState([]);

    React.useEffect(() => {
        if (query !== '') {
            setResults(RhymeEngine.rhyme(query));
            setLoading(false);
        }
    });

    return (
        <>
            <div className="mt-1 relative rounded-md shadow-sm">
                <input
                    type="text"
                    name="query"
                    id="query"
                    onChange={function (e) {
                        setQuery(e.target.value);
                        setLoading(true);
                    }}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Напишете думата която искате да римувате..."
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
            </div>

            <div>
                <div>
                    {loading ? <>

                        <div>
                            Търсене за: {query}
                        </div>

                        <div>
                            {results.map((result) => (
                                <div key={result.word}>
                                    <p>{result.word}</p>
                                </div>
                            ))}
                        </div>

                    </> : <>

                    </>}
                </div>

            </div>
        </>
    )
}
