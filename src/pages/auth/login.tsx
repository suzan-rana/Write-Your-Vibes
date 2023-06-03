import React, {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  LegacyRef,
} from "react";
import { SubmitHandler, useForm, FieldError } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInResponse, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Button from "~/components/ui/Button";

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
    await signIn("credentials", {
      ...data,
      redirect: false,
    }).then(async (response: SignInResponse | undefined) => {
      if (response === undefined) return;
      const { error, ok } = response;
      if (ok) {
        toast.success("Logged in successfully");
        await router.push("/");
      }
      if (error) {
        toast.error(error);
      }
    });
  };
  // @typescript-eslint/no-misused-promises
  return (
    <div className="mx-auto w-[80%] py-6">
      <h1 className="text-center mt-16 text-2xl font-bold uppercase">Login</h1>
      <form
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto my-12 flex flex-col gap-6 sm:w-[100%] md:w-[60%] lg:w-[40%]"
      >
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
        className={`rounded-md border text-sm md:text-lg border-slate-800 bg-gray-950 px-3 py-2 shadow-sm focus:outline-blue-400 ${
          error ? "border-[1px] border-red-500 focus:outline-red-500" : ''
        }`}
        {...restProps}
      />
    );
  }
);

export interface InputErrorMessageProps {
  error?: FieldError;
}
export const InputErrorMessage = ({ error }: InputErrorMessageProps) => {
  return (
    <>{error && <p className="font-medium text-sm md:text-lg text-red-500">{error.message}</p>}</>
  );
};
InputElement.displayName = "InputElement";
