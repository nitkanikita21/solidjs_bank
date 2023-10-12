/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                mono: ['JetBrains Mono', 'monospace'],
            },
        },
    },
    plugins: [require('daisyui')],
    daisyui: {
        themes: ['forest'],
    },
};
