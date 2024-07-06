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
  BookmarkIcon,
  AvatarIcon,
  BackpackIcon,
  Cross2Icon,
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
      <div
        className={`fixed inset-0 z-50 ${
          isOpen ? "block" : "hidden"
        } sm:hidden`}
      >
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        ></div>
        <nav className="fixed h-full w-[250px] bg-background z-50">
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
                {getInitials(user.displayName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.displayName.split(" ")[0]}</p>
              <p className="font-muted-foreground/75 text-sm">
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
              <span>Modelos</span>
            </div>
            <div
              role="button"
              className={`py-2 px-3 flex items-center gap-3 cursor-pointer ${
                isSelected("/history") ? "bg-muted" : "hover:bg-muted/60"
              } mt-2 rounded-sm`}
              onClick={() => handleNavigation("/history")}
            >
              <CounterClockwiseClockIcon className="text-foreground" />
              <span>Histórico</span>
            </div>
            <div
              role="button"
              className={`py-2 px-3 flex items-center gap-3 cursor-pointer ${
                isSelected("/collection") ? "bg-muted" : "hover:bg-muted/60"
              } mt-2 rounded-sm`}
              onClick={() => handleNavigation("/collection")}
            >
              <BookmarkIcon className="text-foreground" />
              <span>Salvos</span>
            </div>
            <div
              role="button"
              className={`py-2 px-3 flex items-center gap-3 cursor-pointer ${
                isSelected("/persona") ? "bg-muted" : "hover:bg-muted/60"
              } mt-2 rounded-sm`}
              onClick={() => handleNavigation("/persona")}
            >
              <PersonIcon className="text-foreground" />
              <span>Personas</span>
            </div>
          </div>
          <div className="p-5">
            <Separator className="bg-border" />
          </div>
          <div className="p-5">
            <div
              role="button"
              className={`py-2 px-3 flex items-center gap-3 cursor-pointer ${
                isSelected("/subscription") ? "bg-muted" : "hover:bg-muted/60"
              } mt-1 rounded-sm`}
              onClick={() => handleNavigation("/subscription")}
            >
              <BackpackIcon className="text-foreground" />
              <span>Planos e assinatura</span>
            </div>
            <div
              role="button"
              className={`py-2 px-3 flex items-center gap-3 cursor-pointer ${
                isSelected("/account") ? "bg-muted" : "hover:bg-muted/60"
              } mt-1 rounded-sm`}
              onClick={() => handleNavigation("/account")}
            >
              <AvatarIcon className="text-foreground" />
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
                {getInitials(user.displayName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.displayName.split(" ")[0]}</p>
              <p className="font-muted-foreground/75 text-sm">
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
              <span>Modelos</span>
            </div>
            <div
              role="button"
              className={`py-2 px-3 flex items-center gap-3 cursor-pointer ${
                isSelected("/history") ? "bg-muted" : "hover:bg-muted/60"
              } mt-2 rounded-sm`}
              onClick={() => navigate("/history")}
            >
              <CounterClockwiseClockIcon className="text-foreground" />
              <span>Histórico</span>
            </div>
            <div
              role="button"
              className={`py-2 px-3 flex items-center gap-3 cursor-pointer ${
                isSelected("/collection") ? "bg-muted" : "hover:bg-muted/60"
              } mt-2 rounded-sm`}
              onClick={() => navigate("/collection")}
            >
              <BookmarkIcon className="text-foreground" />
              <span>Salvos</span>
            </div>
            <div
              role="button"
              className={`py-2 px-3 flex items-center gap-3 cursor-pointer ${
                isSelected("/persona") ? "bg-muted" : "hover:bg-muted/60"
              } mt-2 rounded-sm`}
              onClick={() => navigate("/persona")}
            >
              <PersonIcon className="text-foreground" />
              <span>Personas</span>
            </div>
          </div>
        </div>
        <div className="p-5">
          <Separator className="bg-border" />
        </div>
        <div className="p-5">
          <div
            role="button"
            className={`py-2 px-3 flex items-center gap-3 cursor-pointer ${
              isSelected("/subscription") ? "bg-muted" : "hover:bg-muted/60"
            } mt-1 rounded-sm`}
            onClick={() => navigate("/subscription")}
          >
            <BackpackIcon className="text-foreground" />
            <span>Planos e assinatura</span>
          </div>
          <div
            role="button"
            className={`py-2 px-3 flex items-center gap-3 cursor-pointer ${
              isSelected("/account") ? "bg-muted" : "hover:bg-muted/60"
            } mt-1 rounded-sm`}
            onClick={() => navigate("/account")}
          >
            <AvatarIcon className="text-foreground" />
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
