import PrivyData from "privy-js";
import { Session } from "privy-js";
import {
  NEXT_PUBLIC_PRIVY_KMS_HOST,
  NEXT_PUBLIC_PRIVY_API_HOST,
  NEXT_PUBLIC_PRIVY_API_KEY,
} from "./config";

export function buildClient(session: Session) {
  return new PrivyData(NEXT_PUBLIC_PRIVY_API_KEY, {
    apiRoute: NEXT_PUBLIC_PRIVY_API_HOST,
    kmsRoute: NEXT_PUBLIC_PRIVY_KMS_HOST,
    authCallback: () => Promise.resolve(session.token?.token as string),
  });
}
