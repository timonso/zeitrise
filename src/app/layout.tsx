import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// const geistSans = localFont({
//   src: "/media/fonts/serif/dm_serif.ttf",
//   variable: "--font-geist-sans",
// });

const geistMono = localFont({
  src: "../../public/media/fonts/mono/geist_mono.ttf",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "ZeitRise",
  description: "Decade",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
