import React, { ReactNode } from "react";
import RouteProtector from "./RouteProtector";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Sidebar from "./Sidebar";

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

