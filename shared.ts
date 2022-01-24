export type UserData = {
  name: string;
  username: string;
  email: string;
  website: string;
  bio: string;
  avatar: string;
};

export type UserDataKey = keyof UserData;

export type UserDataResponse = {
  field_id: UserDataKey;
  data: string;
};

export function formatUserData(fields: UserDataResponse[]): UserData {
  return fields.reduce((data, field) => {
    data[field.field_id] = field.data;
    return data;
  }, {} as UserData);
}
