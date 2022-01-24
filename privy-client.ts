import axios from "axios";
import PrivyData from "privy-js";
import {
  NEXT_PUBLIC_PRIVY_KMS_HOST,
  NEXT_PUBLIC_PRIVY_API_HOST,
  NEXT_PUBLIC_PRIVY_API_KEY,
} from "./config";

export function getQueryString(requesterId: string, roles: string | void) {
  const params = [`requester_id=${requesterId}`];

  if (roles && roles.length > 0) {
    params.push(`roles=${roles}`);
  }

  return params.join("&");
}

export function buildClient(requesterId: string, roles: string | void) {
  return new PrivyData(NEXT_PUBLIC_PRIVY_API_KEY, {
    apiRoute: NEXT_PUBLIC_PRIVY_API_HOST,
    kmsRoute: NEXT_PUBLIC_PRIVY_KMS_HOST,
    authCallback: async () => {
      try {
        const response = await axios.get(
          `/api/token?${getQueryString(requesterId, roles)}`
        );
        return response.data.token;
      } catch (e) {
        console.log("Error fetching access token: ", e);
      }
    },
  });
}
