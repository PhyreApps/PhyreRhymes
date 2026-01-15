import React from 'react';
import {HashRouter as Router, Routes, Route, NavLink} from 'react-router-dom';
import {
    DocumentTextIcon,
    InformationCircleIcon,
} from '@heroicons/react/outline'
import {PencilIcon} from '@heroicons/react/solid';

import Search from "./search.jsx";
import AnalyseText from "./analyse-text.jsx";
import StressCheck from "./stress-check.jsx";

const navigation = [
    { name: 'Рими', href: '', icon: PencilIcon },
    { name: 'Ударение', href: '/stress-check', icon: InformationCircleIcon },
    { name: 'Анализ', href: '/analyse-text', icon: DocumentTextIcon },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function AppLayout() {
    return (
        <Router>
            <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
                {/* Top Navigation */}
                <nav className="bg-black/80 backdrop-blur-lg border-b border-gray-800/50 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                                        Phyre Rhymes
                                    </h1>
                                </div>
                            </div>

                            {/* Navigation Tabs */}
                            <div className="flex space-x-1">
                                {navigation.map((item) => (
                                    <NavLink
                                        key={item.name}
                                        to={item.href}
                                        className={({ isActive }) =>
                                            classNames(
                                                isActive
                                                    ? 'bg-gray-900/50 text-white border-b-2 border-yellow-500'
                                                    : 'text-gray-400 hover:text-white hover:bg-gray-900/30',
                                                'flex items-center px-4 py-2 text-sm font-medium rounded-t-lg transition-all duration-200'
                                            )
                                        }
                                    >
                                        <item.icon className="h-5 w-5 mr-2" />
                                        {item.name}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Routes>
                        <Route path='/' exact element={<Search />} />
                        <Route path='/stress-check' exact element={<StressCheck />} />
                        <Route path='/analyse-text' exact element={<AnalyseText />} />
                    </Routes>
                </main>
            </div>
        </Router>
    )
}
