import React from "react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Logo from "./Logo";
import { Link } from "react-router-dom";

const Topbar = ({ onMenuClick }) => {
  return (
    <div className="fixed top-0 left-0 right-0 flex justify-between items-center p-4 bg-muted shadow-md z-50 sm:hidden">
      <Link to="/home">
        <Logo size="sm" />
      </Link>
      <button onClick={onMenuClick}>
        <HamburgerMenuIcon className="h-6 w-6 text-primary" />
      </button>
    </div>
  );
};

export default Topbar;
