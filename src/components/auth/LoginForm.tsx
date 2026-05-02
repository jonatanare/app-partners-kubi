"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { loginSchema, type LoginFormData } from "@/lib/schemas/loginSchema";
import { callLogin } from "@/lib/api/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/portal/validate";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await callLogin(data);
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? "Credenciales incorrectas")
        : "Error al iniciar sesión";
      setError("root", { message });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="negocio@ejemplo.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register("password")}
      />

      {errors.root && (
        <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600 border border-red-200">
          {errors.root.message}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        loading={isSubmitting}
        className="w-full mt-1"
      >
        Iniciar Sesión
      </Button>

      <p className="text-center text-sm text-slate-500">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="text-teal-600 hover:underline font-medium">
          Registra tu negocio
        </Link>
      </p>
    </form>
  );
}
