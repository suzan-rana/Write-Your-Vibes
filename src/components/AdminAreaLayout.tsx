import React, { ReactNode } from "react";
import RouteProtector from "./RouteProtector";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

type Props = {
  children: ReactNode;
};

const AdminAreaLayout = ({ children }: Props) => {
  return (
    <RouteProtector>
      <main>
        <Sidebar />
        {/* <Navbar /> */}
        <section className="mt-24  w-[100%] px-4 sm:mt-32 sm:w-[60%] md:ml-[20rem] md:mt-16 md:w-[70%] md:px-0">
          {children}
        </section>
      </main>
    </RouteProtector>
  );
};

export default AdminAreaLayout;

const Sidebar = () => {
  const router = useRouter();
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/auth/login",
      redirect: false,
    });
    window.location.href = "/auth/login";
    // await router.push("/auth/login");
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
        <Link
          href={"/admin"}
          className={cn(
            "inline-block rounded-sm py-3 pl-5 transition-all duration-100 hover:bg-red-400",
            router.pathname === "/admin" ? "bg-red-400" : "bg-transparent"
          )}
        >
          <>{"Users"}</>
        </Link>

        <div className="mt-[70vh] grow">
          {/* <Link
            href={"/profile"}
            className={cn(
              " block rounded-sm py-3 pl-5 transition-all duration-100 hover:bg-red-400",
              router.pathname === "/profile" ? "bg-red-400" : "bg-transparent"
            )}
          >
            Profile
          </Link> */}
          <p
            className=" block cursor-pointer hover:text-white rounded-sm py-3 pl-5 transition-all duration-100 hover:bg-red-400"
            onClick={handleLogout}
          >
            Log out
          </p>
        </div>
      </div>
    </section>
  );
};
