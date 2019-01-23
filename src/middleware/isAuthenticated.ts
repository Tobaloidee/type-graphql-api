// Imports
import { MiddlewareFn } from "type-graphql";

// Types
import { IContext } from "../types/Context";

export const isAuthenticated: MiddlewareFn<IContext> = async (
  { context },
  next
) => {
  if (!context.req.session!.userId) {
    throw new Error("Vous devez être connecté pour faire cela.");
  }

  return next();
};
