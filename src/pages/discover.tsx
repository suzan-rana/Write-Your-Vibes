import React from "react";
import Layout from "~/components/ui/Layout";
import { NextPageWithLayout } from "./_app";
import Input from "~/components/ui/Input";
import Button from "~/components/ui/Button";


const DiscoverPage: NextPageWithLayout = () => {
  return (
    <section>
      <h1 className="text-center text-3xl font-semibold capitalize">
        Search and Explore our top blogs by top talent{" "}
      </h1>
      <div className="my-8 flex flex-col sm:flex-row items-center gap-4">
        <Input placeholder="What do you wish to read?" className="py-6 pl-6" />
        <Button>Search</Button>
      </div>
    </section>
  );
};

export default DiscoverPage;
DiscoverPage.getLayout = (page: React.ReactElement) => {
  return <Layout>{page}</Layout>;
};
