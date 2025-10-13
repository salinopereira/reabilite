import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reabilite Pro",
  description: "Gestão de pacientes para fisioterapeutas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className={`${inter.className} bg-jacksons-purple`}>
        {children}
      </body>
    </html>
  );
}
