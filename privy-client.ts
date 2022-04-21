import axios from "axios";
import PrivyClient, { CustomSession } from "@privy-io/privy-js";
import {
  NEXT_PUBLIC_PRIVY_KMS_HOST,
  NEXT_PUBLIC_PRIVY_API_HOST,
} from "./config";

export function getQueryString(requesterId: string, roles: string | void) {
  const params = [`requester_id=${requesterId}`];

  if (roles && roles.length > 0) {
    params.push(`roles=${roles}`);
  }

  return params.join("&");
}

export function buildClient(requesterId: string, roles: string | void) {
  return new PrivyClient({
    apiURL: NEXT_PUBLIC_PRIVY_API_HOST,
    kmsURL: NEXT_PUBLIC_PRIVY_KMS_HOST,
    session: new CustomSession(async function authenticate() {
      try {
        const response = await axios.get(
          `/api/token?${getQueryString(requesterId, roles)}`
        );
        return response.data.token;
      } catch (e) {
        console.log("Error fetching access token: ", e);
      }
    }),
  });
}
