import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'calm-light': '#f0fdf4',
        'calm-dark': '#166534',
        'balanced-light': '#fffbeb',
        'balanced-dark': '#a16207',
        'chaotic-light': '#fef2f2',
        'chaotic-dark': '#991b1b',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-smooth': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0px)' },
        },
        'slide-down': {
          '0%': { opacity: '1', transform: 'translateY(0px)' },
          '100%': { opacity: '0', transform: 'translateY(100vh)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px 4px rgba(34, 197, 94, 0.6)' },
          '50%': { boxShadow: '0 0 40px 8px rgba(34, 197, 94, 0.3)' },
        },
        'glow-pulse-balanced': {
          '0%, 100%': { boxShadow: '0 0 20px 4px rgba(202, 138, 4, 0.6)' },
          '50%': { boxShadow: '0 0 40px 8px rgba(202, 138, 4, 0.3)' },
        },
        'glow-pulse-chaotic': {
          '0%, 100%': { boxShadow: '0 0 25px 6px rgba(239, 68, 68, 0.7), inset 0 0 20px 2px rgba(239, 68, 68, 0.3)' },
          '25%': { boxShadow: '0 0 35px 10px rgba(239, 68, 68, 0.5), inset 0 0 25px 3px rgba(239, 68, 68, 0.2)' },
          '50%': { boxShadow: '0 0 45px 12px rgba(239, 68, 68, 0.4), inset 0 0 30px 4px rgba(239, 68, 68, 0.15)' },
          '75%': { boxShadow: '0 0 35px 10px rgba(239, 68, 68, 0.5), inset 0 0 25px 3px rgba(239, 68, 68, 0.2)' },
          '100%': { boxShadow: '0 0 25px 6px rgba(239, 68, 68, 0.7), inset 0 0 20px 2px rgba(239, 68, 68, 0.3)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '10%': { transform: 'translate(-2px, -2px) scale(1.02)' },
          '20%': { transform: 'translate(2px, 2px) scale(1.02)' },
          '30%': { transform: 'translate(-2px, 2px) scale(1.02)' },
          '40%': { transform: 'translate(2px, -2px) scale(1.02)' },
          '50%': { transform: 'translate(-1px, 1px) scale(1.01)' },
          '60%': { transform: 'translate(1px, -1px) scale(1.01)' },
          '70%': { transform: 'translate(-2px, 0) scale(1.02)' },
          '80%': { transform: 'translate(2px, 0) scale(1.02)' },
          '90%': { transform: 'translate(0, 0) scale(1)' },
        },
        'orb-float': {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-10px) scale(1.1)' },
        },
        'orb-pulse-calm': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '0.6' },
        },
        'orb-pulse-balanced': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.9' },
          '50%': { transform: 'scale(1.08)', opacity: '0.7' },
        },
        'orb-pulse-chaotic': {
          '0%, 50%': { transform: 'scale(1.15)', opacity: '1' },
          '100%': { transform: 'scale(1.2)', opacity: '0.8' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-in-out',
        'pulse-smooth': 'pulse-smooth 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 1s linear',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'glow-pulse-balanced': 'glow-pulse-balanced 3s ease-in-out infinite',
        'glow-pulse-chaotic': 'glow-pulse-chaotic 1.5s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out infinite',
        'orb-float': 'orb-float 4s ease-in-out infinite',
        'orb-pulse-calm': 'orb-pulse-calm 3s ease-in-out infinite',
        'orb-pulse-balanced': 'orb-pulse-balanced 2.5s ease-in-out infinite',
        'orb-pulse-chaotic': 'orb-pulse-chaotic 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config
