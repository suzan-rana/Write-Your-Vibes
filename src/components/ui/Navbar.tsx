import { Variants, AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CgMenuLeft } from "react-icons/cg";
import { cn } from "~/lib/utils";
import { AProps, Avatar } from "./UserAvatar";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

const findNavigation = (currentPath: string) => {
  if (currentPath === "/") {
    return "Home";
  } else if (currentPath.startsWith("/create")) {
    return "Create";
  } else if (currentPath.startsWith("/blog")) {
    return "Blog";
  } else if (currentPath.startsWith("/discover")) {
    return "Discover";
  } else {
    return "Home";
  }
};

const Navbar = () => {
  const { data: user } = api.user.getPersonalDetails.useQuery();
  const [showNavMenu, setShowNavMenu] = useState(true);

  const router = useRouter();
  const [currentRoute, setCurrentRoute] = useState("");
  useEffect(() => {
    setCurrentRoute(findNavigation(router.pathname));
  }, [router]);

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
        "fixed  left-0  top-0  z-50 mx-auto sm:static sm:mt-1 sm:w-[80%] sm:bg-transparent",
        showNavMenu
          ? "bottom-0 right-[40%]  w-[70%] bg-slate-950 transition-all duration-500"
          : "sm:block"
      )}
    >
      <CgMenuLeft
        className={cn(
          "ml-2 mt-8 h-10 w-10 rounded-lg bg-slate-950 px-2 py-2 sm:hidden"
        )}
        onClick={() => setShowNavMenu((prev) => !prev)}
      />
      <nav
        className={`h-[65vh] cursor-pointer flex-col justify-between  gap-6 rounded-md px-4 py-4 transition-all duration-200 sm:h-auto sm:flex-row md:items-center md:py-2 ${
          showNavMenu ? "flex" : "hidden sm:flex"
        }`}
      >
        <div className="flex flex-col gap-6 sm:flex-row">
          {navElements.map(
            (navItem: Omit<NavItemProps, "showNavMenu" | "onClick">) => {
              return (
                <div key={navItem.name}>
                  <NavItem
                    onClick={handleLinkClick}
                    showNavMenu={showNavMenu}
                    {...navItem}
                    isCurrent={currentRoute === navItem.name}
                  />
                  {currentRoute === navItem.name ? (
                    <motion.div
                      className="mt-1 h-1 w-[30%] rounded-md bg-red-500 md:w-auto"
                      layoutId="underline"
                    />
                  ) : null}
                </div>
              );
            }
          )}
        </div>
        <UserProfile
          onClick={handleLinkClick}
          showNavMenu={showNavMenu}
          name={user?.name || "Login"}
          link={user?.id ? "/profile" : "/auth/login"}
          image={user?.image || ""}
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
  // {
  //   name: "Discover",
  //   link: "/discover",
  // },
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

const NavItem = ({
  name,
  link,
  showNavMenu,
  onClick,
  isCurrent
}: NavItemProps & { isCurrent: boolean }) => {
  return (
    <>
      {showNavMenu && (
        <motion.p
          className={cn("text-gray-400", isCurrent && 'text-red-400 transition-colors ')}
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

interface UserProfileProps
  extends AProps,
    Pick<NavItemProps, "onClick" | "showNavMenu" | "link"> {}
const UserProfile = ({
  name,
  sub,
  showNavMenu,
  ...restProps
}: UserProfileProps) => {
  return (
    <Link
      href={"/profile"}
      className="flex items-center gap-5  text-gray-300 md:gap-2"
      {...restProps}
    >
      <>
        <Avatar className="mb-2 bg-white" {...restProps} />
        <h2 className="block text-base md:hidden">{name}</h2>
      </>
    </Link>
  );
};
