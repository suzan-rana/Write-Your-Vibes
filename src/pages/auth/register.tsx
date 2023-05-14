import React, {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  LegacyRef,
} from "react";
import { SubmitHandler, useForm, FieldError } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import {  InputElement, InputErrorMessage } from "./login";
import { api } from "~/utils/api";
import Button from "~/components/ui/Button";
import { toast } from "react-toastify";


export const RegisterFormSchema = z.object({
  name: z.string().min(3, { message: "Please enter your name" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must at least be of 8 characters" }),
});
type RegisterFormType = z.infer<typeof RegisterFormSchema>;

const RegisterPage = () => {
  // making a mutation
  const { mutate, isLoading: isRegistering } = api.auth.register.useMutation({
    onSuccess(data, variables, context) {
      toast.success('User created successfully.')
    },
    onError(error, variables, context) {
      toast.error(error.message)
    },
  });
  const router = useRouter();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormType>({ resolver: zodResolver(RegisterFormSchema) });

  const onSubmit: SubmitHandler<RegisterFormType> = (data) => {
    mutate({ ...data });
  };

  return (
    <div className="mx-auto w-[80%] py-6">
      <h1 className="text-center  text-2xl font-bold uppercase">Register</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto my-12 flex flex-col gap-6 sm:w-[100%] md:w-[60%] lg:w-[40%]"
      >
        <label className="flex flex-col gap-2">
          <span>Name</span>
          <InputElement error={errors.name} {...register("name")} />
          <InputErrorMessage error={errors.name} />
        </label>
        <label className="flex flex-col gap-2">
          <span>Email</span>
          <InputElement error={errors.email} {...register("email")} />
          <InputErrorMessage error={errors.email} />
        </label>
        <label className="flex flex-col gap-2">
          <span>Password</span>
          <InputElement
            error={errors.password}
            {...register("password")}
            type="password"
          />
          <InputErrorMessage error={errors.password} />
        </label>
        <Button type="submit" disabled={isRegistering}>
          Register
        </Button>
        <Button
          type="button"
          variant={'ghost'}
          onClick={() => router.push("/auth/login")}
        >
          Login
        </Button>
      </form>
    </div>
  );
};

export default RegisterPage;
