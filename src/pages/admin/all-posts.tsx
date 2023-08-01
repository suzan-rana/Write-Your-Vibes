import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";
import AdminAreaLayout from "~/components/AdminAreaLayout";
import Pagination, { usePagination } from "~/components/ui/Pagination";
import { api } from "~/utils/api";

type Props = {};

const AdminAllPostsPage = (props: Props) => {
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
  if (isLoading || isFetching || !data) {
    return <></>;
  }
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-transparent dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Title
            </th>
            <th scope="col" className="px-6 py-3">
              Image
            </th>
            <th scope="col" className="px-6 py-3">
              Category
            </th>
            <th scope="col" className="px-6 py-3">
              Author Name
            </th>
            <th scope="col" className="px-6 py-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((post) => (
            <tr key={post.id} className="border-b bg-white dark:border-gray-700 dark:bg-transparent">
            <th
              scope="row"
              className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
            >
             {post.title}
            </th>
            <td className="px-6 py-4">
              <Image alt=""  src={post.image} width={100} height={100} />
            </td>
            <td className="px-6 py-4">{post.category.category_name}</td>
            <td className="px-6 py-4">{post.user.name}</td>
            <td className="px-6 py-4">
              <Link
                href="/admin/all-posts"
                className="font-medium text-red-400 hover:underline dark:text-red-400"
              >
                Delete
              </Link>
            </td>
          </tr>
          ))}
        </tbody>
      </table>
      {isLoading || isFetching ? null : (
        <Pagination
          handleIncreasePage={handleIncreasePage}
          handleDecreasePage={handleDecreasePage}
          totalPages={data?.totalPages as number}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default AdminAllPostsPage;
AdminAllPostsPage.getLayout = (page: ReactNode) => {
  return <AdminAreaLayout>{page}</AdminAreaLayout>;
};
