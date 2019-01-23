// Imports
import { v4 } from "uuid";
import { redis } from "../redis";

// Constants
import { CONFIRM_USER_PREFIX } from "../constants/RedisPrefixes";

export const CreateConfirmationUrl = async (
  userId: number
): Promise<string> => {
  const token = v4();

  await redis.set(CONFIRM_USER_PREFIX + token, userId, "ex", 60 * 60 * 24);

  return `http://localhost:3000/user/confirm/${token}`;
};
