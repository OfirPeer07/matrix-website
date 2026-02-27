import React, { createContext, useContext, useState, useEffect } from 'react';

const LocaleContext = createContext();

export const LocaleProvider = ({ children }) => {
    const [locale, setLocale] = useState(() => {
        const saved = localStorage.getItem('globalLocale');
        return saved || 'en';
    });

    useEffect(() => {
        localStorage.setItem('globalLocale', locale);
        // Set html lang and dir attributes
        document.documentElement.lang = locale;
        document.documentElement.dir = locale === 'he' ? 'rtl' : 'ltr';
    }, [locale]);

    const toggleLocale = () => {
        setLocale((prev) => (prev === 'he' ? 'en' : 'he'));
    };

    return (
        <LocaleContext.Provider value={{ locale, setLocale, toggleLocale }}>
            {children}
        </LocaleContext.Provider>
    );
};

export const useLocaleContext = () => {
    const context = useContext(LocaleContext);
    if (!context) {
        throw new Error('useLocaleContext must be used within a LocaleProvider');
    }
    return context;
};
