import type { NextAuthConfig } from "next-auth";

export const authConfig = {
	providers: [],
	pages: {
		signIn: "/login"
	},
	callbacks: {
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user;
			const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
			if (isOnDashboard) {
				if (isLoggedIn) return true;
				return Response.redirect(new URL("/", nextUrl)); // Redirect unauthenticated users to home page
			} else if (isLoggedIn) {
				return Response.redirect(new URL("/dashboard", nextUrl)); // Redirect authenticated users to dashboard
			}
			return true;
		}
	}
} satisfies NextAuthConfig;
