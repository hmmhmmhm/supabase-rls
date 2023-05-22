import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "@/context/Providers";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

const title = "Supabase RLS Editor";
const description =
  "Helps you write Supabase Row Level Security (RLS) in Typescript. (* plv8)";
const images = [
  {
    url: "https://i.imgur.com/PbNDm4h.png",
    width: 1200,
    height: 485,
    alt: title,
  },
];
export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    type: "website",
    title,
    description,
    images,
  },
  twitter: {
    title,
    description,
    card: "summary_large_image",
    images,
  },
  robots: "follow, index",
  viewport: "width=device-width, initial-scale=1",
  authors: [
    {
      name: "hmmhmmhm",
      url: "https://twitter.com/hmartapp",
    },
  ],
  keywords: [
    "supabase",
    "row level security",
    "rls",
    "typescript",
    "plv8",
    "supabase rls editor",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
