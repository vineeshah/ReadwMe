import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "./components/SessionProvider";
import { getServerSession } from "next-auth";
import Navbar from "./components/Navbar";
import { authOptions } from "./api/auth/[...nextauth]/route";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ReadwMe",
  description: "Your reading companion",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" data-theme="synthwave" className="synthwave-theme">
      <head>
        <meta name="color-scheme" content="dark" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-base-100 theme-synthwave`}
      >
        <SessionProvider session={session}>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}

