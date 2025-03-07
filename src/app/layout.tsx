import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
          <div className="flex items-center flex-shrink-0 text-white mr-6">
            <span className="font-semibold text-xl tracking-tight">
              Example Site
            </span>
          </div>
          <div className="lg:flex lg:items-center lg:w-auto justify-end">
            <ul className="flex">
              <li className="mr-4">
                <Link
                  href="/"
                  className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white"
                >
                  Home
                </Link>
              </li>
              <li className="mr-4">
                <Link
                  href="/profile"
                  className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white"
                >
                  Profile
                </Link>
              </li>
              <li className="mr-4">
                <Link
                  href="/cards"
                  className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white"
                >
                  Cards
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        <div className="container mx-auto pt-4">{children}</div>
      </body>
    </html>
  );
}
