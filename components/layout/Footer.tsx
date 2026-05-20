import Link from "next/link"
import { GitBranch, Send, Mail, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold mb-3">
              Q<span className="text-gradient">Space</span>
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              一个关于技术、编程与生活的个人博客。记录思考，分享知识。
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-foreground">导航</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  文章
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  关于我
                </Link>
              </li>
              <li>
                <Link href="/rss.xml" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  RSS 订阅
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-foreground">社交</h4>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300"
              >
                <GitBranch className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="mailto:hello@example.com"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-500" /> using Next.js
          </p>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} QSpace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
