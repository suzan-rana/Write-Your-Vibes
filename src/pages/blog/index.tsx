import React from "react";
import Navbar from "~/components/ui/Navbar";
import { NextPageWithLayout, p } from "../_app";
import Layout from "~/components/ui/Layout";
import Card from "~/components/ui/Card";
import Divider from "~/components/ui/Divider";
import { useRouter } from "next/router";
import Link from "next/link";
import { api } from "~/utils/api";

type Props = {};

const BlogPage: NextPageWithLayout = (props: Props) => {
  const router = useRouter();
  const { data, isLoading, isFetching } = api.blog.getAllBlogs.useQuery();
  return (
    <section className="md:w-[85%] md:mx-auto">
      <h1 className="mb-4 text-5xl font-bold">Blog</h1>
      <p>A blog built using using t3 Stack, TypeScript, Tailwindcss and TRPC</p>
      <Divider />
      <div className="my-6 flex flex-col flex-wrap  gap-8 gap-y-12 md:flex-row">
        {isLoading || isFetching ? null : (
          <>
            {data?.data.length === 0 ? (
              <p className="text-center my-20 mx-auto" >Looks like there are no blog available at the moment.</p>
            ) : (
              data?.data.map((post, index) => (
                <Link href={`/blog/${post.id}`} key={index}>
                  <Card
                  imageSrc={post.image}
                    createdAt={post.createdAt}
                    title={post.title}
                    subtitle={post.subtitle}
                  />
                </Link>
              ))
            )}
          </>
        )}
      </div>
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
