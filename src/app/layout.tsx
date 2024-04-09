import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {ClerkProvider} from '@clerk/nextjs'
import "./globals.css";
import {ThemeProvider} from "./themeProvider";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Noted",
    description: "Never forget anything",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
            <body className={inter.className}>
            <ThemeProvider attribute="class">
                {children}
            </ThemeProvider>
            </body>
            </html>
        </ClerkProvider>
    );
}


