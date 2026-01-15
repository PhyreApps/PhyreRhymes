import React from 'react';
import {DocumentTextIcon, SparklesIcon} from "@heroicons/react/solid";
import RhymeAnalysis from "../rhyme-analysis";

export default function AnalyseText() {
    const [results, setResults] = React.useState('');
    const [text, setText] = React.useState('');

    function analyse() {
        if (text === '') {
            return;
        }

        let rhymeAnalysis = RhymeAnalysis.analyze(text);
        setResults(rhymeAnalysis);
    }

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-white mb-4">
                    Анализ на <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">текст</span>
                </h1>
                <p className="text-white/70 text-lg">
                    Анализирай стихове и открий римите в текста
                </p>
            </div>

            {results && results.length > 0 ? (
                <div className="max-w-5xl mx-auto">
                    <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-800/50 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <SparklesIcon className="h-6 w-6 mr-2 text-yellow-400" />
                                Резултати от анализа
                            </h2>
                            <button
                                onClick={() => {
                                    setResults('');
                                    setText('');
                                }}
                                className="px-4 py-2 bg-gray-800/50 hover:bg-gray-800/70 text-white rounded-lg transition-all duration-200 border border-gray-700/50"
                            >
                                Нов анализ
                            </button>
                        </div>
                        <div 
                            className="prose prose-invert max-w-none text-white/90"
                            dangerouslySetInnerHTML={{__html: results}}
                        />
                    </div>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-800/50 shadow-2xl">
                        <div className="mb-6">
                            <label className="block text-white/70 text-sm font-medium mb-2">
                                Въведи текст за анализ
                            </label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onPaste={(e) => {
                                    e.preventDefault();
                                    let pastedText = e.clipboardData.getData('text/html');
                                    let doc = new DOMParser().parseFromString(pastedText, 'text/html');
                                    setText(doc.body.textContent);
                                }}
                                className="block w-full h-64 px-4 py-3 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500/50 resize-none"
                                placeholder="Въведи стихове или текст за анализ на рими..."
                            />
                        </div>
                        <button
                            onClick={analyse}
                            disabled={!text.trim()}
                            className="w-full px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold rounded-xl hover:from-yellow-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-950 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/20 flex items-center justify-center"
                        >
                            <DocumentTextIcon className="h-5 w-5 mr-2" />
                            Анализирай текст
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
