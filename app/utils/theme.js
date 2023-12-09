export const theme = (colorTheme) => {
  if (colorTheme === 'light') {
    return {
      spacing: {
        safeAreaView: '75px',
      },
      colors: {
        primary: '#EE6E12',
        white: '#ffffff',
        black: '#000000',
        background1: '#FFF6D4',
        chatBackground: '#FFF6D4',
      },
      text: {
        colors: {
          secondary: '#000000',
          primary: '#FF912D',
          secondaryInverse: '#ffffff',
        },
        chatMessage: {
          backgroundAssistant: '#EADDAF',
          backgroundUser: '#FF912D',
          inputBackground: '#FFFFEB',
        },
        weight: {
          regular: '400',
          bold: '700',
          semibold: '600',
        },
        family: 'Noto Sans',
        size: {
          xs: '12px',
          sm: '14px',
          md: '16px',
          lg: '18px',
          xl: '24px',
          xxl: '30px',
        },
        letterSpacing: {
          xs: '-0.24px',
          sm: '0.75px',
          md: '1px',
          lg: '1.5px',
          xl: '2px',
          xxl: '3px',
        },
      },
    };
  } else {
    return {
      spacing: {
        safeAreaView: '75px',
      },
      colors: {
        primary: '#EE6E12',
        white: '#ffffff',
        black: '#000000',
        background1: '#272620',
        chatBackground: '#5A4F31',
      },
      text: {
        colors: {
          secondary: '#ffffff',
          secondaryInverse: '#000000',
          primary: '#FF912D',
        },
        weight: {
          regular: '400',
          bold: '700',
          semibold: '600',
        },
        family: 'Noto Sans',
        chatMessage: {
          backgroundAssistant: '#272620',
          backgroundUser: '#FF912D',
          inputBackground: '#4C4229',
        },
        size: {
          xs: '12px',
          sm: '14px',
          md: '16px',
          lg: '18px',
          xl: '24px',
          xxl: '30px',
        },
        letterSpacing: {
          xs: '-0.24px',
          sm: '0.75px',
          md: '1px',
          lg: '1.5px',
          xl: '2px',
          xxl: '3px',
        },
      },
    };
  }
};
