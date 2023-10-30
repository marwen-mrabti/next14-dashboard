import { Metadata } from "next";
import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";

export const metadata: Metadata = {
	title: "Acme",
	description: "nextjs learning project",
	keywords: "nextjs, typescript, tailwindcss, react, prisma, mongodb, SSR, "
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={`${inter.className} antialiased`}>{children}</body>
		</html>
	);
}
