import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "Pickeat",
  description: "맛있는 이야기가 시작되는 곳",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${pretendard.variable} font-sans antialiased bg-gray-100`}>
        <div className="flex justify-center min-h-screen">
          <div className="w-full max-w-[390px] bg-white relative">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}