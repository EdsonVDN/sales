import React, { useState, useEffect } from "react";

import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "react-query";

import { ptBR } from "@material-ui/core/locale";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { useMediaQuery } from "@material-ui/core";
import ColorModeContext from "./layout/themeContext";

import Routes from "./routes";

const queryClient = new QueryClient();

const App = () => {
    const [locale, setLocale] = useState();

    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const preferredTheme = window.localStorage.getItem("preferredTheme");
    const [mode, setMode] = useState(preferredTheme ? preferredTheme : prefersDarkMode ? "dark" : "light");

    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
            },
        }),
        []
    );
    

    const theme = createTheme(
        {
            scrollbarStyles: {
                "&::-webkit-scrollbar": {
                    width: '2px',
                    height: '8px',
                },
                "&::-webkit-scrollbar-thumb": {
                    boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
                    backgroundColor: "#004A77",
                },
                    /* Cor de fundo da trilha da barra de rolagem */
                "&::-webkit-scrollbar-track" :{
                    backgroundColor: "transparent",

                },
            },
            scrollbarStylesSoft: {
                "&::-webkit-scrollbar": {
                    width: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: mode === "light" ? "#F3F3F3" : "#333333",
                },
            },
            palette: {
                type: mode,
                primary: { main: mode === "light" ? "#000" : "#FFFFFF" },
                textPrimary: mode === "light" ? "#004A77" : "#FFFFFF",
                borderPrimary: mode === "light" ? "#004A77" : "#FFFFFF",
                dark: { main: mode === "light" ? "#333333" : "#F3F3F3" },
                light: { main: mode === "light" ? "#F3F3F3" : "#333333" },
                optionsBackground: mode === "light" ? "#fafafa" : "#333",
				options: mode === "light" ? "#fafafa" : "#0F0F0F",
				fontecor: mode === "light" ? "#128c7e" : "#fff",
                fancyBackground: mode === "light" ? "#DEE3E6" : "#131314",
				bordabox: mode === "light" ? "#eee" : "#333",
				newmessagebox: mode === "light" ? "#eee" : "#333",
				inputdigita: mode === "light" ? "#fff" : "#666",
				contactdrawer: mode === "light" ? "#fff" : "#131314",
				announcements: mode === "light" ? "#ededed" : "#333",
				login: mode === "light" ? "#fff" : "#1C1C1C",
				announcementspopover: mode === "light" ? "#fff" : "#666",
				chatlist: mode === "light" ? "#eee" : "#666",
				boxlist: mode === "light" ? "#ededed" : "#666",
				boxchatlist: mode === "light" ? "#ededed" : "#333",
                total: mode === "light" ? "#fff" : "#222",
                messageIcons: mode === "light" ? "grey" : "#F3F3F3",
                inputBackground: mode === "light" ? "#FFFFFF" : "#333",
                barraSuperior: mode === "light" ? "#DEE3E6" : "#131314",
                textoBarraSuperior: mode === "light" ? "#131314" : "#f2f2f2",
				campaigntab: mode === "light" ? "#ededed" : "#131314",
				mediainput: mode === "light" ? "#ededed" : "#1c1c1c",
                boxticket: mode === "light" ? "#f2f2f2" : "#333",
                ticketlist: mode === "light" ? "#fff" : "#1E1F20",
                tabHeaderBackground: mode === "light" ? "#EEE" : "#1E1F20",
                appBarIcons: mode === "light" ? "#004A77" : "#f7f7f7",
                sidebar: mode === "light" ? "#f2f2f2" : "#1E1F20",
                menuChevron: mode === "light" ? "#DEE3E6" : "#131314",
                menuChevronCollapsed: mode === "light" ? "#f2f2f2" : "#1E1F20",
                mainbox: mode === "light" ? "#f2f2f2" : "#333",
                internalChatRight: mode === "light" ? "#DCF8C6" : "#005C4B",
                internalChatLeft: mode === "light" ? "#f2f2f2" : "#202C33",
                internalChatText: mode === "light" ? "#131314" : "#f2f2f2",
                internalChatTicket: mode === "light" ? "#DEE3E6" : "#004A77",

            },
            mode,
            
        },
        locale
    );

    useEffect(() => {
        const i18nlocale = localStorage.getItem("i18nextLng");
        const browserLocale =
            i18nlocale.substring(0, 2) + i18nlocale.substring(3, 5);

        if (browserLocale === "ptBR") {
            setLocale(ptBR);
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem("preferredTheme", mode);
    }, [mode]);



    return (
        <ColorModeContext.Provider value={{ colorMode }}>
          <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
              <Routes />
            </QueryClientProvider>
          </ThemeProvider>
        </ColorModeContext.Provider>
      );
    };

export default App;
