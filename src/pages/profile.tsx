import React from "react";
import Layout from "~/components/ui/Layout";
import { NextPageWithLayout, p } from "./_app";
import Button from "~/components/ui/Button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ImageContainer from "~/components/ui/ImageContainer";
import Link from "next/link";
import Card from "~/components/ui/Card";
import { api } from "~/utils/api";
import Footer from "~/components/Footer";
import RandomAvatar from "~/components/Avatar";
import Pagination, { usePagination } from "~/components/ui/Pagination";

const ProfilePage: NextPageWithLayout = () => {
  const { data: user } = api.user.getPersonalDetails.useQuery();
  return (
    <>
      <section className="flex flex-col items-center justify-center gap-12 pb-24 text-center">
        <ImageContainer
          gender={user?.gender as "Male" | "Female"}
          image={user?.image || ""}
          className="min-h-[15rem] w-[15rem] max-w-[100%] overflow-hidden rounded-full"
        />
        <div>
          <h1 className="text-3xl font-bold text-gray-200">{user?.name}</h1>
          <p className="my-2">{user?.email}</p>
          <p>{user?.biography}</p>
        </div>
        <Link href={"/updateprofile"}>
          <Button>Update Profile</Button>
        </Link>
      </section>
      <TopPosts />
    </>
  );
};

export default ProfilePage;
ProfilePage.getLayout = (page: React.ReactElement) => {
  return <Layout>{page}</Layout>;
};

const TopPosts = () => {
  const { data: sessionData } = useSession();
  const {
    currentPage,
    setCurrentPage,
    handleDecreasePage,
    handleIncreasePage,
  } = usePagination();
  const {
    data: blogCollection,
    isLoading,
    isFetching,
  } = api.blog.getBlogByUserId.useQuery(
    {
      userId: sessionData?.user.id ? sessionData?.user.id : "",
      limit: 10,
      page: currentPage,
    },
    {
      enabled: sessionData?.user.id !== undefined,
      refetchOnWindowFocus: false,
    }
  );
  return (
    <section className="my-20">
      {isLoading || isFetching ? (
        <p>Loading...</p>
      ) : (
        <>
          <h2 className="text-center text-4xl font-bold capitalize">
            Top Posts
          </h2>
          {blogCollection?.data.length === 0 ? (
            <NoBlog />
          ) : (
            <>
              <article className="my-6 mt-12 flex flex-col flex-wrap gap-8 gap-y-12  md:mx-auto md:w-[85%] md:flex-row">
                {blogCollection?.data.map((item, index) => (
                  <Link href={`/blog/${item.id}`} key={item.id}>
                    <Card count={item._count} {...item} imageSrc={item.image} />
                  </Link>
                ))}
              </article>
              <Pagination
                handleIncreasePage={handleIncreasePage}
                handleDecreasePage={handleDecreasePage}
                totalPages={blogCollection?.totalPages as number}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </>
          )}
        </>
      )}
    </section>
  );
};

const NoBlog = () => {
  const router = useRouter();
  return (
    <div className="flex h-[40vh] items-center justify-center">
      <div className="mx-auto text-center">
        <h1 className="mb-6">Looks like you have yet to create a blog.</h1>
        {/* // eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <Button onClick={async() => await router.push("/create")}>Create Now!</Button>
      </div>
    </div>
  );
};
