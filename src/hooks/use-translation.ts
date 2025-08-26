// src/hooks/use-translation.ts
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

type Translations = { [key: string]: any };

export function useTranslation(namespace: string) {
    const { selectedLanguage } = useLanguage();
    const [translations, setTranslations] = useState<Translations | null>(null);

    useEffect(() => {
        async function loadTranslations() {
            try {
                const module = await import(`@/locales/${selectedLanguage}.json`);
                setTranslations(module.default[namespace]);
            } catch (error) {
                console.error(`Could not load translations for ${selectedLanguage}`, error);
                // Fallback to English if the selected language file fails
                const fallbackModule = await import(`@/locales/en.json`);
                setTranslations(fallbackModule.default[namespace]);
            }
        }

        loadTranslations();
    }, [selectedLanguage, namespace]);

    function t(key: string): string {
        if (!translations) {
            return key;
        }

        // Handle nested keys like 'mission.title'
        const keys = key.split('.');
        let result = translations;
        for (const k of keys) {
            result = result?.[k];
            if (result === undefined) {
                return key; // Return the key itself if not found
            }
        }
        
        return result as string;
    }

    return { t, isLoading: !translations };
}
