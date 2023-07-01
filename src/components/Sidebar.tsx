import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { cn } from "~/lib/utils";

type Props = {};

const Sidebar = (props: Props) => {
  const router = useRouter();
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/auth/login",
      redirect: false,
    });
    await router.push("/auth/login");
  };
  return (
    <section
      className="fixed bottom-0 left-0 top-0 min-w-[16rem] border-r-[1px] border-gray-700"
      style={{
        backgroundColor: "rgb(4 9 20)",
      }}
    >
      <h1 className="mt-6 text-center  text-2xl font-bold capitalize text-red-400">
        VIBE
      </h1>
      <div className="mt-6 flex flex-col gap-2  px-4">
        {navigationArray.map((item, index) => (
          <Link
            href={item.link}
            className={cn(
              "inline-block rounded-sm py-3 pl-5 transition-all duration-100 hover:bg-red-400",
              router.pathname === item.link ? "bg-red-400" : "bg-transparent"
            )}
          >
            <>{item.name}</>
          </Link>
        ))}
        <div className="mt-[50vh] grow">
          <Link
            href={"/profile"}
            className={cn(
              " block rounded-sm py-3 pl-5 transition-all duration-100 hover:bg-red-400",
              router.pathname === "/profile" ? "bg-red-400" : "bg-transparent"
            )}
          >
            Profile
          </Link>
          <p
            className=" block rounded-sm py-3 pl-5 transition-all duration-100 hover:bg-red-400"
            onClick={handleLogout}
          >
            Log out
          </p>
        </div>
      </div>
    </section>
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
];