import React from "react";
import Navbar from "./Navbar";
import RouteProtector from "../RouteProtector";
import Footer from "../Footer";
import Divider from "./Divider";
import Sidebar from "../Sidebar";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <RouteProtector>
      <main>
        <Sidebar />
        {/* <Navbar /> */}
        <section className="mt-24  w-[100%] px-4 sm:mt-32 sm:w-[60%] md:ml-[20rem] md:mt-16 md:w-[70%] md:px-0">
          {children}
        </section>
      </main>
      {/* <Footer /> */}
    </RouteProtector>
  );
};

export default Layout;
