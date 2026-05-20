"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Send, User, Loader2 } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Comment } from "@/lib/db"

interface CommentSectionProps {
  postId: string
  initialComments: Comment[]
}

export function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [author, setAuthor] = useState("")
  const [content, setContent] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!author.trim() || !content.trim()) {
      setError("请填写昵称和评论内容")
      return
    }
    setSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, author: author.trim(), content: content.trim() }),
      })
      if (res.ok) {
        const newComment = await res.json()
        setComments([...comments, newComment])
        setAuthor("")
        setContent("")
      } else {
        setError("提交失败，请稍后重试")
      }
    } catch {
      setError("网络错误，请稍后重试")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-8">
        评论 <span className="text-muted-foreground text-base font-normal">({comments.length})</span>
      </h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-10 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="你的昵称"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="mb-3"
            />
            <Textarea
              placeholder="写下你的想法..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button type="submit" variant="glow" disabled={submitting} size="sm">
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            发表评论
          </Button>
          {error && <span className="text-sm text-destructive">{error}</span>}
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            暂无评论，来抢个沙发吧
          </p>
        )}
        {comments.map((comment) => (
          <Card key={comment.id} className="transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-sm font-medium">{comment.author}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {comment.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
