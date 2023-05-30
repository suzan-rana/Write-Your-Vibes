'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Button from "./ui/Button";

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
      handleRouterPush("/auth/login");
    }
  }, []);
  if (status !== 'authenticated') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="mx-auto text-center">
          <h1 className="mb-6">
            You are not authorized to visit this page. Please login and try
            again.
          </h1>
          <Button onClick={() => router.push("/auth/login")}>Login</Button>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};

export default RouteProtector;
