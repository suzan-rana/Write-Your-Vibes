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
import { uploadImageToS3 } from "~/lib/s3";
import { toast } from "react-toastify";

type Props = {};

const UpdateProfilePage = (props: Props) => {
  const router = useRouter();
  const { data: sessionData } = useSession();
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
      onSuccess(data) {
        toast.success(data?.message);
        router.push("/profile");
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
    console.log("UPLOADED IMAGE...", uploadImage);
    if (uploadImage.image) {
      await getPreSignedUrl({
        fileType: uploadImage.image.type,
      }).then(async (response) => {
        const { uploadUrl, key } = response.data;
        await uploadImageToS3(uploadUrl, key, uploadImage.image as File);
        mutate({
          ...data,
          image: uploadUrl,
        });
      });
    } else {
      mutate({
        ...data,
        image: sessionData?.user.image || null,
      });
    }
  };
  return (
    <section className="min-h-[200vh]">
      <h1 className="text-3xl font-bold">
        Hello, <span className="text-red-400">{sessionData?.user.name}</span>!
        Have fun updating your profile 😊
      </h1>
      <div className="flex items-start gap-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="my-12 flex flex-col gap-6 sm:w-[100%] md:w-[60%]"
        >
          <label className="flex flex-col gap-2">
            <span>Name</span>
            <InputElement
              defaultValue={sessionData?.user.name || ""}
              error={errors.name}
              {...register("name")}
            />
            <InputErrorMessage error={errors.name} />
          </label>
          <label className="flex flex-col gap-2">
            <span>Gender</span>
            <select
              defaultValue={sessionData?.user.gender}
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
              defaultValue={sessionData?.user.biography}
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
                bg="rgb(3, 7, 18)"
                showRecommendedText={false}
                {...uploadImage}
              />
            </div>
          </h3>
          <div className="flex items-center justify-center gap-2">
            <Button
              onClick={(e) => {
                e.preventDefault();
                router.push("/profile");
              }}
              className="grow"
            >
              Cancel updation
            </Button>
            <Button type="submit" className="grow bg-green-500">
              Save Profile
            </Button>
          </div>
        </form>
        {/* {sessionData?.user.image && (
          <ImageContainer
            gender={sessionData?.user.gender || "Male"}
            image={sessionData?.user.image || ""}
            className="mx-auto my-12 mt-20 min-h-[15rem] w-[15rem] max-w-[100%] overflow-hidden rounded-full"
          />
        )} */}
      </div>
    </section>
  );
};

export default UpdateProfilePage;
UpdateProfilePage.getLayout = (page: React.ReactElement) => {
  return <Layout>{page}</Layout>;
};
