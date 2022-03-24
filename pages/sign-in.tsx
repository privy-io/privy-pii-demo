import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useSession } from "../components/session";
import { SiweSession } from "privy-js/siwe";
import { useRouter } from "next/router";

export async function getStaticProps() {
  return {
    props: {
      protected: false,
    },
  };
}

function SignIn() {
  const router = useRouter();
  const session = useSession() as SiweSession;
  const [mmEnabled, setMMEnabled] = useState(false);
  const [signInError, setSignInError] = useState<Error | null>(null);

  useEffect(() => {
    setMMEnabled(window.ethereum && window.ethereum.isMetaMask);
  }, []);

  function onSubmit() {
    const onSuccess = async () => {
      const address = await session.address();
      router.push(`/users/${address}`);
    };

    const onFailure = (error: Error) => {
      setSignInError(error);
    };

    session.authenticate().then(onSuccess, onFailure);
  }

  return (
    <div>
      <Head>
        <title>Privy Demo</title>
      </Head>
      <main>
        <div className="sign-in-container">
          {!mmEnabled && (
            <div className="mm-disabled notification is-danger">
              Your browser is not MetaMask enabled. To sign in, you must connect
              with MetaMask using the browser extension available in Chrome and
              Firefox. You can visit{" "}
              <a href="https://metamask.io">https://metamask.io</a> to install
              the extension.
            </div>
          )}
          {signInError !== null && (
            <div className="mm-disabled notification is-danger">
              {String(signInError)}
              <br />
              <br />
              Please try signing in again.
            </div>
          )}
          <div>
            <button
              className="button is-primary is-medium"
              onClick={(e) => {
                e.preventDefault();
                onSubmit();
              }}
            >
              Sign in
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SignIn;
