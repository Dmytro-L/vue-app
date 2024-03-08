import { UUID } from "crypto";

export type Order = {
  id?: UUID;
  cityFrom: string;
  cityTo: string;
  userId?: UUID;
  description?: string;
  parcelType?: string;
  dispatchDate?: number;
  requestType?: string | undefined;
};

export type UserData = {
  id?: UUID;
  email: string;
  name?: string;
  password: string;
};
