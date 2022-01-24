import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { PRIVY_API_HOST, PRIVY_API_KEY, PRIVY_API_SECRET } from "../../config";

export async function getJWT(
  requesterId: string,
  roles: string | string[] = []
): Promise<string> {
  const rolesArray =
    typeof roles === "string"
      ? roles.split(",").filter((r) => r.length > 0)
      : roles;

  const response = await axios.post(
    `${PRIVY_API_HOST}/auth/token`,
    { requester_id: requesterId, roles: rolesArray },
    {
      auth: {
        username: PRIVY_API_KEY,
        password: PRIVY_API_SECRET,
      },
    }
  );

  return response.data.token;
}

type SuccessResponseBody = {
  token: string;
};

type FailureResponseBody = {
  message: string;
  statusCode: number;
  type: string;
};

type ResponseBody = SuccessResponseBody | FailureResponseBody;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseBody>
) {
  // For the purpose of this demo, clients tell the server who the requester
  // is and what roles they have. However, in real-world settings, the server
  // would assign permissions / roles appropriately based on the currently
  // logged in user and what access they should have.
  const requesterId = req.query.requester_id as string;
  const roles = req.query.roles || "";

  try {
    const token = await getJWT(requesterId, roles);
    res.status(200).json({ token });
  } catch (error) {
    if (!axios.isAxiosError(error)) {
      return res.status(500).json({
        type: "internal_server_error",
        message: `Failed to retrieve access token: ${String(error)}`,
        statusCode: 500,
      });
    }

    const code = error.response != null ? error.response.status : 500;
    const body =
      error.response != null
        ? error.response.data
        : {
            type: "internal_server_error",
            message: "Failed to retrieve access token",
            statusCode: code,
          };

    res.status(code).json(body);
  }
}
