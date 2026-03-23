import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "styled-components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import AdminPage from "./AdminPage";
import MobileApp from "./Mobile/MobileApp";
import GlobalStyle from "./styles/GlobalStyle";
import { theme } from "./styles/theme";
import LoginPage from "./LoginPage";
import { supabase } from "./lib/supabase";
import "computer-modern/cmu-serif.css";

const Root = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      subscription.unsubscribe();
    };
  }, []);

  const MainContent = isMobile ? <MobileApp /> : <App />;

  return (
    <Routes>
      <Route path="/" element={MainContent} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={session ? <AdminPage /> : <LoginPage />} />
    </Routes>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Root />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
