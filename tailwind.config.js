module.exports = {
    darkMode: 'class',
    content: [
        './index.html',
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                // Cyber Bot Theme
                'cyber-bg': '#050a12',
                'cyber-panel': 'rgba(10, 20, 35, 0.8)',
                'cyber-accent': '#00f2ff', // Neon Cyan
                'cyber-secondary': '#ff00ea', // Neon Magenta
                'cyber-success': '#00ff41', // Matrix Green
                'cyber-border': '#1a3350',
                'cyber-text': '#e0f7fa',
                'cyber-muted': '#64748b',
                
                // Keep original for compatibility if needed, but we'll focus on cyber
                'prime-bg': '#050a12',
                'prime-surface': '#0a1423',
                'prime-accent': '#00f2ff',
                'prime-text': '#e0f7fa',
            },
            fontFamily: {
                'cyber': ['"Fira Code"', 'monospace'],
                'orbitron': ['Orbitron', 'sans-serif'],
            },
            animation: {
                'glow': 'glow 2s ease-in-out infinite alternate',
                'glitch': 'glitch 1s linear infinite',
                'scanline': 'scanline 8s linear infinite',
                'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'flicker': 'flicker 0.15s infinite',
            },
            keyframes: {
                glow: {
                    '0%': { 'text-shadow': '0 0 5px #00f2ff, 0 0 10px #00f2ff' },
                    '100%': { 'text-shadow': '0 0 10px #00f2ff, 0 0 20px #00f2ff, 0 0 30px #00f2ff' },
                },
                glitch: {
                    '2%, 64%': { transform: 'translate(2px,0) skew(0deg)' },
                    '4%, 60%': { transform: 'translate(-2px,0) skew(0deg)' },
                    '62%': { transform: 'translate(0,0) skew(5deg)' },
                },
                scanline: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100vh)' },
                },
                flicker: {
                    '0%': { opacity: '0.9' },
                    '100%': { opacity: '1' },
                },
            },
            backgroundImage: {
                'cyber-grid': 'linear-gradient(to right, #1a3350 1px, transparent 1px), linear-gradient(to bottom, #1a3350 1px, transparent 1px)',
            },
        },
    },
    plugins: [],
};
