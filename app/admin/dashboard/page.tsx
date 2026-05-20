"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, LogOut, Settings, Calendar, Edit, Trash2, ExternalLink } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Post, Comment } from "@/lib/db"

export default function AdminDashboardPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<Post[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch("/api/auth/verify")
      .then(async (res) => {
        if (!res.ok) {
          router.push("/admin")
          return
        }
        setAuthenticated(true)
        const [postsRes, commentsRes] = await Promise.all([
          fetch("/api/posts?all=true"),
          fetch("/api/comments?all=true"),
        ])
        const postsData = await postsRes.json()
        const commentsData = await commentsRes.json()
        setPosts(postsData)
        setComments(commentsData)
        setLoading(false)
      })
      .catch(() => {
        router.push("/admin")
      })
  }, [router])

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" })
    router.push("/admin")
  }

  const handleDeletePost = async (id: string) => {
    if (!confirm("确定删除这篇文章？")) return
    await fetch(`/api/posts/${id}`, { method: "DELETE" })
    setPosts(posts.filter(p => p.id !== id))
  }

  const handleDeleteComment = async (id: string) => {
    await fetch(`/api/comments?id=${id}`, { method: "DELETE" })
    setComments(comments.filter(c => c.id !== id))
  }

  const handleTogglePublish = async (post: Post) => {
    const res = await fetch(`/api/posts/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !post.published }),
    })
    if (res.ok) {
      const updated = await res.json()
      setPosts(posts.map(p => p.id === post.id ? updated : p))
    }
  }

  if (loading) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">验证中...</p>
      </div>
    )
  }

  if (!authenticated) return null

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-10 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">管理后台</h1>
          <p className="text-muted-foreground mt-1">管理文章和评论</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/editor">
            <Button variant="primary" size="sm" className="gap-1.5">
              <Plus className="w-4 h-4" />
              写文章
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10 animate-fade-in-up">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gradient">{posts.length}</div>
            <div className="text-xs text-muted-foreground mt-1">文章总数</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gradient">
              {posts.filter(p => p.published).length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">已发布</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gradient">{comments.length}</div>
            <div className="text-xs text-muted-foreground mt-1">评论数</div>
          </CardContent>
        </Card>
      </div>

      {/* Posts Management */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          文章管理
        </h2>
        <div className="space-y-3">
          {posts.map((post) => (
            <Card key={post.id} className="transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{post.title}</h3>
                      <Badge variant={post.published ? "accent" : "default"}>
                        {post.published ? "已发布" : "草稿"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.createdAt)}
                      </span>
                      <span>{post.category}</span>
                      <Badge variant="outline">{post.type.toUpperCase()}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Link href={`/blog/${post.slug}`} target="_blank">
                      <Button variant="ghost" size="icon" className="w-8 h-8" title="预览">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/editor?id=${post.id}`}>
                      <Button variant="ghost" size="icon" className="w-8 h-8" title="编辑">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => handleTogglePublish(post)}
                      title={post.published ? "下架" : "发布"}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-destructive hover:text-destructive"
                      onClick={() => handleDeletePost(post.id)}
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Comments Management */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary" />
          评论管理
        </h2>
        <div className="space-y-2">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{comment.content}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 text-destructive hover:text-destructive shrink-0"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
