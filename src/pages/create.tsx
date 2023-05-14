import React, { useEffect, useRef } from "react";
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
    console.log('SENT', { data})
  };

  // trpc
  const { mutate, isLoading: isCreating } = api.blog.createNewBlog.useMutation({
   async onSuccess(data, variables, context) {
      if (data.status === 201) {
        toast.success("Post Created successfully");
      await  router.push(`/blog/${data.data.post.id}`);
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
  useEffect(() => {
    createBlogRef.current?.addEventListener("keydown", handleKeyPress);
    return () => {
      createBlogRef.current?.removeEventListener("keydown", handleKeyPress);
    };
  }, []);
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
        <Button className="hidden min-w-[9rem] sm:block">Create post</Button>
      </section>
      <Input
        {...register("subtitle")}
        placeholder="Your subtitle here"
        defaultValue={"Explain your viewpoint in 10 words"}
        className="border-none  border-transparent text-lg text-gray-400 outline-none outline-transparent ring-0 ring-transparent  focus:outline-none focus-visible:border-none focus-visible:outline-none focus-visible:ring-0  focus-visible:ring-offset-2"
      />
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
