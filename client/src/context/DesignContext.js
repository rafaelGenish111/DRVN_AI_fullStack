import React, { createContext, useContext, useMemo, useState, useCallback } from "react";
import { createTheme, ThemeProvider } from "@mui/material";

const DesignContext = createContext();

export const DesignProvider = ({ children }) => {
    const [design, setDesign] = useState({
        primaryColor: '#2fa362',
        icon: 'TimerIcon',
        font: 'Roboto, sans-serif',
        fontSize: 16,
    });

    const theme = useMemo(() => createTheme({
        palette: {
            primary: {
                main: design.primaryColor || '#2fa362',
            },
        },
        typography: {
            fontFamily: design.font || 'Roboto, sans-serif',
            fontSize: design.fontSize || 16,
        },
    }), [design]);

    const updateDesign = useCallback((newDesign) => {
        setDesign((prevDesign) => ({
            ...prevDesign,
            ...newDesign,
        }));
    }, []);

    return (
        <DesignContext.Provider value={{ design, updateDesign }}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </DesignContext.Provider>
    );
};

export const useDesign = () => useContext(DesignContext);