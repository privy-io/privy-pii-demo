import { FieldInstance } from "@privy-io/privy-js";

export type UserDataInput = {
  name: string;
  username: string;
  email: string;
  website: string;
  bio: string;
  avatar: string;
};

export type UserData = {
  name: FieldInstance | null;
  username: FieldInstance | null;
  email: FieldInstance | null;
  website: FieldInstance | null;
  bio: FieldInstance | null;
  avatar: FieldInstance | null;
};

export type UserDataKey = keyof UserData;

export function formatUserData(
  fields: Array<FieldInstance | null>
): UserDataInput {
  return fields.reduce((data, field) => {
    if (field !== null) {
      data[field.field_id as UserDataKey] = field.text();
    }
    return data;
  }, {} as UserDataInput);
}

export function formatDisplayAddress(address: string) {
  const first = address.slice(0, 5);
  const last = address.slice(address.length - 3, address.length);
  return `${first}...${last}`;
}
