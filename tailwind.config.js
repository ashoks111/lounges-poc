module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        appmutedwhite: 'rgba(255, 255, 255, 0.15)',
        appmutedwhite2: 'rgba(255, 255, 255, 0.25)',
        apppurple: '#7774FF',
        apppink: '#FF3D77', //rgb(255,61,119)
        appnavy: '#151A2C',
        appred: '#AA0F3D',
        appblue: '#347CB0',
        appyellow: '#FFCC4E',
        appfbblue: '#1877F2',
        appteal: {
          light: '#14ECD8', //rgb(20,236,216)
          dark: '#257870',
        },
        appgrey: {
          vdark: '#141414',
          dark: '#373737',
          mid: '#717171', //rgb(113,113,113)
          light: '#AFAFAF',
          vlight: '#F6F6F6',
        },
      },
    },
  },
  plugins: [],
}