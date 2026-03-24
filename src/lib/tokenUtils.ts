"use server"

import jwt, { JwtPayload } from "jsonwebtoken";
import { setCookie } from "./cookieUtils";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET

const getTokenSecondsRemaining =  (token: string): number => {
    if(!token) return 0;

    // Non-JWT tokens (e.g., opaque session tokens) do not contain exp.
    const jwtParts = token.split(".");
    if (jwtParts.length !== 3) {
        return 0;
    }

    try {
        const decodedToken = JWT_ACCESS_SECRET
            ? jwt.verify(token, JWT_ACCESS_SECRET as string)
            : jwt.decode(token);

        if (!decodedToken || typeof decodedToken !== "object") {
            return 0;
        }

        const tokenPayload = decodedToken as JwtPayload;
        if (typeof tokenPayload.exp !== "number") {
            return 0;
        }

        const remainingSeconds = tokenPayload.exp - Math.floor(Date.now() / 1000)

        return remainingSeconds > 0 ? remainingSeconds : 0;

    } catch {
        return 0;
    }
} 

export const setTokenInCookies = async (
    name : string,
    token : string,
    fallbackMaxAgeInSeconds = 60 * 60 * 24 // 1 days
) => {
    const maxAgeInSeconds = getTokenSecondsRemaining(token);

    await setCookie(name, token, maxAgeInSeconds || fallbackMaxAgeInSeconds);
}