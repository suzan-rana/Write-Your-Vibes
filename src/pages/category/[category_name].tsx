"use client";
import React, { useState } from "react";
import { api } from "~/utils/api";
import { CategoryEnum } from "~/utils/category";
import Layout from "~/components/ui/Layout";
import { useRouter } from "next/router";
import Link from "next/link";
import Card from "~/components/ui/Card";
import Pagination, { usePagination } from "~/components/ui/Pagination";
import SkeletonCard from "~/components/ui/Skeleton/SkeletonCard";

type Props = {};

const PostByCategory = (props: Props) => {
  const { query } = useRouter();
  const {
    currentPage,
    setCurrentPage,
    handleDecreasePage,
    handleIncreasePage,
  } = usePagination();
  const { data, isLoading, isFetching } = api.blog.getBlogsByCategory.useQuery(
    {
      category_name:
        (query.category_name as keyof typeof CategoryEnum) ||
        "SCIENCE_AND_TECH",
      limit: 10,
      page: currentPage,
    },
    {
      enabled: !!query.category_name,
      keepPreviousData: true,
    }
  );

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
      {data?.data.length !== 0 && (
        <article className="my-16 md:mx-auto md:w-[85%]">
          <h1 className="pb-6 text-xl font-bold md:text-2xl">
            All about{" "}
            <span className="text-red-400">{query.category_name} !</span>
          </h1>
          <section className="flex flex-wrap  gap-8">
            {data?.data.map((post) => (
              <Link key={post.id} className="grow" href={`/blog/${post.id}`}>
                <Card
                  id={post.id}
                  count={post._count}
                  createdAt={post.createdAt}
                  subtitle={post.subtitle}
                  title={post.title}
                  imageSrc={post.image}
                />
              </Link>
            ))}
          </section>
          <Pagination
            handleIncreasePage={handleIncreasePage}
            handleDecreasePage={handleDecreasePage}
            totalPages={data?.totalPages as number}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </article>
      )}
    </>
  );
};

export default PostByCategory;
PostByCategory.getLayout = (page: React.ReactElement) => {
  return <Layout>{page}</Layout>;
};
