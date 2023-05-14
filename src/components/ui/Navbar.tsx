import { Variants, AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CgMenuLeft } from "react-icons/cg";
import { cn } from "~/lib/utils";


const Navbar = () => {
  const { data } = useSession();
  const [showNavMenu, setShowNavMenu] = useState(true);

  useEffect(() => {
    if (window.innerWidth <= 500) {
      setShowNavMenu(false);
    }
  }, []);

  const handleLinkClick = () => {
    if (window.innerWidth <= 500) {
      setShowNavMenu(false);
    }
  };
  return (
    <header
      className={cn(
        "fixed bottom-0 z-50 left-0 right-[40%] top-0 mx-auto  w-[70%] sm:static sm:mt-1 sm:w-[80%] sm:bg-transparent",
        showNavMenu && "bg-slate-950 transition-all duration-500"
      )}
    >
      <CgMenuLeft
        className={cn("ml-2 mt-8 h-10 w-10 py-2 px-2 bg-slate-950 rounded-lg sm:hidden")}
        onClick={() => setShowNavMenu((prev) => !prev)}
      />
      <nav
        className={`cursor-pointer   flex-col justify-between gap-6 rounded-md px-4 py-4 transition-all duration-200 sm:flex-row ${
          showNavMenu ? "flex" : "hidden sm:flex"
        }`}
      >
        <div className="flex flex-col gap-6 sm:flex-row">
          {navElements.map(
            (navItem: Omit<NavItemProps, "showNavMenu" | "onClick">) => {
              return (
                <NavItem
                  onClick={handleLinkClick}
                  showNavMenu={showNavMenu}
                  key={navItem.name}
                  {...navItem}
                />
              );
            }
          )}
        </div>
        <NavItem
          onClick={handleLinkClick}
          showNavMenu={showNavMenu}
          name={data?.user.name || "Login"}
          link={data?.user.id ? "/profile" : "/auth/login"}
        />
      </nav>
    </header>
  );
};

export default Navbar;

const navElements: Omit<NavItemProps, "showNavMenu" | "onClick">[] = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Create",
    link: "/create",
  },
  {
    name: "Discover",
    link: "/discover",
  },
  {
    name: "Blog",
    link: "/blog",
  },
];

interface NavItemProps {
  name: string;
  link: string;
  showNavMenu: boolean;
  onClick: (event: any) => void;
}

const navItemVariants: Variants = {
  initial: {
    x: -100,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
  },
};

const NavItem = ({ name, link, showNavMenu, onClick }: NavItemProps) => {
  return (
    <>
      {showNavMenu && (
        <motion.p
          className="text-gray-400"
          key={name}
          variants={navItemVariants}
          initial="initial"
          animate={"animate"}
          exit={{
            x: 500,
            opacity: 1,
          }}
          onClick={onClick}
        >
          <Link href={link}>{name}</Link>
        </motion.p>
      )}
    </>
  );
};
