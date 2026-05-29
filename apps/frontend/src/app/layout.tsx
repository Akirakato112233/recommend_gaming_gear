import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Recommend Gaming Gear",
  description: "Mouse-fit diagnostics for gaming gear recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
