# App1 - Template
Aplicación de referencia para desarrollos en FerIA

## Objetivo
El objetivo es la implementación de una aplicación básica con los elementos típicos necesarios. De esta forma la aplicación actuará como plantilla de referencia a partir de la cual decirle a la IA que elabore proyectos. 
Se busca establecer una forma de trabajo concreta:
- Next.js 16
- Base de datos Postgres v18
- Lanzamiento en contenedores de docker
- prisma (v7)!!!
- Shadcn
- Validación zod
- React-hook-form
- Actionserver
- Elemento genérico de formulario
- Reconocimiento de cabeceras detrás de authentik → XX better-authXX




This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Evaluación de CV con IA

El flujo de prueba está disponible en `/escaparametro/ia` (con el servidor local en la raíz, abre `http://localhost:3000/escaparametro/ia`). La subida inicial crea una cuenta local; el acceso no valida todavía las credenciales del centro ni reemplaza una integración SSO/LDAP.

Configura estas variables en el entorno de la aplicación:

```env
CV_SESSION_SECRET=<secreto aleatorio de al menos 32 caracteres>
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.2
CV_UPLOAD_DEADLINE=
```

Genera `CV_SESSION_SECRET` con un gestor de secretos o, por ejemplo, con `openssl rand -base64 32`. No lo guardes en el repositorio. `CV_UPLOAD_DEADLINE` es opcional; si se configura, debe ser una fecha ISO 8601 con zona horaria, por ejemplo `2026-11-09T23:59:59+01:00`. Sin valor no se bloquean subidas.

Inicia Ollama según el compose de `docker/ia-ecaparametro` y descarga el modelo configurado en el contenedor (por ejemplo, `docker exec escaparometro_ollama ollama pull llama3.2`). Para Docker, la aplicación usa por defecto `http://host.docker.internal:11434`; se puede cambiar `OLLAMA_BASE_URL` si Ollama está en otra dirección. El contenedor de la aplicación incluye `pdftotext` para extraer texto de los PDF; los currículums escaneados sin texto seleccionable no se pueden evaluar.

Aplica las migraciones Prisma antes de desplegar la nueva versión:

```bash
pnpm exec prisma migrate deploy
```

La nota de la rúbrica se calcula sobre 20 puntos con los ocho criterios del documento. Las cuatro respuestas de entrevista se valoran por separado sobre 4; no se suman a la nota del CV porque el documento no define esa ponderación.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
