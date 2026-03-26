import type { Metadata } from "next";
import { Epilogue, Manrope, Inter } from "next/font/google";
import "./globals.css";
import AppLayout from "@/components/layout/AppLayout";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";

const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FC ELITE - Kinetic Arena",
  description: "Plateforme de gestion footballistique d'élite",
  keywords: ["football", "management", "elite", "tactique", "mercato"],
  openGraph: {
    title: "FC ELITE - Kinetic Arena",
    description: "Plateforme de gestion footballistique d'élite",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${epilogue.variable} ${manrope.variable} ${inter.variable} antialiased dark`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-on-surface font-body selection:bg-primary/30">
        <AuthProvider>
          <AppLayout>{children}</AppLayout>
          <Toaster
            theme="dark"
            position="top-right"
            richColors
            toastOptions={{
              style: {
                background: '#1a1919',
                border: '1px solid rgba(255,255,255,0.1)',
                fontFamily: 'var(--font-manrope)',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
