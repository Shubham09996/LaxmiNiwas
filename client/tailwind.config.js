/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b'
        },
        cyber: {
          cyan: '#06b6d4',
          emerald: '#10b981',
          violet: '#8b5cf6',
          amber: '#f59e0b',
          rose: '#f43f5e',
          blue: '#3b82f6'
        },
        dark: {
          950: '#060913',
          900: '#0B1120',
          850: '#0F172A',
          800: '#1E293B',
          700: '#334155'
        }
      },
      boxShadow: {
        'glow-indigo': '0 0 25px -5px rgba(99, 102, 241, 0.4)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.35)',
        'glow-violet': '0 0 25px -5px rgba(139, 92, 246, 0.35)',
        'glass-card': '0 8px 32px 0 rgba(15, 23, 42, 0.08)',
        'glass-hover': '0 20px 40px -10px rgba(99, 102, 241, 0.15)',
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-dark': 'radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(16, 185, 129, 0.12) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(139, 92, 246, 0.15) 0px, transparent 50%)',
        'mesh-light': 'radial-gradient(at 0% 0%, rgba(238, 242, 255, 0.8) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(236, 253, 245, 0.8) 0px, transparent 50%)',
      }
    },
  },
  plugins: [],
};
