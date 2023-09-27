import type { Metadata } from "next";
import { SocketProvider } from "../context/socketContext";

export const metadata: Metadata = {
  title: "Play",
  description: "Play Chess Online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SocketProvider>{children}</SocketProvider>
    </div>
  );
}
