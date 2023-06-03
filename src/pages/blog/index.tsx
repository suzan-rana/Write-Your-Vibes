import React from "react";
import Navbar from "~/components/ui/Navbar";
import { NextPageWithLayout, p } from "../_app";
import Layout from "~/components/ui/Layout";
import Card from "~/components/ui/Card";
import Divider from "~/components/ui/Divider";
import { useRouter } from "next/router";
import Link from "next/link";
import { api } from "~/utils/api";
import Pagination, { usePagination } from "~/components/ui/Pagination";

type Props = {};

const BlogPage: NextPageWithLayout = (props: Props) => {
  const router = useRouter();
  const {
    currentPage,
    setCurrentPage,
    handleDecreasePage,
    handleIncreasePage,
  } = usePagination();
  const { data, isLoading, isFetching } = api.blog.getAllBlogs.useQuery({
    limit: 10,
    page: currentPage,
  });
  if (isLoading || isFetching) {
    return <p className="py-6">Loading...</p>;
  }
  return (
    <section className="md:mx-auto md:w-[85%]">
      <h1 className="mb-4 text-5xl font-bold">Blog</h1>
      <p>A blog built using using t3 Stack, TypeScript, Tailwindcss and TRPC</p>
      <Divider />
      <div className="my-6 flex flex-col flex-wrap  gap-8 gap-y-12 md:flex-row">
        {isLoading || isFetching ? null : (
          <>
            {data?.data.length === 0 ? (
              <p className="mx-auto my-20 text-center">
                Looks like there are no blog available at the moment.
              </p>
            ) : (
              data?.data.map((post, index) => (
                <Link href={`/blog/${post.id}`} key={index}>
                  <Card
                    imageSrc={post.image}
                    createdAt={post.createdAt}
                    title={post.title}
                    subtitle={post.subtitle}
                    count={post._count}
                  />
                </Link>
              ))
            )}
          </>
        )}
      </div>
      <Pagination
        handleIncreasePage={handleIncreasePage}
        handleDecreasePage={handleDecreasePage}
        totalPages={data?.totalPages as number}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </section>
  );
};

const RenderBlogs = () => {
  return;
};

export default BlogPage;
BlogPage.getLayout = (page: React.ReactElement) => {
  return <Layout>{page}</Layout>;
};
