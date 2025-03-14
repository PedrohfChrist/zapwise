import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Topbar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import PasswordRecovery from "./pages/Recover/Recover";
import { ThemeProvider } from "./providers/ThemeProvider";
import { useAuthContext } from "./hooks/useAuthContext";
import Loading from "./components/Loading";
import Account from "./pages/Account/Account";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import useMediaQuery from "./hooks/useMediaQuery";
import { Toaster } from "@/shadcn/components/ui/toaster";
import { UserDocProvider } from "@/contexts/UserDocContext";
import ReactPixel from "react-facebook-pixel";
import { getUniqueId } from "@/utils/getUniqueId";
import { getCookie, setCookie } from "@/utils/getCookie";
import { hashString } from "@/utils/hashString";
import Help from "./pages/Help/Help";
import Config from "./pages/Config/Config";
import Fluxos from "./pages/Fluxos/Fluxos";
import NovoFluxo from "./pages/Fluxos/NovoFluxo";
import NovoFluxoConfig from "./pages/Fluxos/NovoFluxoConfig";
import Automações from "./pages/Automacoes/Automacoes";
import ManualTwilioSetupPage from "./pages/TwilioSetup/ManualTwilioSetupPage";
import Chat from "./pages/Chat/Chat";
import { useFCM } from "@/hooks/useFCM";
import ExclusaoDados from "./components/ExclusaoDados";

function App() {
  // [1] Inicializa Facebook Pixel e tracking (somente em produção)
  useEffect(() => {
    if (process.env.NODE_ENV === "development") return;

    const options = { autoConfig: true, debug: true };
    const uniqueEventId = getUniqueId();
    ReactPixel.init("512659814615709", {}, options);
    // eslint-disable-next-line no-undef
    if (window.fbq) {
      fbq("track", "PageView", {}, { eventID: uniqueEventId });
    } else {
      console.warn(
        "fbq não está definido – verifique se o script do Facebook Pixel foi carregado."
      );
    }
    const fbp = getCookie("_fbp");
    const fbc = getCookie("_fbc");

    fetch("https://facebookcapi-sfveflcfxq-uc.a.run.app", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: "PageView",
        fbp,
        fbc,
        event_id: uniqueEventId,
        action_source: "website",
        event_source_url: window.location.href.split("?")[0],
        user_agent: navigator.userAgent,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log("FB CAPI resp:", data))
      .catch((error) => console.error("Houve um erro no envio:", error));
  }, []);

  // [2] Captura parâmetros UTM da URL
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
      if (value) setCookie(param, value, 60);
    });
  }, [window.location.search]);

  return <AppRoutes />;
}

function AppRoutes() {
  const { user, authIsReady } = useAuthContext();

  // Chama o hook incondicionalmente (o próprio hook checa se há user)
  useFCM(user);

  const [rerender, setRerender] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuClick = () => setIsSidebarOpen(!isSidebarOpen);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  // [3] Inicialização do Facebook Pixel para usuário logado
  useEffect(() => {
    if (process.env.NODE_ENV === "development") return;
    if (authIsReady && user && !sessionStorage.getItem("pixelInitialized")) {
      const advancedMatching = {
        em: hashString(user.email),
        external_id: hashString(user.uid, false),
      };
      const options = { autoConfig: true, debug: false };
      ReactPixel.init("512659814615709", advancedMatching, options);
      ReactPixel.pageView();
      sessionStorage.setItem("pixelInitialized", "true");
    }
  }, [authIsReady, user]);

  if (!authIsReady) return <Loading />;

  if (user) {
    return (
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <div className="App flex flex-col sm:flex-row">
          <Toaster />
          <BrowserRouter>
            {user ? (
              <UserDocProvider user={user}>
                <SubscriptionProvider user={user}>
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
                      <Route path="/fluxos" element={<Fluxos />} />
                      <Route path="/fluxos/novo" element={<NovoFluxo />} />
                      <Route
                        path="/fluxos/config/:fluxoId"
                        element={<NovoFluxoConfig />}
                      />
                      <Route path="/config" element={<Config />} />
                      <Route path="/automacoes" element={<Automações />} />
                      <Route path="/chat" element={<Chat />} />
                      <Route
                        path="/manual-twilio-setup"
                        element={<ManualTwilioSetupPage />}
                      />
                      <Route
                        path="/excluir-dados"
                        element={<ExclusaoDados />}
                      />
                    </Routes>
                  </div>
                </SubscriptionProvider>
              </UserDocProvider>
            ) : (
              <Routes>
                <Route path="/login" element={<Login />} />

                <Route
                  path="/password/recovery"
                  element={<PasswordRecovery />}
                />
                <Route path="*" element={<Login />} />
              </Routes>
            )}
          </BrowserRouter>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="App flex flex-col sm:flex-row">
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/password/recovery" element={<PasswordRecovery />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
