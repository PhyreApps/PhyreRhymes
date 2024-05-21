import * as React from 'react';
import { createRoot } from 'react-dom/client';
import Search from "./search.jsx";

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(
    <React.StrictMode>
    <div className="w-[29rem] m-auto my-12">
        <div className="text-center mb-4">
            <h1 className="text-2xl">Phyre Rhymes v1.0</h1>
            <p className="text-sm">
                Приложение за лесно търсене на рими
            </p>
        </div>
        <Search />
    </div>

    </React.StrictMode>
);

