import { createContext, useContext } from "react";
import { SiweSession } from "privy-js/siwe";
import { useRouter } from "next/router";

export const SessionContext = createContext<SiweSession | null>(null);

export function useSession() {
  return useContext(SessionContext);
}

export function SignOutLink() {
  const router = useRouter();
  const session = useSession();

  return (
    <a
      href="/sign-out"
      onClick={(e) => {
        e.preventDefault();
        if (session) {
          session.destroy().then(() => router.push("/sign-in"));
        }
      }}
    >
      Sign out
    </a>
  );
}
