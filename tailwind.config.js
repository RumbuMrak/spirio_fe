const plugin = require('tailwindcss/plugin');

module.exports = {
  content: ['./src/pages/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}', './src/features/**/*.{ts,tsx}'],
  theme: {
    colors: {
      primary: {
        DEFAULT: '#D41CFF',
        500: '#B526D6',
        550: '#D36584',
        600: '#A04F9D',
        605: '#9871C8',
        625: '#725D8D',
        645: '#6F5987',
        650: '#552F81',
        700: '#473062',
        725: '#380F67',
        750: '#302340',
        775: '#230C3D ',
        800: '#2A1B3B',
        900: '#18082A',
      },
      secondary: {
        DEFAULT: '#FEBE0C',
        500: '#E28D70 ',
      },
      background: '#18082A',
      black: '#000000',
      highlight: '#D4F65F',
      white: '#FFFFFF',
      gray: {
        100: '#CFCFCF',
        300: '#464646',
        DEFAULT: '#2C2C2C',
        600: '#1D1D1D',
      },
      transparent: 'transparent',
      current: 'currentColor',
      success: {
        25: '#F6FEF9',
        50: '#ECFDF3',
        100: '#D1FADF',
        200: '#A6F4C5',
        300: '#6CE9A6',
        DEFAULT: '#32D583',
        500: '#32D583',
        600: '#039855',
        700: '#027A48',
        800: '#05603A',
        900: '#054F31',
      },
      error: {
        25: '#FFFBFA',
        50: '#FEF3F2',
        100: '#FEE4E2',
        200: '#FECDCA',
        300: '#FDA29B',
        DEFAULT: '#F97066',
        500: '#F04438',
        600: '#D92D20',
        700: '#B42318',
        800: '#912018',
        900: '#7A271A',
      },
      warning: {
        25: '#FFFCF5',
        50: '#FFFAEB',
        100: '#FEF0C7',
        200: '#FEDF89',
        300: '#FEC84B',
        DEFAULT: '#FDB022',
        500: '#F79009',
        600: '#DC6803',
        700: '#B54708',
        800: '#93370D',
        900: '#7A2E0E',
      },
    },
    borderRadius: {
      none: '0',
      DEFAULT: '8px',
      md: '10px',
      lg: '24px',
      xl: '40px',
      full: '9999px',
    },
    fontSize: {
      none: ['0'],
      xxs: ['0.625rem'],
      xs: ['0.75rem', { lineHeight: 1.65 }],
      sm: ['0.875rem'],
      base: ['1rem'],
      lg: ['1.125rem'],
      xl: ['1.25rem'],
      '2xl': ['1.5rem', { lineHeight: 1.25 }],
      '3xl': ['1.875rem', { lineHeight: 1.25 }],
      '4xl': ['2.25rem', { lineHeight: 1.25 }],
    },
    fontWeight: {
      100: 100,
      200: 200,
      300: 300,
      400: 400,
      500: 500,
      600: 600,
      700: 700,
      800: 800,
      900: 900,
    },
    fontFamily: {
      poppins: ['var(--font-poppins)'],
      avenier: ['var(--font-avenier)'],
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        sm: '2rem',
        lg: '2rem',
        xl: '2rem',
        '2xl': '2rem',
      },
      screens: {
        sm: '600px',
        md: '728px',
        lg: '984px',
        xl: '1240px',
        '2xl': '1440px',
      },
    },
    extend: {
      zIndex: {
        1: 1,
      },
      transitionDuration: {
        DEFAULT: '300ms',
      },
      spacing: {
        4.5: '1.125rem',
        5.5: '1.375rem',
        6.5: '1.625rem',
        7.5: '1.875rem',
        12.5: '3.125rem',
        15: '3.75rem',
        18: '4.5rem',
        21: '5.25rem',
        '1/1': '100%',
        '1/2': '50%',
        'screen-height': 'calc(var(--vh, 1vh) * 100)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    plugin(({ addUtilities }) => {
      const customUtils = {
        '.mobile-vh': {
          height: 'calc(var(--vh, 1vh) * 100)',
        },
        '.text-gradient': {
          // Match brand gradient used in .bg-gradient-primary
          background: 'linear-gradient(143deg, #B526D6 19.36%, #FEBE0C 144.42%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        },
        '.bg-gradient': {
          background: 'linear-gradient(180deg, rgba(56, 15, 103, 0.80) 0%, rgba(35, 12, 61, 0.80) 68.7%)',
          backdropFilter: 'blur(40px)',
        },
        '.bg-gradient-primary': {
          background: 'linear-gradient(143deg, #B526D6 19.36%, #FEBE0C 144.42%)',
          backdropFilter: 'blur(40px)',
        },
        // Design system utilities for gradients/surfaces
        '.bg-hero': {
          background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.10) 100%)',
        },
        '.bg-hero-overlay': {
          background: 'linear-gradient(145deg, rgba(24, 8, 42, 0.60) 0%, rgba(56, 15, 103, 0.40) 50%, rgba(24, 8, 42, 0.20) 100%)',
        },
        '.surface': {
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.10)',
          backdropFilter: 'blur(8px)',
        },
        '.btn-gradient': {
          background: 'linear-gradient(133deg, #B526D6 10%, #FEBE0C 120%)',
          color: '#fff',
        },
        '.card-gradient': {
          background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid rgba(255,255,255,0.10)',
        },
        '.gradient-border': {
          position: 'relative',
        },
        '.gradient-border:before': {
          content: "''",
          position: 'absolute',
          inset: '-1px',
          borderRadius: 'inherit',
          background: 'linear-gradient(133deg, #B526D6, #FEBE0C)',
          WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px',
        },
      };

      addUtilities(customUtils);
    }),
  ],
};
