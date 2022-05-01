import { createContext, useContext } from "react";
import PrivyClient, { SiweSession } from "@privy-io/privy-js";
import { useRouter } from "next/router";
import {
  NEXT_PUBLIC_PRIVY_API_HOST,
  NEXT_PUBLIC_PRIVY_API_KEY,
  NEXT_PUBLIC_PRIVY_KMS_HOST,
} from "../config";

export function isMetaMaskEnabled() {
  return !!(
    typeof window !== "undefined" &&
    window.ethereum &&
    window.ethereum.isMetaMask
  );
}

// When next.js is rendering on the server, there is no
// window.ethereum. This is a mock for that object in Node.
const NodeMockProvider = {
  request(arg: {
    method: string;
    params?: [address: string, message: string];
  }) {
    switch (arg.method) {
      case "personal_sign":
        return "";
      case "eth_accounts":
        return [];
      case "eth_requestAccounts":
        return [];
      case "eth_chainId":
        return "0x1";
      default:
        throw new Error("unrecognized ethereum method");
    }
  },
};

class Session {
  private siwe: SiweSession;
  private _address: string | null = null;

  privy: PrivyClient;

  constructor(provider: any) {
    this.siwe = new SiweSession(NEXT_PUBLIC_PRIVY_API_KEY, provider, {
      baseURL: NEXT_PUBLIC_PRIVY_API_HOST,
    });

    this.privy = new PrivyClient({
      apiURL: NEXT_PUBLIC_PRIVY_API_HOST,
      kmsURL: NEXT_PUBLIC_PRIVY_KMS_HOST,
      session: this.siwe,
    });
  }

  get address() {
    if (this._address === null) {
      throw new Error("Attempt to reference address when null");
    }

    return this._address;
  }

  get authenticated() {
    return this._address !== null;
  }

  async initialize() {
    const authenticated = await this.siwe.isAuthenticated();

    if (!authenticated) {
      return;
    }

    this._address = await this.siwe.address();
  }

  async authenticate() {
    await this.siwe.authenticate();
    const address = await this.siwe.address();
    this._address = address;
  }

  async destroy() {
    await this.siwe.destroy();
    this._address = null;
  }
}

export const SessionContext = createContext<Session>(
  new Session(isMetaMaskEnabled() ? window.ethereum : NodeMockProvider)
);

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
        session.destroy().then(() => router.push("/sign-in"));
      }}
    >
      Sign out
    </a>
  );
}
