import Link from "next/link"
import { ArrowRight, Code2, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PostCard } from "@/components/blog/PostCard"
import { getPosts } from "@/lib/db"

export default function Home() {
  const posts = getPosts()
  const featuredPosts = posts.slice(0, 3)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

        <div className="container relative py-24 md:py-36">
          <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-sm text-primary animate-glow-pulse">
              <Sparkles className="w-4 h-4" />
              探索技术与创造的边界
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              用代码构建
              <br />
              <span className="text-gradient">更好的数字世界</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
              分享前端开发、系统设计和编程思考。记录每个灵感瞬间，让知识在时间中沉淀。
            </p>

            {/* CTA */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <Link href="/blog">
                <Button variant="primary" size="lg">
                  阅读文章
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">
                  关于我
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gradient">{posts.length}</div>
                <div className="text-xs text-muted-foreground mt-1">篇文章</div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-gradient">
                  {new Set(posts.map(p => p.category)).size}
                </div>
                <div className="text-xs text-muted-foreground mt-1">个分类</div>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-gradient">
                  {new Set(posts.flatMap(p => p.tags)).size}
                </div>
                <div className="text-xs text-muted-foreground mt-1">个标签</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-16 border-t border-border/30">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-500 group">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:shadow-[0_0_15px_hsl(var(--primary)/0.3)] transition-shadow">
                <Code2 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">技术深度</h3>
              <p className="text-sm text-muted-foreground">
                深入技术底层，分享实战经验和最佳实践。
              </p>
            </div>
            <div className="p-6 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-500 group">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:shadow-[0_0_15px_hsl(var(--accent)/0.3)] transition-shadow">
                <Zap className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">持续更新</h3>
              <p className="text-sm text-muted-foreground">
                保持学习节奏，定期产出高质量技术内容。
              </p>
            </div>
            <div className="p-6 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-primary/20 transition-all duration-500 group">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:shadow-[0_0_15px_hsl(var(--primary)/0.3)] transition-shadow">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">开源精神</h3>
              <p className="text-sm text-muted-foreground">
                热爱开源，所有项目代码在 GitHub 上公开分享。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="relative py-16 border-t border-border/30">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">最新文章</h2>
              <p className="text-muted-foreground mt-2">精选优质内容，持续更新中</p>
            </div>
            <Link href="/blog">
              <Button variant="ghost" className="gap-1">
                查看全部 <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {featuredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">还没有文章，敬请期待</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
