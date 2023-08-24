import React, { useState } from "react";
import { toast } from "react-toastify";
import Button from "~/components/ui/Button";
import Card from "~/components/ui/Card";
import Input from "~/components/ui/Input";
import Layout from "~/components/ui/Layout";
import { api } from "~/utils/api";

type Props = {};

const SearchPage = (props: Props) => {
  const [searchText, setSearchText] = useState("");
  const searchBlog = api.blog.searchBlog.useMutation();
  const handleSearch = () => {
    if(!searchText && searchBlog?.data?.length === 0) {
        return toast.error('Please enter a title to search for')
    }
    searchBlog.mutate({
        search_text: searchText
    })
  };    
  return (
    <main>
      <h1 className="pb-6 text-center text-3xl font-bold">
        Search for your favorite blogs
      </h1>
      <div className="mx-auto flex w-[90%] gap-3">
        <Input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="py-6"
          placeholder="Search by title or subtitle"
        />
        <Button onClick={handleSearch} type="button">Search</Button>
      </div>
      <div className="my-6 flex w-[90%] mx-auto flex-col flex-wrap  gap-10 gap-y-12 md:flex-row">
        <>
          {searchBlog.data?.length === 0 ? (
            <p className="mx-auto my-20 text-center">
              Looks like there are no blog available at the moment.
            </p>
          ) : (
            searchBlog?.data?.map((post, index) => (
              <Card
                isLoading={searchBlog.isLoading}
                key={post?.id || index}
                id={post?.id}
                imageSrc={post?.image}
                createdAt={post?.createdAt}
                title={post?.title}
                subtitle={post?.subtitle}
                count={post?._count}
              />
            ))
          )}
        </>
      </div>
    </main>
  );
};

export default SearchPage;
SearchPage.getLayout = (page: React.ReactNode) => {
  return <Layout>{page}</Layout>;
};
