"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type DarkModeContextType = {
    darkMode: boolean;
    toggleDarkMode: () => void;
};

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export function DarkModeProvider({ children }: { children: ReactNode }) {
    const [darkMode, setDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Load dark mode preference from localStorage
        const saved = localStorage.getItem('darkMode');
        if (saved) {
            setDarkMode(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            // Apply dark mode class to document
            if (darkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            // Save preference
            localStorage.setItem('darkMode', JSON.stringify(darkMode));
        }
    }, [darkMode, mounted]);

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    // Prevent flash of wrong theme
    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
}

export function useDarkMode() {
    const context = useContext(DarkModeContext);
    if (context === undefined) {
        throw new Error('useDarkMode must be used within a DarkModeProvider');
    }
    return context;
}
