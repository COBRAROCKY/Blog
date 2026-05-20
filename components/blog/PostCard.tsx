import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import { formatDate, estimateReadTime } from "@/lib/utils"
import type { Post } from "@/lib/db"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const readTime = estimateReadTime(post.content)

  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <Card className="h-full transition-all duration-500 group-hover:shadow-[0_0_40px_hsl(var(--primary)/0.15)] group-hover:border-primary/30 group-hover:-translate-y-1">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="accent">{post.category}</Badge>
          </div>
          <CardTitle className="group-hover:text-gradient transition-all duration-300">
            {post.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {post.excerpt}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(post.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {readTime} 分钟阅读
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
