import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema, TUserSchema } from "./app/lib/z.schemas";
import { prisma } from "./app/lib/prisma";

async function getUser(email: string): Promise<TUserSchema | undefined> {
	try {
		const user = (await prisma.user.findUnique({
			where: {
				email
			}
		})) as TUserSchema | undefined;

		return user;
	} catch (error) {
		console.error("Failed to fetch user:", error);
		throw new Error("Failed to fetch user.");
	}
}

export const { auth, signIn, signOut } = NextAuth({
	...authConfig,
	providers: [
		Credentials({
			async authorize(credentials) {
				const parsedCredentials = LoginSchema.safeParse(credentials);
				if (parsedCredentials.success) {
					const { email, password } = parsedCredentials.data;
					const user = await getUser(email);
					if (!user) return null;
					const isPasswordMatch = await bcrypt.compare(password, user.password);
					if (isPasswordMatch) return user;
				}
				console.log("Invalid credentials");
				return null;
			}
		})
	]
});
