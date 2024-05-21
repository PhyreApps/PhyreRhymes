import React from "react";
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
export default function Search() {
    return (
        <>
            <div className="mt-1 relative rounded-md shadow-sm">
                <input
                    type="text"
                    name="query"
                    id="query"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search for a rhyme..."
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
            </div>
        </>
    )
}
