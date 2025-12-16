import { Response } from "express";

export default function setCookie(res: Response, name: string, value: string) {
    const isProduction = process.env.NODE_ENV === "production";

    // In production we want Secure + SameSite=None so cookies work across subdomains/origins.
    // In local development (http://localhost) Secure cookies are ignored by browsers, so
    // set secure to false and use a relaxed SameSite to allow testing.
    const cookieOptions: any = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    res.cookie(name, value, cookieOptions);
}

