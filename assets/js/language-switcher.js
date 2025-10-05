/**
 * Multilingual Language Switcher
 * 
 * This script implements a smooth, lightweight language switcher for websites.
 * It toggles a dropdown menu, loads translation JSON files asynchronously,
 * updates page content via data-key attributes, and handles RTL/LTR direction
 * switching with CSS stylesheet updates. No page reloads are required.
 * 
 * Assumptions:
 * - Font Awesome is loaded for the globe icon.
 * - CSS handles menu animations (e.g., via .language-switcher.open .language-menu).
 * - A stylesheet link exists with href containing "main.css" or "main-ar.css" (e.g., <link rel="stylesheet" href="assets/css/main.css">).
 * - JSON files are at assets/data/lang/{lang}.json with {key: translation} structure.
 * - Initially, the page content is in English (en); subsequent loads update dynamically.
 * - Language preference is persisted in localStorage.
 * 
 * Usage: Include this script after the HTML structure. Ensure DOM is ready.
 */

(function () {
    'use strict';
  
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', initializeLanguageSwitcher);
  
    function initializeLanguageSwitcher() {
      const switcher = document.getElementById('language-switcher');
      const menu = document.getElementById('language-menu');
      const langItems = menu.querySelectorAll('li');
  
      if (!switcher || !menu || langItems.length === 0) {
        console.warn('Language switcher elements not found. Script aborted.');
        return;
      }
  
      // Retrieve current language from localStorage (default to 'en')
      let currentLang = localStorage.getItem('lang') || 'en';
  
      // Set initial active state on menu items
      langItems.forEach(li => {
        li.classList.toggle('active', li.dataset.lang === currentLang);
      });
  
      // Load initial language translations and setup
      loadLanguage(currentLang);
  
      // Toggle dropdown menu on switcher click
      switcher.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent document click from closing immediately
        switcher.classList.toggle('open');
      });
  
      // Handle language selection
      langItems.forEach(li => {
        li.addEventListener('click', (event) => {
          event.stopPropagation();
          const selectedLang = li.dataset.lang;
  
          // If same language, just close menu
          if (selectedLang === currentLang) {
            switcher.classList.remove('open');
            return;
          }
  
          // Update current language and persistence
          currentLang = selectedLang;
          localStorage.setItem('lang', currentLang);
  
          // Update active class
          langItems.forEach(item => item.classList.remove('active'));
          li.classList.add('active');
  
          // Load new language
          loadLanguage(currentLang);
  
          // Close menu
          switcher.classList.remove('open');
        });
      });
  
      // Close menu on outside click
      document.addEventListener('click', (event) => {
        if (!switcher.contains(event.target)) {
          switcher.classList.remove('open');
        }
      });
  
      // Optional: Close menu on Escape key
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && switcher.classList.contains('open')) {
          switcher.classList.remove('open');
        }
      });
    }
  
    /**
     * Asynchronously loads the translation JSON for the given language
     * and updates the page.
     * @param {string} lang - Language code (e.g., 'en', 'ar')
     */
    async function loadLanguage(lang) {
      try {
        const response = await fetch(`assets/data/lang/${lang}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load translations for ${lang}`);
        }
        const translations = await response.json();
        updateTexts(translations);
        updateDirectionAndStyles(lang);
      } catch (error) {
        console.error(`Error loading language "${lang}":`, error);
        // Fallback: Do not update if load fails to avoid breaking the page
      }
    }
  
    /**
     * Updates text content of all elements with data-key attributes
     * using the provided translations.
     * @param {Object} translations - Key-value pairs of translations
     */
    function updateTexts(translations) {
      document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.dataset.key;
        if (translations.hasOwnProperty(key)) {
          // Use textContent for security (avoids HTML injection)
          element.textContent = translations[key];
        }
      });
    }
  
    /**
     * Updates document direction (RTL/LTR) and switches the main stylesheet
     * based on the language. Assumes a <link> element with href containing "main".
     * @param {string} lang - Language code
     */
    function updateDirectionAndStyles(lang) {
      const htmlElement = document.documentElement;
      // Select the main stylesheet link (adjust selector if needed)
      const stylesheet = document.querySelector('link[href*="main.css"], link[href*="main-ar.css"]');
  
      if (lang === 'ar') {
        // RTL for Arabic
        htmlElement.dir = 'rtl';
        if (stylesheet) {
          stylesheet.href = 'assets/css/main-ar.css';
        }
      } else {
        // LTR for all other languages
        htmlElement.dir = 'ltr';
        if (stylesheet) {
          stylesheet.href = 'assets/css/main.css';
        }
      }
    }
  })();