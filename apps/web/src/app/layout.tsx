import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { StoreProvider } from "@/lib/store";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SiteLensHQ",
  description: "Drone-powered construction intelligence platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
