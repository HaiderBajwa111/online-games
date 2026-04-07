'use client';

import React, { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    function toggleSidebar() {
        setIsSidebarOpen(!isSidebarOpen);
    }

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            {isSidebarOpen && (
                <div className="w-64 bg-gray-800 text-white p-4">
                    <h2 className="text-lg font-bold mb-4">Admin Panel</h2>
                    <ul className="space-y-2">
                        <li><a href="/admin" className="block py-2 px-4 hover:bg-gray-700 rounded">Dashboard</a></li>
                        <li><a href="/admin/add" className="block py-2 px-4 hover:bg-gray-700 rounded">Add Game</a></li>
                    </ul>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 p-4">
                <button onClick={toggleSidebar} className="mb-4 bg-cyan-600 text-white px-4 py-2 rounded">
                    {isSidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
                </button>
                {children}
            </div>
        </div>
    );
}
