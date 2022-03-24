import React, { useEffect, useState } from "react";
import "../styles/globals.css";
import "../styles/users.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import siwe, { SiweSession } from "privy-js/siwe";
import {
  NEXT_PUBLIC_PRIVY_API_HOST,
  NEXT_PUBLIC_PRIVY_API_KEY,
} from "../config";
import { SessionContext } from "../components/session";

declare global {
  interface Window {
    ethereum: any;
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [session, setSession] = useState<SiweSession | null>(null);
  const [signedIn, setSignedIn] = useState(false);

  // Pages that don't require authentication must explicitly define
  // a static prop called `protected` set to `false`.
  const pageRequiresSignedInUser = pageProps.protected !== false;

  useEffect(() => {
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      return;
    }

    const session = siwe(window.ethereum, {
      apiKey: NEXT_PUBLIC_PRIVY_API_KEY,
      apiRoute: NEXT_PUBLIC_PRIVY_API_HOST,
    });

    setSession(session);

    const onSuccess = (signedIn: boolean) => {
      setSignedIn(signedIn);
      if (!signedIn && pageRequiresSignedInUser) {
        router.push("/sign-in");
      }
    };

    const onFailure = (error: any) => {
      console.error(error);
      setSignedIn(false);
    };

    session.isAuthenticated().then(onSuccess, onFailure);
  }, []);

  if (!session || (pageRequiresSignedInUser && !signedIn)) {
    return null;
  }

  return (
    <SessionContext.Provider value={session}>
      <Component {...pageProps} />;
    </SessionContext.Provider>
  );
}

export default MyApp;
