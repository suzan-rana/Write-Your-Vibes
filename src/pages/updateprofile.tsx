"use client";
import { useSession } from "next-auth/react";
import React from "react";
import {
  UpdateProfileSchema,
  UpdateProfileType,
} from "~/common/validation/user-validation";
import Layout from "~/components/ui/Layout";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "~/components/ui/Input";
import { InputElement, InputErrorMessage } from "./auth/login";
import ImageContainer from "~/components/ui/ImageContainer";
import { UploadImage, useUploadImage } from "./create";
import Button from "~/components/ui/Button";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { uploadImageToS3 } from "~/lib/uploadImageToS3";
import { toast } from "react-toastify";

type Props = {};

const UpdateProfilePage = (props: Props) => {
  const router = useRouter();
  const { data: user } = api.user.getPersonalDetails.useQuery();

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    getValues,
  } = useForm<UpdateProfileType>({
    resolver: zodResolver(UpdateProfileSchema),
  });

  const { mutate, isLoading: isUpdatingProfile } =
    api.user.updateProfile.useMutation({
      async onSuccess(data) {
        toast.success(data?.message);
        await router.push("/profile");
      },
      onError(error) {
        toast.error(error.message);
      },
    });

  // get s3 presigned url
  const { mutateAsync: getPreSignedUrl } =
    api.image.getPreSignedUrl.useMutation();
  const uploadImage = useUploadImage();

  // save/update profile
  const onSubmit: SubmitHandler<UpdateProfileType> = async (data) => {
    if (uploadImage.image) {
      await getPreSignedUrl({
        fileType: uploadImage.image.type,
      }).then(async (response) => {
        const { uploadUrl, key } = response.data;
        await uploadImageToS3(uploadUrl, key, uploadImage.image as File);
        mutate({
          ...data,
          image: uploadUrl.split("?")[0]?.toString() || null,
        });
      });
    } else {
      mutate({
        ...data,
        image: user?.image || null,
      });
    }
  };
  return (
    <section className="min-h-[200vh]">
      <h1 className="text-3xl font-bold">
        Hello, <span className="text-red-400">{user?.name}</span>! Have fun
        updating your profile 😊
      </h1>
      <div className="flex flex-col-reverse md:items-start md:gap-8">
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={handleSubmit(onSubmit)}
          className="my-12 flex w-[100%] flex-col gap-6 md:w-[60%]"
        >
          <label className="flex flex-col gap-2">
            <span>Name</span>
            <InputElement
              defaultValue={user?.name || ""}
              error={errors.name}
              {...register("name")}
            />
            <InputErrorMessage error={errors.name} />
          </label>
          <label className="flex flex-col gap-2">
            <span>Gender</span>
            <select
              defaultValue={user?.gender}
              className={`rounded-md border border-slate-800 bg-gray-950 px-3 py-2 shadow-sm focus:outline-blue-400 ${
                false ? "border-[1px] border-red-500 focus:outline-red-500" : ""
              }`}
              {...register("gender")}
            >
              <option value={"Male"}>Male</option>
              <option value="Female">Female</option>
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span>Biography</span>
            <textarea
              defaultValue={user?.biography}
              className={`min-h-[10rem] rounded-md border border-slate-800 bg-gray-950 px-3 py-2 shadow-sm focus:outline-blue-400 ${
                false ? "border-[1px] border-red-500 focus:outline-red-500" : ""
              }`}
              {...register("biography")}
            ></textarea>
          </label>
          <input type="hidden" {...register("image")} className="hidden" />
          <h3 className="my-6 text-2xl text-slate-400">
            <div className="rounded-md border border-slate-800">
              <UploadImage
              circular={true}
                bg="rgb(3, 7, 18)"
                showRecommendedText={false}
                {...uploadImage}
              />
            </div>
          </h3>
          <div className="flex items-center justify-center gap-2">
            <Button
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={async (e) => {
                e.preventDefault();
                await router.push("/profile");
              }}
              className="grow"
            >
              Cancel
            </Button>
            <Button type="submit" className="grow bg-green-500">
              Update
            </Button>
          </div>
        </form>
        {user?.image && (
          <ImageContainer
            gender={user?.gender as "Male" | "Female"}
            image={user?.image || ""}
            className="mx-auto my-12 mt-20 min-h-[15rem] w-[15rem] max-w-[100%] overflow-hidden rounded-full"
          />
        )}
      </div>
    </section>
  );
};

export default UpdateProfilePage;
UpdateProfilePage.getLayout = (page: React.ReactElement) => {
  return <Layout>{page}</Layout>;
};
