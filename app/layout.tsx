import type { Metadata } from "next"
import localFont from "next/font/local"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { initDB } from "@/lib/db"
import "./globals.css"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: {
    default: "QSpace - 技术博客",
    template: "%s | QSpace",
  },
  description: "一个关于技术、编程与生活的个人博客。分享前端开发、系统设计和编程思考。",
  keywords: ["博客", "技术", "前端开发", "React", "Next.js", "TypeScript"],
}

// Initialize database on startup
initDB()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased flex flex-col`}
      >
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
