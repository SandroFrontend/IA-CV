"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginCVApplicant } from "@/lib/actions/cv-auth.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CVLoginForm() {
  const [state, action, isPending] = useActionState(loginCVApplicant, {});

  return (
    <Card className="mx-auto w-full max-w-md overflow-hidden border-gray-200 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
      <div className="h-1 w-full bg-red-700" />
      <CardHeader>
        <CardTitle className="text-neutral-950">Acceso profesorado</CardTitle>
        <CardDescription>
          Inicia sesión para consultar los currículums o evaluar tu propio CV con IA.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="login-username">Nombre de usuario</Label>
            <Input
              id="login-username"
              name="username"
              autoComplete="username"
              minLength={3}
              maxLength={32}
              required
              className="border-gray-200 focus-visible:border-red-700 focus-visible:ring-red-700/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">Contraseña</Label>
            <Input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              maxLength={128}
              required
              className="border-gray-200 focus-visible:border-red-700 focus-visible:ring-red-700/20"
            />
          </div>
          {state.error && (
            <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {state.error}
            </p>
          )}
          <Button
            type="submit"
            className="h-10 w-full bg-red-700 text-white hover:bg-red-800"
            disabled={isPending}
          >
            {isPending ? "Comprobando..." : "Iniciar sesión"}
          </Button>
        </form>
        <p className="mt-5 text-sm text-muted-foreground">
          ¿Aún no tienes cuenta local?{" "}
          <Link className="font-medium text-foreground underline underline-offset-4" href="/">
            Sube tu CV y crea una cuenta de prueba
          </Link>
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          Prototipo: estas cuentas no verifican todavía las credenciales del centro.
        </p>
      </CardContent>
    </Card>
  );
}
