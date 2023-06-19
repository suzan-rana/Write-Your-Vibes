import React, {
  SetStateAction,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
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
import { uploadImageToS3 } from "~/lib/uploadImageToS3";
import { CategoryEnum } from "~/utils/category";
import { uploadImageToFirebase } from "~/common/firebase/uploadImage";

type Props = {};

const CreateBlogsPage: NextPageWithLayout = (props: Props) => {
  const id = useId();
  // react hook form
  const { handleSubmit, register, getValues } = useForm<CreateBlogType>({
    resolver: zodResolver(CreateNewBlogSchema.partial()),
  });

  const router = useRouter();

  // trpc
  const { mutate, isLoading: isCreating } = api.blog.createNewBlog.useMutation({
    async onSuccess(data, variables, context) {
      if (data.status === 201) {
        toast.dismiss("LOADING");
        await new Promise((res) => setTimeout(res, 500));
        toast.success("Post Created successfully");
        await router.push(`/blog/${data.data.post.id}`);
      }
    },
    onError(error, variables, context) {
      toast.dismiss("LOADING");
      new Promise((res) => setTimeout(res, 500));
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

  // get s3 presigned url
  // const { mutateAsync: getPreSignedUrl } =
  //   api.image.getPreSignedUrl.useMutation();

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

  // @ts-ignore
  const handleSaveImage = (event) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    event.stopPropagation();
    setOpenUploadImageModal(false);
  };

  const onSubmit: SubmitHandler<CreateBlogType> = async (data) => {
    if (data.title === "") {
      toast.error("Please add a title");
      return;
    }
    if (data.subtitle === "") {
      toast.error("Please add a subtitle.");
      return;
    }
    if (!data.body) {
      toast.error("Please add something to your body.");
      return;
    }
    if (data.title.length >= 50) {
      toast.error("Please add a title that is less than 50 characters.");
      return;
    }
    toast.loading("Creating new blog...", {
      toastId: "LOADING",
    });
    if (uploadImage.image) {
      /*
      WAS USING S3 PRESIGNED URL, BUT NOW IS USING FIREBASE TO STORE IMAGES
      await getPreSignedUrl({
        fileType: uploadImage.image.type,
      }).then(async (response) => {
        const { uploadUrl, key } = response.data;
        await uploadImageToS3(uploadUrl.url, key, uploadImage.image as File, uploadUrl.fields);
        mutate({
          ...data,
          image: uploadUrl.url.split("?")[0]?.toString() || null,
        });
      });

*/
      const imagePath = `${
        uploadImage.image.name
      }-${id}-${Date.now()}-${Math.ceil(Math.random() * 100)}`;
      const dbImagePath = await uploadImageToFirebase(
        uploadImage.image,
        imagePath
      );
      mutate({
        ...data,
        image: dbImagePath || null,
      });
    } else {
      toast.error("Please upload an image.");
    }
  };

  return (
    <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onSubmit={handleSubmit(onSubmit)}
      className="mt-26 mx-auto ml-2 min-h-[80vh]   md:ml-2 md:mt-12  "
      ref={createBlogRef}
      style={{
        marginInline: "auto",
      }}
    >
      <select
        className={`mb-4 rounded-md border border-slate-800 bg-gray-950 px-3 py-2 shadow-sm focus:outline-blue-400 ${
          false ? "border-[1px]  border-red-500 focus:outline-red-500" : ""
        }`}
        {...register("category")}
      >
        {Object.keys(CategoryEnum).map((category) => (
          <option
            key={category}
            value={CategoryEnum[category as keyof typeof CategoryEnum]}
          >
            {CategoryEnum[category as keyof typeof CategoryEnum]}
          </option>
        ))}
      </select>
      <section className="mb-4 flex items-center justify-center gap-4">
        <Input
          tabIndex={1}
          placeholder="YOUR TITLE HERE"
          // defaultValue={"Untitled post here"}
          {...register("title")}
          className="border-none  border-transparent text-3xl font-bold outline-none outline-transparent ring-0 ring-transparent  focus:outline-none focus-visible:border-none focus-visible:outline-none focus-visible:ring-0  focus-visible:ring-offset-2"
        />
        <button
          tabIndex={4}
          onClick={() => setOpenUploadImageModal(true)}
          type="button"
          className="hidden min-w-[9rem] border-none bg-transparent text-white underline sm:block"
        >
          {uploadImage.imageUrl ? "Change" : "Add"} Image
        </button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
          }}
          type="submit"
          tabIndex={4}
          className="hidden min-w-[9rem] sm:block"
        >
          Create post
        </Button>
      </section>
      <AnimatePresence mode="sync">
        {openUploadImageModal && (
          <Modal
            onSubmitClick={handleSaveImage}
            onCancel={handleCancel}
            title="Upload Blog Image"
            customBody={<UploadImage {...uploadImage} />}
            submitText="Save"
            cancelText={uploadImage.image ? "Remove" : "Cancel"}
          />
        )}
      </AnimatePresence>
      <Input
        tabIndex={2}
        {...register("subtitle")}
        placeholder="Explain your viewpoint in 10 words"
        // defaultValue={"Explain your viewpoint in 10 words"}
        className="border-none  border-transparent text-lg text-gray-400 outline-none outline-transparent ring-0 ring-transparent  focus:outline-none focus-visible:border-none focus-visible:outline-none focus-visible:ring-0  focus-visible:ring-offset-2"
      />
      {uploadImage.imageUrl && (
        <section
          className={cn(
            "relative my-6 block min-h-[10rem] min-w-[10rem] cursor-pointer  overflow-hidden rounded-lg md:ml-2 md:h-[20rem] md:w-[30rem]"
          )}
          onClick={() => setOpenUploadImageModal(true)}
        >
          {" "}
          <Image
            src={uploadImage.imageUrl}
            className="absolute block max-w-[100%]"
            fill
            alt="Blog Image"
          />
        </section>
      )}

      <TextArea
        tabIndex={3}
        {...register("body")}
        placeholder="Type here to write your post"
        className="min-h-[70vh]  "
        // defaultValue={"Type here to write your post"}
      />
      <div className="my-20 flex items-center gap-4">
        <button
          tabIndex={4}
          onClick={() => setOpenUploadImageModal(true)}
          type="button"
          className="rounded-md border-[2px] border-slate-900  bg-transparent px-3 py-2 text-base text-white sm:hidden sm:min-w-[9rem] sm:py-3 sm:text-lg"
        >
          {uploadImage.imageUrl ? "Change" : "Add"} Image
        </button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleSubmit(onSubmit);
          }}
          type="submit"
          className={cn("block text-center sm:hidden")}
        >
          Create post
        </Button>
      </div>
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
  showRecommendedText?: boolean;
  bg?: string;
  circular?: boolean;
}

