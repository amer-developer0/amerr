/**
 * Language Switcher and Translation Manager
 * 
 * This script handles dynamic language switching for the website.
 * It manages dropdown toggle, JSON translation loading, text updates,
 * CSS stylesheet toggling for RTL (Arabic), localStorage persistence,
 * and smooth transitions.
 * 
 * Assumptions:
 * - Initial page language is English ('en').
 * - Elements with `data-key` attribute will be translated (textContent replaced).
 * - CSS transitions for dropdown are handled in main.css (e.g., opacity, transform).
 * - JSON files are at: assets/data/lang/{lang}.json (e.g., en.json, ar.json).
 * - Only Arabic requires RTL: adds main-ar.css and dir="rtl" to <html>.
 * - All other languages use LTR with main.css only.
 * 
 * Best Practices:
 * - ES6+ syntax for modern browsers.
 * - Async/await for fetch to avoid blocking.
 * - No page reloads; updates DOM directly.
 * - Performance: Single fetch per language change; batched DOM updates.
 * - Compatibility: Modern browsers (ES6+ support).
 * 
 * Usage: Include this script after the DOM is loaded.
 */

(function() {
    'use strict';

    // Configuration
    const DEFAULT_LANG = 'en';
    const ARABIC_LANG = 'ar';
    const JSON_PATH = 'assets/data/lang/';
    const MAIN_CSS = 'assets/css/main.css';
    const AR_CSS = 'assets/css/main-ar.css';
    const STORAGE_KEY = 'selectedLanguage';
    const DROPDOWN_SELECTOR = '#language-menu';
    const SWITCHER_SELECTOR = '#language-switcher';
    const LANG_ITEMS_SELECTOR = 'li[data-lang]';
    const TRANSLATABLE_SELECTOR = '[data-key]';
    const FADE_CLASS = 'fade-transition'; // Optional CSS class for smooth text fade (define in CSS)

    // Global state
    let currentLang = DEFAULT_LANG;
    let translations = {}; // Cache for loaded translations
    let arCssLink = null; // Reference to dynamic Arabic CSS link

    // DOM Elements
    const switcher = document.querySelector(SWITCHER_SELECTOR);
    const menu = document.querySelector(DROPDOWN_SELECTOR);
    const langItems = document.querySelectorAll(LANG_ITEMS_SELECTOR);
    const htmlElement = document.documentElement;

    // Utility: Add CSS class with transition support
    function addClass(element, className) {
        if (!element.classList.contains(className)) {
            element.classList.add(className);
        }
    }

    // Utility: Remove CSS class
    function removeClass(element, className) {
        element.classList.remove(className);
    }

    // Utility: Toggle dropdown visibility with smooth transition
    function toggleDropdown(open = null) {
        const isOpen = menu.hasAttribute('hidden') === false;
        const shouldOpen = open !== null ? open : !isOpen;

        if (shouldOpen) {
            removeClass(menu, 'hidden');
            menu.removeAttribute('hidden');
            addClass(menu, 'show'); // Trigger CSS transition (e.g., opacity:1, transform:translateY(0))
            addClass(switcher, 'active'); // Optional: Style for open state
        } else {
            addClass(menu, 'hide'); // Trigger CSS exit transition
            removeClass(switcher, 'active');
            // Use setTimeout to respect transition duration before hiding
            setTimeout(() => {
                addClass(menu, 'hidden');
                menu.setAttribute('hidden', '');
                removeClass(menu, 'show hide');
            }, 200); // Adjust to match CSS transition duration
        }
    }

    // Utility: Load JSON translations asynchronously
    async function loadTranslations(lang) {
        if (translations[lang]) {
            return translations[lang]; // Use cache
        }

        try {
            const response = await fetch(`${JSON_PATH}${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${lang}.json`);
            }
            const data = await response.json();
            translations[lang] = data;
            return data;
        } catch (error) {
            console.error('Translation load error:', error);
            // Fallback to default language
            return loadTranslations(DEFAULT_LANG);
        }
    }

    // Utility: Update all translatable elements
    function updateTexts(translationsData) {
        // Optional: Add fade class to all translatable elements for smooth transition
        document.querySelectorAll(TRANSLATABLE_SELECTOR).forEach(el => {
            addClass(el, FADE_CLASS);
        });

        // Batch updates for performance
        requestAnimationFrame(() => {
            document.querySelectorAll(TRANSLATABLE_SELECTOR).forEach(el => {
                const key = el.getAttribute('data-key');
                if (translationsData[key]) {
                    el.textContent = translationsData[key]; // Use innerHTML if HTML is needed
                }
                // Remove fade class after update
                removeClass(el, FADE_CLASS);
            });
        });
    }

    // Utility: Manage CSS stylesheets for RTL
    function toggleRtlStyles(isArabic) {
        if (isArabic) {
            // Add dir="rtl" to <html>
            htmlElement.setAttribute('dir', 'rtl');
            htmlElement.setAttribute('lang', ARABIC_LANG);

            // Dynamically add main-ar.css if not already loaded
            if (!arCssLink) {
                arCssLink = document.createElement('link');
                arCssLink.rel = 'stylesheet';
                arCssLink.href = AR_CSS;
                document.head.appendChild(arCssLink);
            }
        } else {
            // Remove dir="rtl" and set LTR
            htmlElement.setAttribute('dir', 'ltr');
            htmlElement.setAttribute('lang', currentLang);

            // Remove main-ar.css if loaded
            if (arCssLink) {
                arCssLink.remove();
                arCssLink = null;
            }
        }
    }

    // Utility: Update active language in dropdown
    function updateActiveLang(selectedLang) {
        langItems.forEach(item => {
            const lang = item.getAttribute('data-lang');
            if (lang === selectedLang) {
                addClass(item, 'active');
            } else {
                removeClass(item, 'active');
            }
        });
    }

    // Core: Handle language selection
    async function selectLanguage(newLang) {
        if (newLang === currentLang) {
            toggleDropdown(false); // Just close if same
            return;
        }

        // Show loading state if needed (optional)
        addClass(switcher, 'loading');

        try {
            const translationsData = await loadTranslations(newLang);
            updateTexts(translationsData);
            toggleRtlStyles(newLang === ARABIC_LANG);
            currentLang = newLang;
            localStorage.setItem(STORAGE_KEY, newLang);
            updateActiveLang(newLang);
        } catch (error) {
            console.error('Language switch error:', error);
        } finally {
            removeClass(switcher, 'loading');
            toggleDropdown(false); // Close dropdown
        }
    }

    // Core: Initialize on DOM load
    function init() {
        if (!switcher || !menu) {
            console.error('Language switcher elements not found');
            return;
        }

        // Load saved language
        const savedLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
        if (savedLang !== DEFAULT_LANG) {
            selectLanguage(savedLang); // This will load and apply without user interaction
        } else {
            updateActiveLang(DEFAULT_LANG);
        }

        // Event: Toggle dropdown on switcher click
        switcher.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown();
        });

        // Event: Close dropdown on outside click
        document.addEventListener('click', (e) => {
            if (!switcher.contains(e.target)) {
                toggleDropdown(false);
            }
        });

        // Event: Language item selection
        langItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = item.getAttribute('data-lang');
                selectLanguage(lang);
            });
        });

        // Prevent dropdown close on hover (if needed, but click-based here)
        menu.addEventListener('mouseenter', () => toggleDropdown(true));
        menu.addEventListener('mouseleave', () => toggleDropdown(false));

        console.log('Language switcher initialized');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Optional: Expose globals for debugging (remove in production)
    window.LanguageManager = { currentLang, selectLanguage, toggleDropdown };
})();
