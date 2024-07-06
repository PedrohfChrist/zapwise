// App.jsx
import React, { useState } from "react";
import Topbar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import { ThemeProvider } from "./providers/ThemeProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import Loading from "./components/Loading";
import Account from "./pages/Account/Account";
import History from "./pages/HystoryProjects/History";
import Collection from "./pages/Collection/Collection";
import Persona from "./pages/Persona/Persona";
import Subscription from "./pages/Subscription/Subscription";
import FbAdsTitle from "./modules/Anúncios/FbAdsTitle";
import SubscriptionProvider from "@/contexts/SubscriptionContext";
import FbAdsText from "./modules/Anúncios/FbAdsText";
import FbVideoAds from "./modules/Anúncios/FbVideoAds";
import EmailBoletoGerado from "./modules/Email/EmailBoletoGerado";
import EmailCarrinhoAbandonado from "./modules/Email/EmailCarrinhoAbandonado";
import MecanismoUnico from "./modules/Oferta/MecanismoUnico";
import Niche from "./modules/Oferta/Niche";
import ProductName from "./modules/Oferta/ProductName";
import PromessaPrincipal from "./modules/Oferta/PromessaPrincipal";
import Depoimentos from "./modules/Páginas/Depoimentos";
import LeadingPage from "./modules/Páginas/LeadingPage";
import SalesPage from "./modules/Páginas/SalesPage";
import ThanksPage from "./modules/Páginas/ThanksPage";
import VslScript from "./modules/VSL/VslScript";
import VslUpsell from "./modules/VSL/VslUpsell";
import PersonaProvider from "@/contexts/PersonaContext";
import useMediaQuery from "./hooks/useMediaQuery";

function App() {
  const { user, authIsReady } = useAuthContext();
  const [rerender, setRerender] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");

  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (!authIsReady) {
    return <Loading />;
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SubscriptionProvider>
        <PersonaProvider>
          <div
            className={`App flex h-full ${isMobile ? "flex-col pt-16" : ""}`}
          >
            <BrowserRouter>
              {user ? (
                <>
                  {isMobile && <Topbar onMenuClick={handleMenuClick} />}
                  <Sidebar
                    rerender={rerender}
                    isOpen={isSidebarOpen}
                    onClose={handleCloseSidebar}
                  />
                  <div className="flex-grow">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/history" element={<History />} />
                      <Route path="/collection" element={<Collection />} />
                      <Route path="/persona" element={<Persona />} />
                      <Route path="/subscription" element={<Subscription />} />
                      <Route
                        path="/account"
                        element={
                          <Account
                            rerender={rerender}
                            setRerender={setRerender}
                          />
                        }
                      />
                      <Route path="*" element={<Home />} />
                      <Route
                        path="/create/fb-ads-title"
                        element={<FbAdsTitle />}
                      />
                      <Route
                        path="/create/fb-ads-text"
                        element={<FbAdsText />}
                      />
                      <Route
                        path="/create/video-ads"
                        element={<FbVideoAds />}
                      />
                      <Route
                        path="/create/pagina-vendas"
                        element={<SalesPage />}
                      />
                      <Route
                        path="/create/pagina-captura"
                        element={<LeadingPage />}
                      />
                      <Route
                        path="/create/pagina-agradecimento"
                        element={<ThanksPage />}
                      />
                      <Route
                        path="/create/depoimentos"
                        element={<Depoimentos />}
                      />
                      <Route
                        path="/create/roteiro-vsl"
                        element={<VslScript />}
                      />
                      <Route
                        path="/create/roteiro-vsl-upsell"
                        element={<VslUpsell />}
                      />
                      <Route
                        path="/create/email-carrinho-abandonado"
                        element={<EmailCarrinhoAbandonado />}
                      />
                      <Route
                        path="/create/email-boleto"
                        element={<EmailBoletoGerado />}
                      />
                      <Route
                        path="/create/oferta-nome"
                        element={<ProductName />}
                      />
                      <Route path="/create/oferta-nicho" element={<Niche />} />
                      <Route
                        path="/create/oferta-mecanismo"
                        element={<MecanismoUnico />}
                      />
                      <Route
                        path="/create/oferta-promessa"
                        element={<PromessaPrincipal />}
                      />
                    </Routes>
                  </div>
                </>
              ) : (
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="*" element={<Signup />} />
                </Routes>
              )}
            </BrowserRouter>
          </div>
        </PersonaProvider>
      </SubscriptionProvider>
    </ThemeProvider>
  );
}

export default App;
