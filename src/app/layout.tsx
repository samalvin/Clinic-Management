import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clinic Admission Portal",
  description: "A portal for clinic admissions and patient management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <header className="header">
          <div className="container">
            <h1>Clinic Admission Portal</h1>
            <p className="subtitle">Effortless Clinic Admission Management</p>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
