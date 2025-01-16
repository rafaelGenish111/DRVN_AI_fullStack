import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#77B254'
        },
        secondary: {
            main: '#123524'
        },
        error: {
            main: '#d32f2f', 
        },
        warning: {
            main: '#ffa726', 
        },
        success: {
            main: '#4caf50', 
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        fontSize: 14,
        h1: {
            fontSize: '2.5rem',
        },
        body1: {
            fontSize: '1rem',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px', // כפתורים עם פינות עגולות
                },
            },
        },
    },
});

export default theme;