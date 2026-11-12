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
    <Card className="mx-auto w-full max-w-md border-muted shadow-sm">
      <CardHeader>
        <CardTitle>Acceso del alumnado</CardTitle>
        <CardDescription>
          Inicia sesión para evaluar tu último currículum y realizar la entrevista guiada.
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
            />
          </div>
          {state.error && (
            <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {state.error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={isPending}>
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
