import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import "../styles/globals.css";
import { ToastProvider } from "../context/ToastContex";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ToastProvider>

        <Component {...pageProps} />
      </ToastProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
