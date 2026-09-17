import type { Metadata } from "next";
import { QueryProvider } from "./query.provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "MeetAndJam",
  description: "Find and join music jam sessions",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
