import { notFound } from "next/navigation"
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer"
import { CommentSection } from "@/components/blog/CommentSection"
import { getPostBySlug, getComments } from "@/lib/db"
import { formatDate, estimateReadTime } from "@/lib/utils"
import type { Metadata } from "next"

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return { title: "文章未找到" }
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
  }
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  const comments = getComments(post.id)
  const readTime = estimateReadTime(post.content)

  return (
    <article className="container py-12">
      {/* Back navigation */}
      <div className="mb-8 animate-fade-in">
        <Link href="/blog">
          <Button variant="ghost" size="sm" className="gap-1.5 -ml-3">
            <ArrowLeft className="w-4 h-4" />
            返回文章列表
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <header className="max-w-3xl mx-auto mb-12 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="accent">{post.category}</Badge>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(post.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {readTime} 分钟阅读
            </span>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-6">
            <Tag className="w-4 h-4 text-muted-foreground" />
            {post.tags.map(tag => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
        )}
      </header>

      {/* Article Content */}
      <div className="max-w-3xl mx-auto animate-fade-in-up">
        <MarkdownRenderer content={post.content} type={post.type} />
      </div>

      {/* Divider */}
      <div className="max-w-3xl mx-auto my-12">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Comments */}
      <div className="max-w-3xl mx-auto">
        <CommentSection postId={post.id} initialComments={comments} />
      </div>
    </article>
  )
}
