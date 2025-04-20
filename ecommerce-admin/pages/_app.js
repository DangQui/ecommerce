import '@/styles/globals.css';
import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "@/context/NotificationContext";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <NotificationProvider>
        <Component {...pageProps} />
      </NotificationProvider>
    </SessionProvider>
  );
}