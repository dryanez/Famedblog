"use client";

import { useDarkMode } from '@/contexts/DarkModeContext';
import { Moon, Sun } from 'lucide-react';

export function DarkModeToggle() {
    const { darkMode, toggleDarkMode } = useDarkMode();

    return (
        <button
            onClick={toggleDarkMode}
            className="fixed top-6 left-6 z-50 p-3 rounded-full shadow-lg transition-all hover:scale-110 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {darkMode ? (
                <Sun className="w-5 h-5" />
            ) : (
                <Moon className="w-5 h-5" />
            )}
        </button>
    );
}
