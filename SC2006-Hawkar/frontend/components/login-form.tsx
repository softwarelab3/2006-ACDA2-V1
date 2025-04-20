"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { login } from "@/app/lib/actions/auth-actions";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "./google-login-button";

const loginFormSchema = z.object({
  emailAddress: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      emailAddress: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof loginFormSchema>) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await login(data)
      if (result.redirectUrl) {
        router.push(result.redirectUrl)
      } else {
        router.push("/");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Invalid email or password"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md bg-white p-6">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold">Welcome Back!</h1>
          <p className="text-gray-600 pt-3">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-primary font-medium">
              Sign up
            </Link>
          </p>
        </div>

        <Form {...loginForm}>
          <form
            onSubmit={loginForm.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={loginForm.control}
              name="emailAddress"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                      className="bg-gray-200 py-6"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      className="bg-gray-200 border-0 py-6"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full bg-primary text-white mt-6 py-6"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>

        <div className="flex items-center gap-4 my-6">
          <Separator className="flex-1" />
          <span className="text-sm text-gray-500">Or login with</span>
          <Separator className="flex-1" />
        </div>

        <GoogleLoginButton mode="login" />
      </div>
    </div>
  );
}
