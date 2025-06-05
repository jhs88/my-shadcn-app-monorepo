import { createThemeSessionResolver } from "remix-themes";
import { createCookieSessionStorage } from "react-router";

const cookieName = "__remix-themes";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: cookieName,
    // domain: 'remix.run',
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["s3cr3t"],
    // secure: true,
  },
});

export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
