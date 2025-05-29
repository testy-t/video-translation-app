import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { LanguageProvider } from "./context/LanguageContext";
import Index from "./pages/Index";
import GiftCards from "./pages/GiftCards";
import Instructions from "./pages/Instructions";
import NotFound from "./pages/NotFound";
import OrderProcess from "./pages/OrderProcess";
import OfferPage from "./pages/OfferPage";
import PrivacyPage from "./pages/PrivacyPage";
import ConfidentialityPage from "./pages/ConfidentialityPage";

// Компонент для отслеживания изменений маршрута и автоматической прокрутки вверх
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Используем небольшую задержку, чтобы скролл сработал после отрисовки нового контента
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
};

const queryClient = new QueryClient();

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/gift-cards" element={<GiftCards />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/order" element={<OrderProcess />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