export const useUploadImage = () => {
  const [image, setImage] = useState<File | null>();
  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();

    if (
      e.target.files?.length === 0 ||
      e.target.files === null ||
      e.target.files[0] === null
    )
      return;
    // restrict image
    // @ts-ignore
    if (e.target.files[0]?.size >= 200000) {
      toast.info("Image cannot be more than 500KB");
      return;
    }
    if (e.target.files[0]) {
      setImage(() => e.target.files?.[0]);
    }
  };
  const imageUrl = image && URL.createObjectURL(image);
  const handleRemoveImage = () => {
    if (image && imageUrl) {
      URL.revokeObjectURL(imageUrl);
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
export const UploadImage = ({
  image,
  handleUploadImage,
  handleRemoveImage,
  imageUrl,
  showRecommendedText = true,
  bg,
  circular = false,
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
              "relative block h-auto min-h-[15rem] w-[100%] cursor-pointer overflow-auto rounded-lg md:h-[25rem]  md:max-w-[32rem] "
            )}
          >
            <Image
              src={imageUrl as string}
              className="inline-block max-w-[100%] "
              fill
              alt="Blog Image"
            />
          </figure>
        </div>
      ) : (
        <>
          {showRecommendedText && (
            <p className="mb-2 text-center text-sm font-light">
              Recommended: 1/4
            </p>
          )}
          <div
            className={cn(
              "flex min-h-[10rem] cursor-pointer items-center justify-center rounded-lg opacity-50 sm:min-h-[20rem]  sm:min-w-[30rem] ",
              circular && "rounded-full"
            )}
            style={{
              background: bg ? bg : "hsl(224 71% 4%)",
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
