import React, {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  LegacyRef,
  useState,
} from "react";
import { SubmitHandler, useForm, FieldError } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInResponse, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Button from "~/components/ui/Button";
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import { delay } from "~/utils/delay";

const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must at least be of 8 characters" }),
});
type LoginFormType = z.infer<typeof LoginFormSchema>;

const LoginPage = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({ resolver: zodResolver(LoginFormSchema) });

  const onSubmit: SubmitHandler<LoginFormType> = async (data) => {
    toast.loading("Logging in...", {
      toastId: "LOADING",
    });
    await signIn("credentials", {
      ...data,
      redirect: false,
    }).then(async (response: SignInResponse | undefined) => {
      if (response === undefined) return;
      const { error, ok } = response;
      toast.dismiss("LOADING");
      await delay();
      if (ok) {
        toast.success("Logged in successfully");
        await router.push("/");
      }
      if (error) {
        toast.error(error || "Invalid credentials.");
      }
    });
  };
  // @typescript-eslint/no-misused-promises
  return (
    <div className="mx-auto w-[80%] py-6">
      <h1 className="mt-16 text-center text-2xl font-bold uppercase">Login</h1>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto my-12 flex flex-col gap-6 sm:w-[100%] md:w-[60%] lg:w-[40%]"
      >
        <label className="flex flex-col gap-2">
          <span className="text-sm md:text-base">Email</span>
          <InputElement error={errors.email} {...register("email")} />
          <InputErrorMessage error={errors.email} />
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
        <Button type="submit">Login</Button>
        <Button
          type="button"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={() => router.push("/auth/register")}
          variant={"ghost"}
        >
          Register
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: FieldError;
}
export const InputElement = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, ...restProps }, ref) => {
    return (
      <input
        ref={ref}
        className={`rounded-md border border-slate-800 bg-gray-950 px-3 py-2 text-sm shadow-sm focus:outline-blue-400 md:text-base ${
          error ? "border-[1px] border-red-500 focus:outline-red-500" : ""
        }`}
        {...restProps}
      />
    );
  }
);

export const PasswordInputElement = React.forwardRef<
  HTMLInputElement,
  InputProps
>(({ error, ...restProps }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div
      className={`flex items-center justify-between  rounded-md border border-slate-800 bg-gray-950 px-3 py-2 text-sm shadow-sm focus:outline-blue-400 md:text-base ${
        error ? "border-[1px] border-red-500 focus:outline-red-500" : ""
      }`}
    >
      <input
        ref={ref}
        className="grow border-none bg-transparent outline-none"
        {...restProps}
        type={showPassword ? "text" : "password"}
      />
      {showPassword ? (
        <IoEyeSharp
          className="h-4 w-4 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setShowPassword((prev) => !prev);
          }}
        />
      ) : (
        <FaEyeSlash
          className="h-4 w-4 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setShowPassword((prev) => !prev);
          }}
        />
      )}
    </div>
  );
});
PasswordInputElement.displayName = "PasswordInputElement";

export interface InputErrorMessageProps {
  error?: FieldError;
}
export const InputErrorMessage = ({ error }: InputErrorMessageProps) => {
  return (
    <>
      {error && (
        <p className="text-sm font-medium text-red-500 md:text-base">
          {error.message}
        </p>
      )}
    </>
  );
};
InputElement.displayName = "InputElement";
