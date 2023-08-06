import Image from "next/image";
import Link from "next/link";
import React, { ReactNode, SetStateAction, useState } from "react";
import AdminAreaLayout from "~/components/AdminAreaLayout";
import Pagination, { usePagination } from "~/components/ui/Pagination";
import { api } from "~/utils/api";
import { useDeleteBlog } from "../blog/[blogId]";
import Modal from "~/components/ui/Modal";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

type Props = {};

const AdminPage = (props: Props) => {
  const {
    currentPage,
    setCurrentPage,
    handleDecreasePage,
    handleIncreasePage,
  } = usePagination();
  const { data, isLoading, isFetching } = api.user.getAllUsers.useQuery({
    limit: 10,
    page: currentPage,
  });

  const [deleteUserModal, setDeleteUserModal] = useState(false);
  const handleDeleteButtonClick = () => {
    setDeleteUserModal((prev) => !prev);
  };

  const handleClose = () => {
    setDeleteUserModal(false);
    setSelectedUserId(null);
  };
  const { handleDeleteUser, isDeletingUser } = useDeleteUser(
    setDeleteUserModal,
    false
  );
  const [selectedUserId, setSelectedUserId] = useState<null | string>(null);
  if (isLoading || isFetching || !data) {
    return <></>;
  }
  if (!data.totalUserCount) {
    return <p>No users found.</p>;
  } 
  return (
    <div className="relative overflow-x-auto">
      <h1 className="pb-12 pl-2 text-2xl font-bold">All Users</h1>
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-transparent dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>

            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Total blog count
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
          {data.data.map((user) => (
            <tr
              key={user.id}
              className="border-b bg-white dark:border-gray-700 dark:bg-transparent"
            >
              <th
                scope="row"
                className="max-w-[200px] whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
              >
                {user.name}
              </th>

              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">{user._count.post}</td>
              <td className="px-6 py-4">
                <a
                  href={user.image}
                  onClick={(e) => {
                    if (!user.image) {
                      toast.info("User doesnot have a profile picture");
                      e.stopPropagation();
                      e.preventDefault();
                    }
                  }}
                  target="_blank"
                  className="cursor-pointer underline"
                >
                  View profile image
                </a>
              </td>
              <td className="px-6 py-4">
                <span
                  onClick={() => {
                    setSelectedUserId(user.id);
                    setDeleteUserModal(true);
                  }}
                  className="cursor-pointer font-medium text-red-400 hover:underline dark:text-red-400"
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
      {deleteUserModal && (
        <>
          <Modal
            onCancel={handleClose}
            onSubmitClick={() => {
              handleDeleteUser(selectedUserId);
              setSelectedUserId(null);
            }}
            title="Do you want to delete this user permanently?"
            subtitle="Are you absolutely sure that you want to delete this user. Deleting this post will mean you will never regain access to this post and will be lost permanently"
          />
        </>
      )}
    </div>
  );
};

export default AdminPage;
AdminPage.getLayout = (page: ReactNode) => {
  return <AdminAreaLayout>{page}</AdminAreaLayout>;
};

export const useDeleteUser = (
  setDeleteUserModal: React.Dispatch<SetStateAction<boolean>>,
  navigateToUserPage: boolean = true
) => {
  const router = useRouter();
  const queryClient = api.useContext();

  const { mutate, isLoading: isDeletingUser } =
    api.user.deleteUserByUserId.useMutation({
      async onSuccess(data, variables, context) {
        toast.success(data.message || "User DELETED SUCCESSFULLY.");
        setDeleteUserModal(false);
        await queryClient.user.invalidate();
        navigateToUserPage && (await router.push("/admin"));
      },
      onError(error, variables, context) {
        toast.error(error.message || "SOMETHING WENT WRONG DELETING THE user.");
      },
    });

  const handleDeleteUser = (id: string) => {
    mutate({
      id,
    });
  };
  return { handleDeleteUser, isDeletingUser };
};
