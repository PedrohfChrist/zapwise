import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Topbar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import PasswordRecovery from "./pages/Recover/Recover";
import { ThemeProvider } from "./providers/ThemeProvider";
import { useAuthContext } from "./hooks/useAuthContext";
import Loading from "./components/Loading";
import Account from "./pages/Account/Account";
import History from "./pages/HystoryProjects/History";
import Collection from "./pages/Collection/Collection";
import Persona from "./pages/Persona/Persona";
import Subscription from "./pages/Subscription/Subscription";
import FbAdsTitle from "./modules/Anúncios/FbAdsTitle";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
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
import { PersonaProvider } from "./contexts/PersonaContext";
import useMediaQuery from "./hooks/useMediaQuery";
import { Toaster } from "@/shadcn/components/ui/toaster";
import { UserDocProvider } from "@/contexts/UserDocContext";
import ReactPixel from "react-facebook-pixel";
import { getUniqueId } from "@/utils/getUniqueId";
import { getCookie, setCookie } from "@/utils/getCookie";
import { hashString } from "@/utils/hashString";
import Help from "./pages/Help/Help"; // Importando o componente Help

function App() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") return;

    const options = {
      autoConfig: true,
      debug: true,
    };

    const uniqueEventId = getUniqueId();

    ReactPixel.init("512659814615709", {}, options);
    fbq("track", "PageView", {}, { eventID: uniqueEventId });

    const fbp = getCookie("_fbp");
    const fbc = getCookie("_fbc");

    fetch(
      "https://us-central1-adcraftor-8d13a.cloudfunctions.net/facebookCapi",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_name: "PageView",
          fbp: fbp,
          fbc: fbc,
          event_id: uniqueEventId,
          action_source: "website",
          event_source_url: window.location.href.split("?")[0],
          user_agent: navigator.userAgent,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Houve um erro no envio:", error));
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const parameters = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "sck",
      "ref",
    ];

    parameters.forEach((param) => {
      const value = urlParams.get(param);
      if (value) {
        setCookie(param, value, 60);
      }
    });
  }, [window.location.search]);

  return <AppRoutes />;
}

function AppRoutes() {
  const { user, authIsReady } = useAuthContext();
  const [rerender, setRerender] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    if (process.env.NODE_ENV === "development") return;

    if (authIsReady && user && !sessionStorage.getItem("pixelInitialized")) {
      const advancedMatching = {
        em: hashString(user.email),
        external_id: hashString(user.uid, false),
      };
      const options = {
        autoConfig: true,
        debug: false,
      };
      ReactPixel.init("512659814615709", advancedMatching, options);
      ReactPixel.pageView();

      sessionStorage.setItem("pixelInitialized", "true");
    }
  }, [authIsReady, user]);

  if (!authIsReady) return <Loading />;

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="App flex flex-col sm:flex-row">
        <Toaster />
        <BrowserRouter>
          {user ? (
            <UserDocProvider user={user}>
              <SubscriptionProvider user={user}>
                <PersonaProvider>
                  {isMobile ? (
                    <>
                      <Topbar onMenuClick={handleMenuClick} />
                      <Sidebar
                        rerender={rerender}
                        isOpen={isSidebarOpen}
                        onClose={handleCloseSidebar}
                      />
                    </>
                  ) : (
                    <div className="w-[250px] h-screen fixed top-0 left-0 overflow-y-auto">
                      <Sidebar rerender={rerender} setRerender={setRerender} />
                    </div>
                  )}
                  <div className="mt-12 sm:mt-0 flex-grow sm:ml-[250px]">
                    <Routes>
                      <Route exact path="/" element={<Home />} />
                      <Route
                        path="/account"
                        element={
                          <Account
                            rerender={rerender}
                            setRerender={setRerender}
                          />
                        }
                      />
                      <Route path="/help" element={<Help />} />
                      <Route path="*" element={<Home />} />
                      <Route path="/history" element={<History />} />
                      <Route path="/collection" element={<Collection />} />
                      <Route path="/persona" element={<Persona />} />
                      <Route path="/subscription" element={<Subscription />} />
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
                </PersonaProvider>
              </SubscriptionProvider>
            </UserDocProvider>
          ) : (
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/password/recovery" element={<PasswordRecovery />} />
              <Route path="*" element={<Signup />} />
            </Routes>
          )}
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
