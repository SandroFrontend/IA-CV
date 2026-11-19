import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Evaluación CV",
  description:
    "Permite evaluar currículums y registrar una valoración orientada al sector profesional elegido por el candidato.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/80 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <Link href="/" aria-label="Inicio" className="inline-flex items-center">
              <Image
                src="/logos/Logo_FerIA_Red.svg"
                alt="Ausias FerIA"
                width={150}
                height={82}
                priority
                className="h-9 w-auto"
              />
            </Link>
            <nav aria-label="Navegación principal" className="flex items-center gap-1 sm:gap-3">
              <Link
                href="/"
                className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-neutral-100"
              >
                Registro
              </Link>
              <Link
                href="/ia"
                className="rounded-lg px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
              >
                Evaluación IA
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
