import React from "react";
import Navbar from "./Navbar";
import RouteProtector from "../RouteProtector";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <RouteProtector>
      <main>
        <Navbar />
        <section
          className="w-[100%] px-4 md:px-0 mt-24 min-h-[80vh] sm:mt-32 sm:w-[60%] md:mt-10 md:w-[70%] md:mx-auto"
        >
          {children}
        </section>
      </main>
    </RouteProtector>
  );
};

export default Layout;
