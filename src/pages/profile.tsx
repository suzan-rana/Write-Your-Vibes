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
import SkeletonCard from "~/components/ui/Skeleton/SkeletonCard";
import Skeleton from "react-loading-skeleton";

const ProfilePage: NextPageWithLayout = () => {
  const {
    data: user,
    isLoading,
    isFetching,
  } = api.user.getPersonalDetails.useQuery();
  if(isLoading || isFetching) {
    return null
  }
  return (
    <>
      <section className="flex flex-col lg:flex-row  items-center  gap-12 pb-6 ">
        {isLoading || isFetching ? (
          <Skeleton
            baseColor="#202020"
            circle
            highlightColor="#444"
            containerClassName="flex-1"
            className="mb-2 h-[12rem] w-[12rem] grow "
            count={3}
          />
        ) : (
          <ImageContainer
            gender={user?.gender as "Male" | "Female"}
            image={user?.image || ""}
            className="min-h-[15rem] w-[15rem] max-w-[100%] overflow-hidden rounded-full"
          />
        )}
        {isLoading || isFetching ? (
          <Skeleton
            baseColor="#202020"
            highlightColor="#444"
            containerClassName="flex-1"
            className="mb-2 h-[12rem] w-full grow "
            count={3}
          />
        ) : (
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold text-gray-200">{user?.name}</h1>
            <p className="my-2">{user?.email}</p>
            <p>{user?.biography}</p>
            <Link href={"/updateprofile"}>
          <Button>Update Profile</Button>
        </Link>
          </div>
        )}
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
  if (isLoading || isFetching) {
    return (
      <div className="grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2">
        <p>Loading...</p>
        {/* <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard /> */}
      </div>
    );
  }
  return (
    <section className="my-20">
      {isLoading || isFetching ? (
        <p>Loading...</p>
      ) : (
        <>
         
          {blogCollection?.data.length === 0 ? (
            <NoBlog />
          ) : (
            <>
             <h2 className="text-center text-4xl font-bold capitalize">
            Top Posts
          </h2>
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
        <Button onClick={async () => await router.push("/create")}>
          Create Now!
        </Button>
      </div>
    </div>
  );
};
