module.exports = {
    darkMode: 'class',
    content: [
        './index.html',
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                // Enhanced dark mode palette (premium, vibrant)
                'prime-bg': '#14151A', // deeper background
                'prime-bg-gradient-from': '#181A20',
                'prime-bg-gradient-to': '#23262F',
                'prime-surface': '#23243a', // richer surface
                'prime-surface-2': '#23262F',
                'prime-accent': '#A78BFA', // lighter accent
                'prime-accent-dark': '#7C3AED',
                'prime-accent-light': '#C4B5FD',
                'prime-text': '#F3F4F6',
                'prime-text-strong': '#FFFFFF',
                'prime-muted': '#A1A1AA',
                'prime-muted-2': '#6B7280',
                'prime-border': '#312E81',
                'prime-danger': '#F87171',
                'prime-danger-dark': '#B91C1C',
            },
        },
    },
    plugins: [],
};
