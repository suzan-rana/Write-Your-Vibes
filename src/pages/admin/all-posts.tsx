import Link from "next/link";
import React, { ReactNode } from "react";
import AdminAreaLayout from "~/components/AdminAreaLayout";

type Props = {};

const AdminAllPostsPage = (props: Props) => {
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
              Author Name
            </th>
            <th scope="col" className="px-6 py-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b bg-white dark:border-gray-700 dark:bg-transparent">
            <th
              scope="row"
              className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
            >
              Apple MacBook Pro 17"
            </th>
            <td className="px-6 py-4">Silver</td>
            <td className="px-6 py-4">Laptop</td>
            <td className="px-6 py-4">
              <Link
                href="/admin/all-posts"
                className="font-medium text-red-400 hover:underline dark:text-red-400"
              >
                Delete
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AdminAllPostsPage;
AdminAllPostsPage.getLayout = (page: ReactNode) => {
  return <AdminAreaLayout>{page}</AdminAreaLayout>;
};
