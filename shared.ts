export type UserData = {
  fullName: string;
  wallets: string;
  avatar: string;
};

const UserDataPrivyMapping = {
  "full-name": "fullName",
  "wallet-addresses": "wallets",
  "avatar": "avatar",
}

export type UserDataKey = "full-name" | "wallet-addresses" | "avatar"

export type UserDataResponse = {
  field_id: UserDataKey;
  data: string;
};

export function formatUserData(fields: UserDataResponse[]): UserData {
  return fields.reduce((data, field) => {
    data[UserDataPrivyMapping[field.field_id]] = field.data;
    return data;
  }, {} as UserData);
}
