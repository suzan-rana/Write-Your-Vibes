import React, { SetStateAction, useEffect, useRef, useState } from "react";
import Navbar from "~/components/ui/Navbar";
import { NextPageWithLayout } from "./_app";
import Input from "~/components/ui/Input";
import TextArea from "~/components/ui/TextArea";
import Button from "~/components/ui/Button";
import Layout from "~/components/ui/Layout";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  CreateBlogType,
  CreateNewBlogSchema,
} from "~/common/validation/blog-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "~/lib/utils";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Modal from "~/components/ui/Modal";
import ImageContainer from "~/components/ui/ImageContainer";
import Image from "next/image";
import Icons from "~/components/ui/Icon";
import { AnimatePresence } from "framer-motion";

type Props = {};

const CreateBlogsPage: NextPageWithLayout = (props: Props) => {
  // react hook form
  const { handleSubmit, register, getValues } = useForm<CreateBlogType>({
    resolver: zodResolver(CreateNewBlogSchema.partial()),
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<CreateBlogType> = (data) => {
    if (data.title === "Untitled post here") {
      toast.info("Please add a title");
      return;
    }
    if (data.subtitle === "Explain your viewpoint in 10 words") {
      toast.info("Please add a subtitle.");
      return;
    }
    mutate({
      ...data,
    });
    console.log("SENT", { data });
  };

  // trpc
  const { mutate, isLoading: isCreating } = api.blog.createNewBlog.useMutation({
    async onSuccess(data, variables, context) {
      if (data.status === 201) {
        toast.success("Post Created successfully");
        await router.push(`/blog/${data.data.post.id}`);
      }
    },
    onError(error, variables, context) {
      toast.error(error.message);
    },
  });

  const createBlogRef = useRef<HTMLFormElement>(null);
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Tab") {
      console.log("TAB");
    }
  };
  const [openUploadImageModal, setOpenUploadImageModal] = useState(false);

  useEffect(() => {
    createBlogRef.current?.addEventListener("keydown", handleKeyPress);
    return () => {
      createBlogRef.current?.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  // upload image hook
  const uploadImage = useUploadImage();
  const handleCancel = () => {
    // if image url exists, revoke it to minimize memmory leak
    uploadImage.image &&
      uploadImage.imageUrl &&
      URL.revokeObjectURL(uploadImage.imageUrl);
    if (uploadImage.image) {
      uploadImage.setImage(null);
    }
    setOpenUploadImageModal(false);
  };

  const handleSaveImage = (event: any) => {
    event.stopPropagation();
    setOpenUploadImageModal(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto ml-2 mt-32 min-h-[80vh]  md:ml-2 md:mt-12  "
      ref={createBlogRef}
      style={{
        marginInline: "auto",
      }}
    >
      <section className="mb-4 flex items-center justify-center gap-4">
        <Input
          placeholder="YOUR TITLE HERE"
          defaultValue={"Untitled post here"}
          {...register("title")}
          className="border-none  border-transparent text-3xl font-bold outline-none outline-transparent ring-0 ring-transparent  focus:outline-none focus-visible:border-none focus-visible:outline-none focus-visible:ring-0  focus-visible:ring-offset-2"
        />
        <button
          onClick={() => setOpenUploadImageModal(true)}
          type="button"
          className="hidden min-w-[9rem] border-none bg-transparent text-white underline sm:block"
        >
          {uploadImage.imageUrl ? "Change" : "Add"} Image
        </button>
        <Button className="hidden min-w-[9rem] sm:block">Create post</Button>
      </section>
      <AnimatePresence mode="sync">
        {openUploadImageModal && (
          <Modal
            onSubmitClick={handleSaveImage}
            onCancel={handleCancel}
            title="Upload Blog Image"
            customBody={<UploadImage {...uploadImage} />}
            submitText="Save"
            cancelText={uploadImage.image ? "Remove and Close" : "Cancel"}
          />
        )}
      </AnimatePresence>
      <Input
        {...register("subtitle")}
        placeholder="Your subtitle here"
        defaultValue={"Explain your viewpoint in 10 words"}
        className="border-none  border-transparent text-lg text-gray-400 outline-none outline-transparent ring-0 ring-transparent  focus:outline-none focus-visible:border-none focus-visible:outline-none focus-visible:ring-0  focus-visible:ring-offset-2"
      />
      {uploadImage.imageUrl && (
        <figure
          className={cn(
            "relative my-6 ml-2 block h-[20rem] w-[30rem] cursor-pointer overflow-hidden  rounded-lg "
          )}
          onClick={() => setOpenUploadImageModal(true)}
        >
          {" "}
          <Image
            src={uploadImage.imageUrl as string}
            className="z-1"
            fill
            alt="Blog Image"
          />
        </figure>
      )}
      <TextArea
        {...register("body")}
        placeholder="YOUR TEXT HERE"
        className="min-h-[70vh]  "
        defaultValue={"Type here to write your post"}
      />
      {getValues("title") !== "Untitled post here" && (
        <Button
          disabled={getValues("title") === "Untitled post here" || isCreating}
          className={cn(
            "mb-20 ml-6 block text-center sm:hidden",
            (getValues("title") === "Untitled post here" || isCreating) &&
              "cursor-not-allowed"
          )}
        >
          Create post
        </Button>
      )}
    </form>
  );
};

export default CreateBlogsPage;
CreateBlogsPage.getLayout = (page: React.ReactElement) => {
  return <Layout>{page}</Layout>;
};

interface UploadImageProps {
  image: File | null | undefined;
  setImage: React.Dispatch<SetStateAction<File | null | undefined>>;
  handleUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
  imageUrl: string | null | undefined;
}

const useUploadImage = () => {
  const [image, setImage] = useState<File | null>();
  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.target.files?.length === 0 || e.target.files === null) return;
    if (e.target.files[0] !== null && e.target.files[0]) {
      setImage(() => e.target.files?.[0]);
    }
  };
  let imageUrl = image && URL.createObjectURL(image);
  const handleRemoveImage = () => {
    if (image && imageUrl) {
      URL.revokeObjectURL(imageUrl as string);
    }
    setImage(null);
  };
  return {
    image,
    setImage,
    handleUploadImage,
    handleRemoveImage,
    imageUrl,
  };
};
const UploadImage = ({
  image,
  setImage,
  handleUploadImage,
  handleRemoveImage,
  imageUrl,
}: UploadImageProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        onChange={handleUploadImage}
        name="image"
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/png, image/gif, image/jpeg, image/webp"
      />
      {image ? (
        <div className="relative">
          <Icons.close
            onClick={handleRemoveImage}
            className="absolute right-[-1rem] top-[-1rem] z-[1000] h-[2rem]  w-[2rem] cursor-pointer text-red-500"
          />

          <figure
            className={cn(
              "relative block h-[25rem] w-[35rem] cursor-pointer overflow-hidden  rounded-lg "
            )}
          >
            {" "}
            <Image
              src={imageUrl as string}
              className="z-1"
              fill
              alt="Blog Image"
            />
          </figure>
        </div>
      ) : (
        <>
          <p className="mb-2 text-center text-sm font-light">
            Recommended: 1/4
          </p>
          <div
            className="flex min-h-[20rem] min-w-[30rem] cursor-pointer items-center justify-center rounded-lg  opacity-50 "
            style={{
              background: "hsl(224 71% 4%)",
            }}
            onClick={(e) => {
              inputRef.current?.click();
              e.stopPropagation();
            }}
          >
            Upload{" "}
          </div>
        </>
      )}
    </>
  );
};
