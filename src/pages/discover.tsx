import React, { useState } from "react";
import Layout from "~/components/ui/Layout";
import { NextPageWithLayout } from "./_app";
import Input from "~/components/ui/Input";
import Button from "~/components/ui/Button";
import { api } from "~/utils/api";
import { CategoryEnum } from "~/utils/category";
import Card from "~/components/ui/Card";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const SearchBlogSchema = z.object({
  tags: z.string().nullable(),
  category_name: z
    .nativeEnum(CategoryEnum)
    .or(z.string().refine((value) => value === "All")),
});
type SearchBlogType = z.infer<typeof SearchBlogSchema>;

const DiscoverPage: NextPageWithLayout = () => {
  const { handleSubmit, register, getValues } = useForm<SearchBlogType>({
    resolver: zodResolver(SearchBlogSchema),
  });

  // for refetching
  const search = api.useContext().search;

  const [searchData, setSearchData] = useState<any[]>([]);

  const { isLoading, refetch } = api.search.searchByCategoryAndTags.useQuery(
    {
      category_name: CategoryEnum.FRONTEND_DEVELOPMENT,
      tags: null,
    },
    {
      onSuccess(data) {
        setSearchData(data);
      },
    }
  );
  if (isLoading) {
    return <p>Loading...</p>;
  }

  const onSubmit: SubmitHandler<SearchBlogType> = async (data) => {
    search.searchByCategoryAndTags
      .fetch(
        {
          category_name: data.category_name,
          tags: data?.tags ? data.tags.split(" ") : null,
        },
        {}
      )
      .then((data) => {
        setSearchData(data);
      });
  };
  return (
  <section className="pb-20 md:w-[85%] md:mx-auto">
      <h1 className="text-center text-3xl font-semibold capitalize">
        Search and Explore our top blogs by top talent{" "}
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="my-12 flex flex-col md:items-center gap-4 sm:flex-row"
      >
        <select
          className={`rounded-md border border-slate-800 bg-gray-950 px-4 py-3 shadow-sm focus:outline-blue-400 ${
            false ? "border-[1px]  border-red-500 focus:outline-red-500" : ""
          }`}
          {...register("category_name")}
        >
          <option value={"All"}>All</option>
          {Object.keys(CategoryEnum).map((category) => (
            <option value={CategoryEnum[category as keyof typeof CategoryEnum]}>
              {CategoryEnum[category as keyof typeof CategoryEnum]}
            </option>
          ))}
        </select>
        <Input
          {...register("tags")}
          placeholder="What do you wish to read?"
          className="py-6 pl-6"
        />
        <Button>Search</Button>
      </form>
      <main className="mx-auto flex flex-col md:flex-row flex-wrap gap-12 justify-between">
        {searchData?.map((post) => (
          <Link href={`/blog/${post.id}`} key={post.id}>
            <Card
              title={post.title}
              subtitle={post.subtitle}
              createdAt={post.createdAt}
              imageSrc={post.image}
            ></Card>
          </Link>
        ))}
      </main>
    </section>
  );
};

export default DiscoverPage;
DiscoverPage.getLayout = (page: React.ReactElement) => {
  return <Layout>{page}</Layout>;
};
