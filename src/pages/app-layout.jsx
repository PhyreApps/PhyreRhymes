import React, {Fragment, useState} from 'react';

import { Dialog, Menu, Transition } from '@headlessui/react'
import {
    DocumentTextIcon,
    MenuAlt2Icon,
    XIcon,
    InformationCircleIcon,
} from '@heroicons/react/outline'
import {PencilIcon, SearchIcon} from '@heroicons/react/solid';


import {HashRouter as Router, Routes, Route, NavLink, HashRouter} from 'react-router-dom';

import Search from "./search.jsx";
import AnalyseText from "./analyse-text.jsx";
import StressCheck from "./stress-check.jsx";

const navigation = [
    { name: 'Рими', href: '', icon: PencilIcon, current: true },
    { name: 'Проверка на ударение', href: '/stress-check', icon: InformationCircleIcon, current: false },
    { name: 'Анализ на текст', href: '/analyse-text', icon: DocumentTextIcon, current: false },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <>
            <Router>
            <div>
                <Transition.Root show={sidebarOpen} as="div">
                    <Dialog as="div" className="fixed inset-0 flex z-40 md:hidden" onClose={setSidebarOpen}>
                        <Transition.Child
                            as="div"
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true"/>
                        </Transition.Child>
                        <Transition.Child
                            as="div"
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <div className="relative flex-1 flex flex-col max-w-xs w-full h-screen pt-5 pb-4 bg-gray-800">
                                <Transition.Child
                                    as="div"
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                                        <button
                                            type="button"
                                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <span className="sr-only">Close sidebar</span>
                                            <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                        </button>
                                    </div>
                                </Transition.Child>
                                <div className="flex-shrink-0 flex items-center px-4">
                                    Phyre Rhymes
                                </div>
                                <div className="mt-5 flex-1 h-0 overflow-y-auto">
                                    <nav className="px-2 space-y-1">
                                        {navigation.map((item) => (

                                            <NavLink
                                                key={item.name}
                                                to={item.href}
                                                className={({ isActive, isPending }) =>
                                                    classNames(
                                                        isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                        'group flex items-center px-3 py-2 text-base font-medium rounded-md'
                                                    )
                                                }
                                            >

                                                <item.icon
                                                    className={classNames(
                                                        item.current ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300',
                                                        'mr-2 flex-shrink-0 h-6 w-6'
                                                    )}
                                                    aria-hidden="true"
                                                />
                                                {item.name}
                                           </NavLink>

                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </Transition.Child>
                        <div className="flex-shrink-0 w-14" aria-hidden="true">
                            {/* Dummy element to force sidebar to shrink to fit close icon */}
                        </div>
                    </Dialog>
                </Transition.Root>

                {/* Static sidebar for desktop */}
                <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
                    {/* Sidebar component, swap this element with another sidebar if you like */}
                    <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
                        <div className="flex items-center h-16 flex-shrink-0 px-4 text-white uppercase bg-gray-900">
                            Phyre Rhymes
                        </div>
                        <div className="flex-1 flex flex-col overflow-y-auto">
                            <nav className="flex-1 px-2 py-4 space-y-1">

                                {navigation.map((item) => (

                                    <NavLink
                                        key={item.name}
                                        to={item.href}
                                        className={({ isActive, isPending }) =>
                                            classNames(
                                                isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                                            )
                                        }
                                    >
                                        <item.icon
                                            className={classNames(
                                                item.current ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300',
                                                'mr-3 flex-shrink-0 h-6 w-6'
                                            )}
                                            aria-hidden="true"
                                        />
                                        {item.name}
                                    </NavLink>

                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="md:pl-64 flex flex-col">
                    <div className="sticky top-0 z-10 flex-shrink-0 flex h-16">
                        <button
                            type="button"
                            className="px-4 border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <span className="sr-only">Open sidebar</span>
                            <MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>

                    <main className="flex-1 px-4">
                        <Routes>
                            <Route path='/' exact element={<Search />} />
                            <Route path='/stress-check' exact element={<StressCheck />} />
                            <Route path='/analyse-text' exact element={<AnalyseText />} />
                        </Routes>
                    </main>
                </div>
            </div>
            </Router>
        </>
    )
}
