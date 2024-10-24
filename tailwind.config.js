/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'blue-cyan': '#00354b',
        yellow: '#ffc107',
        primary: '#007bff',
        'off-white': '#f7f8f9',
        'text-dark-blue': '#01567f'
      },
      width: {
        1200: '1280px'
      },
      maxWidth: {
        1200: '1200px'
      },
      screens: {
        xs: '480px'
      },
      willChange: {
        opacity: 'opacity'
      },
      keyframes: {
        pulsate: {
          '0%': {
            transform: 'scale(0.1)',
            opacity: '0'
          },
          '50%': {
            opacity: '1'
          },
          '100%': {
            opacity: '0',
            transform: 'scale(1.2)'
          }
        },
        aniName: {
          '0%': {
            left: '0px'
          },

          '50%': {
            left: '3%'
          },

          '100%': {
            left: '0px'
          }
        },
        shine: {
          '100%': {
            left: '125%'
          }
        }
      },
      animation: {
        pulsate: 'pulsate 1s ease-out infinite',
        aniName: 'aniName 3s infinite',
        shine: 'shine 1.1s'
      },
      backgroundImage: {
        fire: "url('@/assets/images/fire.png')",
        'big-banner-sale': "url('@/assets/images/bg_banner_big.webp')"
      }
    }
  },
  plugins: [
    require('tailwindcss-animate'),
    function ({ addUtilities }) {
      addUtilities({
        '.no-scrollbar': {
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        },
        '.scrollbar-thin': {
          '::-webkit-scrollbar': {
            width: '4px',
            height: '4px'
          }
        },
        '.scrollbar-thumb': {
          '::-webkit-scrollbar-thumb': {
            backgroundColor: '#01567f',
            borderRadius: '10px'
          }
        },
        '.scrollbar-track': {
          '::-webkit-scrollbar-track': {
            backgroundColor: '#ccc',
            borderRadius: '10px'
          }
        },
        '.scrollbar-thumb:hover': {
          '::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#00354b'
          }
        }
      })
    }
  ]
}
