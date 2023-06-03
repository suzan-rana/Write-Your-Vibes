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
import { InputElement, InputErrorMessage, PasswordInputElement } from "./login";
import { api } from "~/utils/api";
import Button from "~/components/ui/Button";
import { toast } from "react-toastify";

export const RegisterFormSchema = z.object({
  name: z.string().min(3, { message: "Please enter your name" }),
  email: z.string().email(),
  gender: z.enum(["Male", "Female"]),
  password: z
    .string()
    .min(8, { message: "Password must at least be of 8 characters" }),
});
type RegisterFormType = z.infer<typeof RegisterFormSchema>;

const RegisterPage = () => {
  const router = useRouter();

  // making a mutation
  const { mutate, isLoading: isRegistering } = api.auth.register.useMutation({
    async onSuccess(data, variables, context) {
      toast.success("User created successfully.");
      await router.push("/auth/login");
    },
    onError(error, variables, context) {
      toast.error(error.message);
    },
  });
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
      <h1 className="mt-12 text-center text-2xl font-bold uppercase">
        Register
      </h1>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto my-8 flex flex-col gap-6 sm:w-[100%] md:w-[60%] lg:w-[40%]"
      >
        <label className="flex flex-col gap-2">
          <span className="text-sm md:text-base">Name</span>
          <InputElement error={errors.name} {...register("name")} />
          <InputErrorMessage error={errors.name} />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm md:text-base">Email</span>
          <InputElement error={errors.email} {...register("email")} />
          <InputErrorMessage error={errors.email} />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm md:text-base">Gender</span>
          <select
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
          <span className="text-sm md:text-base">Password</span>
          <PasswordInputElement
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
          variant={"ghost"}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={async () => await router.push("/auth/login")}
        >
          Login
        </Button>
      </form>
    </div>
  );
};

export default RegisterPage;
