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
          className="mx-auto ml-2 mt-24 min-h-[80vh] w-[90%] sm:mt-32 sm:w-[60%] md:ml-2 md:mt-12 md:w-[75%]  "
          style={{
            marginInline: "auto",
          }}
        >
          {children}
        </section>
      </main>
    </RouteProtector>
  );
};

export default Layout;
