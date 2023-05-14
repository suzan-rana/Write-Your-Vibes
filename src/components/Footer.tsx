import React from "react";
import Button from "./ui/Button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

type Props = {};

const Footer = (props: Props) => {
  const router = useRouter();
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/auth/login",
      redirect: false,
    });
    await router.push("/auth/login");
  };
  return (
    <footer className="my-20 mt-32">
      <Button onClick={handleLogout}>Log out</Button>
    </footer>
  );
};

export default Footer;
