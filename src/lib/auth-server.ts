import "server-only";
import { auth as authInstance } from "./auth";
import { headers } from "next/headers";

/**
 * Helper to get easy access to the auth session on the server-side.
 * See: https://www.better-auth.com/docs/basic-usage#server-side
 *
 * Use all these functions only in your server-side actions, not in your client-side components.
 */

// Export the auth instance for direct API access
export const auth = authInstance;

export const getServerSession = async () =>
  await authInstance.api.getSession({
    headers: await headers(),
  });

export const signInEmail = authInstance.api.signInEmail;

export const signUpEmail = authInstance.api.signUpEmail;

export const signOut = authInstance.api.signOut;

export const changeEmail = authInstance.api.changeEmail;

export const changePassword = authInstance.api.changePassword;
