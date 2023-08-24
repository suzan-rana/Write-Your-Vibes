import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { cn } from "~/lib/utils";

type Props = {};

const Sidebar = (props: Props) => {
  const router = useRouter();
  const { data } = useSession();
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/auth/login",
      redirect: false,
    });
    window.location.href = "/auth/login";
    // await router.push("/auth/login");
  };
  return (
    <>
      <section
        className="fixed bottom-0 left-0 top-0 z-[1000] hidden min-w-[16rem] border-r-[1px] border-gray-700 md:block"
        style={{
          backgroundColor: "rgb(4 9 20)",
        }}
      >
        <h1 className="mt-6 text-center  text-xl font-bold capitalize text-red-400">
          CONTENT CREATOR
        </h1>
        <div className="mt-6 flex flex-col gap-2  px-4">
          {navigationArray.map((item, index) => (
            <Link
              href={item.link}
              key={item.name}
              className={cn(
                "inline-block rounded-sm py-3 pl-5 transition-all duration-100 hover:bg-red-400",
                router.pathname === item.link ? "bg-red-400" : "bg-transparent"
              )}
            >
              <>{item.name}</>
            </Link>
          ))}
          {data.user.role === "ADMIN" && (
            <>
              <Link
                href={"/admin"}
                className={cn(
                  "inline-block rounded-sm py-3 pl-5 transition-all duration-100 hover:bg-red-400",
                  router.pathname === "/admin" ? "bg-red-400" : "bg-transparent"
                )}
              >
                <>All Users</>
              </Link>
              <Link
                href={"/admin/all-posts"}
                className={cn(
                  "inline-block rounded-sm py-3 pl-5 transition-all duration-100 hover:bg-red-400",
                  router.pathname === "/admin/all-posts"
                    ? "bg-red-400"
                    : "bg-transparent"
                )}
              >
                <>All Posts</>
              </Link>
            </>
          )}
          <div
            className={cn(
              "grow",
              data.user.role === "ADMIN" ? "mt-[30vh]" : "mt-[45vh]"
            )}
          >
            <Link
              href={"/profile"}
              className={cn(
                " block rounded-sm py-3 pl-5 transition-all duration-100 hover:bg-red-400",
                router.pathname === "/profile" ? "bg-red-400" : "bg-transparent"
              )}
            >
              Profile
            </Link>
            <span
              className=" block cursor-pointer rounded-sm py-3 pl-5 transition-all duration-100 hover:bg-red-400"
              onClick={handleLogout}
            >
              Log out
            </span>
          </div>
        </div>
      </section>
      <SidebarMobile />
    </>
  );
};

export default Sidebar;
const navigationArray = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Create",
    link: "/create",
  },
  {
    name: "Blog",
    link: "/blog",
  },
  {
    name: "Search",
    link: "/search",
  },
];

const SidebarMobile = (props: Props) => {
  const router = useRouter();
  const { data } = useSession();
  const [isActive, setIsActive] = useState(false);
  const handleLogout = async () => {
    setIsActive((p) => !p);
    await signOut({
      callbackUrl: "/auth/login",
      redirect: false,
    });
    window.location.href = "/auth/login";
    // await router.push("/auth/login");
  };
  return (
    <>
      <div
        className="fixed flex lg:hidden left-[5%] top-[3%]  w-[50px] cursor-pointer flex-col items-center justify-center gap-2 rounded-md bg-white p-2"
        onClick={() => setIsActive((p) => !p)}
      >
        <span className="block h-[3px] w-full rounded-lg bg-black text-white"></span>
        <span className="block h-[4px] w-full rounded-lg bg-black text-white"></span>
      </div>
      <section
        className={cn(
          "fixed bottom-0 lg:hidden left-0 top-0 z-[1000] min-w-[16rem] border-r-[1px] border-gray-700 transition-all duration-200",
          isActive ? "translate-x-0" : "translate-x-[-100%]"
        )}
        style={{
          backgroundColor: "rgb(4 9 20)",
        }}
      >
        <div className="mt-6 flex items-center justify-between px-4">
          <h1 className="text-left  text-lg font-bold capitalize text-red-400">
            Content Creator
          </h1>
          <div
            className="flex h-full w-[18%] cursor-pointer flex-col items-center justify-center gap-2"
            onClick={() => setIsActive((p) => !p)}
          >
            <span className="block h-[3px] w-full rounded-lg bg-white text-white"></span>
            <span className="block h-[4px] w-full rounded-lg bg-white text-white"></span>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-2  px-4">
          {navigationArray.map((item, index) => (
            <Link
              href={item.link}
              key={item.name}
              className={cn(
                "inline-block rounded-sm py-3 pl-5 transition-all duration-100 hover:bg-red-400",
                router.pathname === item.link ? "bg-red-400" : "bg-transparent"
              )}
              onClick={() => setIsActive((p) => !p)}
            >
              <>{item.name}</>
            </Link>
          ))}
          {data.user.role === "ADMIN" && (
            <>
              <Link
                href={"/admin"}
                className={cn(
                  "inline-block rounded-sm py-3 pl-5 transition-all duration-100 hover:bg-red-400",
                  router.pathname === "/admin" ? "bg-red-400" : "bg-transparent"
                )}
              >
                <>All Users</>
              </Link>
              <Link
                href={"/admin/all-posts"}
                className={cn(
                  "inline-block rounded-sm py-3 pl-5 transition-all duration-100 hover:bg-red-400",
                  router.pathname === "/admin/all-posts"
                    ? "bg-red-400"
                    : "bg-transparent"
                )}
                onClick={() => setIsActive((p) => !p)}
              >
                <>All Posts</>
              </Link>
            </>
          )}
          <div
            className={cn(
              "grow",
              data.user.role === "ADMIN" ? "mt-[30vh]" : "mt-[45vh]"
            )}
          >
            <Link
              href={"/profile"}
              className={cn(
                " block rounded-sm py-3 pl-5 transition-all duration-100 hover:bg-red-400",
                router.pathname === "/profile" ? "bg-red-400" : "bg-transparent"
              )}
              onClick={() => setIsActive((p) => !p)}
            >
              Profile
            </Link>
            <span
              className=" block cursor-pointer rounded-sm py-3 pl-5 transition-all duration-100 hover:bg-red-400"
              onClick={handleLogout}
            >
              Log out
            </span>
          </div>
        </div>
      </section>
    </>
  );
};
