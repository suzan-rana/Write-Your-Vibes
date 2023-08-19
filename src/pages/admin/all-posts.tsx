import Image from "next/image";
import Link from "next/link";
import React, { ReactNode, useState } from "react";
import AdminAreaLayout from "~/components/AdminAreaLayout";
import Pagination, { usePagination } from "~/components/ui/Pagination";
import { api } from "~/utils/api";
import { useDeleteBlog } from "../blog/[blogId]";
import Modal from "~/components/ui/Modal";

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

  const [deleteBlogModal, setDeleteBlogModal] = useState(false);
  const handleDeleteButtonClick = () => {
    setDeleteBlogModal((prev) => !prev);
  };

  const handleClose = () => {
    setDeleteBlogModal(false);
    setSelectedBlogId(null);
  };
  const { handleDeleteBlog, isDeletingBlog } = useDeleteBlog(
    setDeleteBlogModal,
    false
  );
  const [selectedBlogId, setSelectedBlogId] = useState<null | string>(null);
  if (isLoading || isFetching || !data) {
    return <></>;
  }
  if (!data.totalBlogCount) {
    return <p>No blogs found.</p>;
  }
  return (
    <div className="relative overflow-x-auto">
      <h1 className="pb-12 pl-2 text-2xl font-bold">All Posts</h1>
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-transparent dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Title
            </th>

            <th scope="col" className="px-6 py-3">
              Category
            </th>
            <th scope="col" className="px-6 py-3">
              Author Name
            </th>
            <th scope="col" className="px-6 py-3">
              Image
            </th>
            <th scope="col" className="px-6 py-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((post) => (
            <tr
              key={post.id}
              className="border-b bg-white dark:border-gray-700 dark:bg-transparent"
            >
              <th
                scope="row"
                className="max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                {post.title}
              </th>

              <td className="px-6 py-4">{post.category.category_name}</td>
              <td className="px-6 py-4">{post.user.name}</td>
              <td className="px-6 py-4">
                <a href={post.image} target="_blank" className="underline">
                  View image
                </a>
                {/* <Image alt=""  src={post.image} width={100} height={100} /> */}
              </td>
              <td className="px-6 py-4">
                <Link href={`/blog/${post.id}`} className="cursor-pointer font-medium text-green-400 hover:underline dark:text-green-400">
                  View
                </Link>
                <span
                  onClick={() => {
                    setSelectedBlogId(post.id);
                    setDeleteBlogModal(true);
                  }}
                  className="cursor-pointer pl-3 font-medium text-red-400 hover:underline dark:text-red-400"
                >
                  Delete
                </span>
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
      {deleteBlogModal && (
        <>
          <Modal
            onCancel={handleClose}
            onSubmitClick={() => {
              handleDeleteBlog(selectedBlogId);
              setSelectedBlogId(null);
            }}
            title="Do you want to delete this post?"
            subtitle="Are you absolutely sure that you want to delete this post. Deleting this post will mean you will never regain access to this post and will be lost permanently"
          />
        </>
      )}
    </div>
  );
};

export default AdminAllPostsPage;
AdminAllPostsPage.getLayout = (page: ReactNode) => {
  return <AdminAreaLayout>{page}</AdminAreaLayout>;
};
