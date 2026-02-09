import type { Metadata } from "next";
import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Press_Start_2P } from 'next/font/google';
import "./globals.css";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: "LifeTune Radio — AI Music for Your Life",
  description: "Personalized AI radio that learns your taste and generates fresh tracks daily",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${pixelFont.variable} antialiased bg-[#0a0a1a] text-[#ffb347] font-mono`}>
          <header className="flex justify-between items-center p-4 gap-4 h-16 border-b border-[#ffb347]/30">
            <div className="text-sm md:text-base tracking-wider">LIFETUNE RADIO 📻</div>
            <div className="flex items-center gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-[#00e5ff]/20 border border-[#00e5ff] text-[#00e5ff] px-3 py-1 text-xs hover:bg-[#00e5ff]/30 transition-colors">
                    SIGN IN
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-[#ffb347] text-[#0a0a1a] px-3 py-1 text-xs hover:bg-[#ffb347]/80 transition-colors">
                    SIGN UP
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
