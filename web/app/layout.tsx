import type { Metadata } from "next";

import { UserProvider } from "@/lib/user";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chat Bot",
  description: "A small client for the chat-bot API",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
