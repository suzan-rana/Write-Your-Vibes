"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Button from "./ui/Button";
import SkeletonCard from "./ui/Skeleton/SkeletonCard";
import Cookies from "js-cookie";
type Props = {
  children: React.ReactNode;
};

const RouteProtector = ({ children }: Props) => {
  const { status } = useSession();
  const router = useRouter();
  const handleRouterPush = async (link: string) => {
    await router.push(link);
  };
  useEffect(() => {
    if (status === "unauthenticated") {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      handleRouterPush("/auth/login").then(() => {
        return null;
      });
    }
  }, []);
  if (status === "loading") {
    return (
      <div className="mx-auto flex flex-col gap-8 md:mt-20 md:w-[80%] md:flex-row">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }
  if (status === "unauthenticated") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="mx-auto text-center">
          <h1 className="mb-6">
            You are not authorized to visit this page. Please login and try
            again.
          </h1>
          {/* // eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <Button onClick={() => router.push("/auth/login")}>Login</Button>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};

export default RouteProtector;
