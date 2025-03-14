import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogout } from "@/hooks/useLogout";
import { useAuthContext } from "@/hooks/useAuthContext";
import { Button } from "@/shadcn/components/ui/button";
import {
  ExitIcon,
  DashboardIcon,
  PersonIcon,
  CounterClockwiseClockIcon,
  Cross2Icon,
  GearIcon,
  ShuffleIcon,
  MagicWandIcon,
} from "@radix-ui/react-icons";
import Logo from "./Logo";
import { Separator } from "@/shadcn/components/ui/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shadcn/components/ui/avatar";
import getInitials from "@/utils/getInitials";

export default function Sidebar({ rerender, isOpen, onClose }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { logout } = useLogout();
  const { user } = useAuthContext();

  // Verifica se o usuário está carregado
  if (!user) {
    return null; // Ou renderize um estado de carregamento
  }

  const displayName = user.displayName || "Usuário";
  const initials = getInitials(displayName);
  const firstName = displayName.split(" ")[0];

  const isSelected = (path) => {
    return pathname === path;
  };

  const handleLogout = async () => {
    logout();
  };

  const handleLogoClick = () => {
    navigate("/");
    onClose(); // Fechar sidebar ao clicar no logo
  };

  const handleNavigation = (path) => {
    navigate(path);
    onClose(); // Fechar sidebar ao clicar em um item
  };

  return (
    <>
      {/* Código para mobile */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } sm:hidden`}
      >
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        ></div>
        <nav
          className={`fixed h-full w-[250px] bg-background z-50 transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-5 flex justify-between items-center">
            <Logo size="sm" />
            <button onClick={onClose}>
              <Cross2Icon className="h-6 w-6 text-black" />
            </button>
          </div>
          <div className="p-5 flex items-center gap-3 mb-6">
            <Avatar>
              <AvatarImage src={user.photoURL} />
              <AvatarFallback className="bg-primary/50 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{firstName}</p>
              <p className="text-sm text-muted-foreground/75">
                Premium account
              </p>
            </div>
          </div>
          <div className="flex-grow overflow-auto">
            <div
              role="button"
              className={`py-2 px-3 flex items-center gap-3 cursor-pointer ${
                isSelected("/") ? "bg-muted" : "hover:bg-muted/60"
              } mt-2 rounded-sm`}
              onClick={() => handleNavigation("/")}
            >
              <DashboardIcon className="text-foreground" />
              <span>Visão Geral</span>
            </div>
            <div
              role="button"
              className={`py-2 px-3 flex items-center gap-3 cursor-pointer ${
                isSelected("/fluxos") ? "bg-muted" : "hover:bg-muted/60"
              } mt-2 rounded-sm`}
              onClick={() => handleNavigation("/fluxos")}
            >
              <ShuffleIcon className="text-foreground" />
              <span>Fluxos</span>
            </div>
            <div
              role="button"
              className={`py-2 px-3 flex items-center gap-3 cursor-pointer ${
                isSelected("/automacoes") ? "bg-muted" : "hover:bg-muted/60"
              } mt-2 rounded-sm`}
              onClick={() => handleNavigation("/automacoes")}
            >
              <MagicWandIcon className="text-foreground" />
              <span>Automações por I.A</span>
            </div>
            <div
              role="button"
              className={`py-2 px-3 flex items-center gap-3 cursor-pointer ${
                isSelected("/chat") ? "bg-muted" : "hover:bg-muted/60"
              } mt-2 rounded-sm`}
              onClick={() => handleNavigation("/chat")}
            >
              <CounterClockwiseClockIcon className="text-foreground" />
              <span>Chat WhatsApp</span>
            </div>

            <div
              role="button"
              className={`py-2 px-3 flex items-center gap-3 cursor-pointer ${
                isSelected("/config") ? "bg-muted" : "hover:bg-muted/60"
              } mt-2 rounded-sm`}
              onClick={() => handleNavigation("/config")}
            >
              <GearIcon className="text-foreground" />
              <span>Configurações</span>
            </div>
          </div>
          <div className="p-5">
            <Separator className="bg-border" />
          </div>
          <div className="px-5 pb-5">
            <div
              role="button"
              className={`py-2 px-3 flex items-center gap-3 cursor-pointer ${
                isSelected("/account") ? "bg-muted" : "hover:bg-muted/60"
              } mt-1 rounded-sm`}
              onClick={() => handleNavigation("/account")}
            >
              <PersonIcon className="text-foreground" />
              <span>Meu perfil</span>
            </div>
            <Button
              size="noPadding"
              variant="ghost"
              onClick={() => {
                handleLogout();
                onClose();
              }}
              className="flex items-center gap-3 px-3 mt-3"
              style={{
                opacity: 0.5,
                backgroundColor: "transparent",
                border: "none",
              }}
            >
              <ExitIcon className="text-foreground" />
              <span>Sair da conta</span>
            </Button>
          </div>
          {rerender && <span className="hidden"></span>}
        </nav>
      </div>
      <nav className="hidden sm:block h-full sticky top-0 min-h-screen w-[250px] border-r border-border/50 bg-background">
        <div className="p-5">
          <div className="flex items-center gap-3 mb-10">
            <div
              className="px-3.5"
              onClick={handleLogoClick}
              style={{ cursor: "pointer" }}
            >
              <Logo size="sm" />
            </div>
          </div>
          <div className="px-2 flex items-center gap-3 mb-6">
            <Avatar>
              <AvatarImage src={user.photoURL} />
              <AvatarFallback className="bg-primary/50 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{firstName}</p>
              <p className="text-sm text-muted-foreground/75">
                Premium account
              </p>
            </div>
          </div>
          <div className="flex-grow overflow-auto">
            <div
              role="button"
              className={`py-2 px-3 flex items-center gap-3 cursor-pointer ${
                isSelected("/") ? "bg-muted" : "hover:bg-muted/60"
              } mt-2 rounded-sm`}
              onClick={() => navigate("/")}
            >
              <DashboardIcon className="text-foreground" />
              <span>Visão Geral</span>
            </div>
            <div
              role="button"
              className={`py-2 px-3 flex items-center gap-3 cursor-pointer ${
                isSelected("/fluxos") ? "bg-muted" : "hover:bg-muted/60"
              } mt-2 rounded-sm`}
              onClick={() => navigate("/fluxos")}
            >
              <ShuffleIcon className="text-foreground" />
              <span>Fluxos</span>
            </div>
            <div
              role="button"
              className={`py-2 px-3 flex items-center gap-3 cursor-pointer ${
                isSelected("/automacoes") ? "bg-muted" : "hover:bg-muted/60"
              } mt-2 rounded-sm`}
              onClick={() => navigate("/automacoes")}
            >
              <MagicWandIcon className="text-foreground" />
              <span>Automações por I.A</span>
            </div>
            <div
              role="button"
              className={`py-2 px-3 flex items-center gap-3 cursor-pointer ${
                isSelected("/chat") ? "bg-muted" : "hover:bg-muted/60"
              } mt-2 rounded-sm`}
              onClick={() => navigate("/chat")}
            >
              <CounterClockwiseClockIcon className="text-foreground" />
              <span>Chat WhatsApp</span>
            </div>

            <div
              role="button"
              className={`py-2 px-3 flex items-center gap-3 cursor-pointer ${
                isSelected("/config") ? "bg-muted" : "hover:bg-muted/60"
              } mt-2 rounded-sm`}
              onClick={() => navigate("/config")}
            >
              <GearIcon className="text-foreground" />
              <span>Configurações</span>
            </div>
          </div>
        </div>

        <div className="p-5">
          <Separator className="bg-border" />
        </div>
        <div className="px-5 pb-5">
          <div
            role="button"
            className={`py-2 px-3 flex items-center gap-3 cursor-pointer ${
              isSelected("/account") ? "bg-muted" : "hover:bg-muted/60"
            } mt-1 rounded-sm`}
            onClick={() => navigate("/account")}
          >
            <PersonIcon className="text-foreground" />
            <span>Meu perfil</span>
          </div>
          <Button
            size="noPadding"
            variant="ghost"
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 mt-3"
            style={{
              opacity: 0.5,
              backgroundColor: "transparent",
              border: "none",
            }}
          >
            <ExitIcon className="text-foreground" />
            <span>Sair da conta</span>
          </Button>
        </div>
        {rerender && <span className="hidden"></span>}
      </nav>
    </>
  );
}
