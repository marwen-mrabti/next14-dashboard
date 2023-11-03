import { Metadata } from "next";
import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";


export const metadata: Metadata = {
	title: "Acme",
	description: "nextjs dashboard build with app router learning project",
	metadataBase: new URL("https://next14-dashboard-nine.vercel.app/"),
	keywords:
		"nextjs, typescript, tailwindcss, react, prisma, mongodb, SSR, server actions , next-auth"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={`${inter.className} antialiased`}>{children}</body>
		</html>
	);
}
