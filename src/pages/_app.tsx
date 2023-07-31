import { AppProps, type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "react-toastify/dist/ReactToastify.css";
import { Inter } from "next/font/google";

export const p = Inter({ subsets: ["latin"], weight: "400", adjustFontFallback: true });
import { api } from "~/utils/api";

import "~/styles/globals.css";
import { useRouter } from "next/router";
import { ReactElement, ReactNode, useEffect } from "react";
import { ToastContainer, Zoom, Slide } from "react-toastify";
import { NextPage } from "next";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import "react-loading-skeleton/dist/skeleton.css";


export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
   router,
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  useEffect(() => {
    router.events.on("routeChangeStart", () => NProgress.start());
    router.events.on("routeChangeComplete", () => NProgress.done());
    router.events.on("routeChangeError", () => NProgress.done());
  }, []);
  return (
    <main className={`${p.className}`}>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/*  @ts-ignore */}
      <SessionProvider session={session as Session}>
        <ToastContainer
          toastClassName={() =>
            "bg-slate-900 shadow-md rounded border mx-auto mt-8 sm:mt-0 w-[80%] sm:w-auto text-sm sm:text-md border-slate-700 text-white py-3  pl-4"
          }
          position="top-center"
          closeButton={false}
          hideProgressBar
          limit={4}
          role="alert"
          autoClose={1500}
          // transition={}
        />
        {/* {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtoolsPanel setIsOpen={() => {}} onDragStart={() => {}} position="bottom" isOpen={true} />
        )} */}

        {getLayout(<Component {...pageProps} />)}
      </SessionProvider>
    </main>
  );
};

export default api.withTRPC(MyApp);
