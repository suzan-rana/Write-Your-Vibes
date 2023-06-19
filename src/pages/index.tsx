import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import Button from "~/components/ui/Button";
import Navbar from "~/components/ui/Navbar";
import { NextPageWithLayout } from "./_app";
import Layout from "~/components/ui/Layout";
import UserAvatar from "~/components/ui/UserAvatar";
import MessageCard from "~/components/ui/Chat/ChatCard";
import Input from "~/components/ui/Input";
import { CategoryEnum } from "~/utils/category";
import { api } from "~/utils/api";
import Card from "~/components/ui/Card";
import { useState } from "react";
import { UseTRPCQuerySuccessResult } from "@trpc/react-query/shared";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "~/server/api/root";
import { TRPCClientErrorLike } from "@trpc/client";
import SkeletonCard from "~/components/ui/Skeleton/SkeletonCard";

const Home: NextPageWithLayout = () => {
  const { status } = useSession();
  const { data, isLoading, isFetching } =
    api.blog.getManyBlogsWithCategory.useQuery();
  if (status !== "authenticated") {
    return <Link href={"/auth/login"}>Login with email and password</Link>;
  }
  if (isLoading || isFetching) {
    return (
      <div className="grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }
  return (
    <>
      <main className="mx-auto mb-12 text-left md:w-[85%]">
        {data?.data.map((category) => (
          <PostByCategory
            isLoading={isLoading}
            category_name={category.category_name as keyof typeof CategoryEnum}
            key={category.id}
            posts={category.posts}
          />
        ))}
      </main>
    </>
  );
};

type BlogPostsType = NonNullable<
  UseTRPCQuerySuccessResult<
    inferRouterOutputs<AppRouter>["blog"]["getManyBlogsWithCategory"]["data"],
    TRPCClientErrorLike<AppRouter>
  >["data"]
>[number]["posts"];

const PostByCategory = ({
  category_name,
  posts,
  isLoading,
}: {
  category_name: keyof typeof CategoryEnum;
  posts: BlogPostsType;
  isLoading: boolean;
}) => {
  return (
    <>
      <article className="my-16">
        {posts !== undefined && !isLoading && (
          <h1 className="pb-6 text-xl font-bold md:text-2xl">
            Look what <span className="text-red-400">{category_name}</span> has
            to offer!
          </h1>
        )}
        <section className="flex flex-col flex-wrap gap-12 md:flex-row">
          {posts?.map((post) => (
            <Card
              key={post.id}
              id={post.id}
              isLoading={isLoading}
              count={post._count}
              title={post.title}
              subtitle={post.subtitle}
              createdAt={post.createdAt}
            ></Card>
          ))}
        </section>
        {posts !== undefined && !isLoading && (
          <Link
            href={`/category/${category_name}`}
            className="mt-6 block cursor-pointer text-center underline"
          >
            View more
          </Link>
        )}
      </article>
    </>
  );
};

export default Home;
Home.getLayout = (page: React.ReactElement) => {
  return <Layout>{page}</Layout>;
};

interface MessageBoxProps {
  left: boolean;
  content: string;
}
