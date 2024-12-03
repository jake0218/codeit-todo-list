import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: '460px',
      md: '768px',
      xl: '1280px',
    },
    extend: {
      colors: {
        slate01: '#F1F5F9',
        slate02: '#E2E8E0',
        slate03: '#CBD5E1',
        slate04: '#94A3B8',
        slate05: '#64748B',
        // slate06 ~ 07 없음
        slate08: '#1E293B',
        slate09: '#0F172A',

        violet01: '#EDE9FE',
        // violet02 ~ 05 없음 
        violet06: '#7C3AED',

        rose: '#F43F5E',
        lime: '#BEF264',
        amber: '#92400E'

      },
    },
  },
  plugins: [],
} satisfies Config;
