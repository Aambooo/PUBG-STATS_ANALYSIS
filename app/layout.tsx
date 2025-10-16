import type { Metadata } from "next";
import "./globals.css";
import { Archivo_Narrow, Oswald } from 'next/font/google';

const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' });
const archivoNarrow = Archivo_Narrow({ subsets: ['latin'], variable: '--font-archivo-narrow' });

export const metadata: Metadata = {
  title: "STAT ARENA",
  description: "Track your PUBG PC performance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${oswald.variable} ${archivoNarrow.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}