import "./styles/globals.css";

import App from "./App.tsx";

import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeProvider.tsx";
import { LanguageProvider } from "./contexts/LanguageProvider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthProvider.tsx";
import { Toaster } from "./components/ui/sonner.tsx";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={new QueryClient()}>
    <BrowserRouter>
      <AuthProvider>
          <ThemeProvider defaultTheme="light">
            <LanguageProvider>
              <App />
              <Toaster />
            </LanguageProvider>
          </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);
