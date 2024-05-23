import React from 'react';
import {SearchIcon} from "@heroicons/react/solid";
import RhymeAnalysis from "../rhyme-analysis";
export default function AnalyseText() {

    const [results, setResults] = React.useState('');
    const [text, setText] = React.useState('');

    function analyse() {
        if (text === '') {
            alert('Моля въведете текст за анализиране');
            return;
        }

        let rhymeAnalysis = RhymeAnalysis.analyze(text);

        setResults(rhymeAnalysis);
    }

    return (
        <>
            <div className="h-full border-0 outline-0">

                {results && results.length > 0 ? <>

                <div>
                    <h2 className="text-2xl font-bold text-white">Резултати</h2>
                    <div className="mt-2">
                        <div dangerouslySetInnerHTML={
                            {__html: results}
                        }></div>
                    </div>
                    <div className="mt-4">
                        <button
                            className="inline-flex justify-center rounded-md border border-white/10 shadow-sm px-4 py-2 bg-white/10 text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                            onClick={function (e) {
                                setResults('');
                                setText('');
                            }}>
                            Анализирай друг текст
                        </button>
                    </div>
                </div>

                    </> :

                    <>

                    <textarea
                        value={text}
                        onChange={function (e) {
                            setText(e.target.value);
                        }}
                        onPaste={function (e) {
                            e.preventDefault();
                            let pastedText = e.clipboardData.getData('text/html');

                            let doc = new DOMParser().parseFromString(pastedText, 'text/html');
                            setText(doc.body.textContent);
                        }}
                        className="bg-transparent w-full h-[26rem] border border-white/5 rounded p-4"
                        placeholder="Въведете текста който искате да анализирате..."></textarea>

                    <button
                        className="inline-flex justify-center rounded-md border border-white/10 shadow-sm px-4 py-2 bg-white/10 text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                        onClick={function (e) {
                            analyse();
                        }}>
                        Анализирай
                    </button>

                </>

                }


            </div>
        </>
    )
}
