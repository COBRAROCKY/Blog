"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Eye, Upload, Loader2, Plus, X } from "lucide-react"
import { slugify } from "@/lib/utils"
import type { Post } from "@/lib/db"

function EditorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const postId = searchParams.get("id")
  const isEditing = Boolean(postId)

  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  // Form state
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [type, setType] = useState<"markdown" | "html">("markdown")
  const [published, setPublished] = useState(true)

  // Upload state
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")

  // Verify auth
  useEffect(() => {
    fetch("/api/auth/verify")
      .then((res) => {
        if (!res.ok) {
          router.push("/admin")
          return
        }
        setAuthenticated(true)
        if (postId) {
          return fetch(`/api/posts/${postId}`).then(r => r.json())
        }
        setLoading(false)
      })
      .then((post: Post | undefined) => {
        if (post) {
          setTitle(post.title)
          setSlug(post.slug)
          setExcerpt(post.excerpt)
          setContent(post.content)
          setCategory(post.category)
          setTags(post.tags)
          setType(post.type)
          setPublished(post.published)
        }
        setLoading(false)
      })
      .catch(() => {
        router.push("/admin")
      })
  }, [postId, router])

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!isEditing && !slug) {
      setSlug(slugify(value))
    }
  }

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) {
      setTags([...tags, t])
    }
    setTagInput("")
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  const handleSave = async (publish: boolean) => {
    if (!title || !slug) {
      setError("标题和 Slug 不能为空")
      return
    }
    setSaving(true)
    setError("")

    try {
      const url = isEditing ? `/api/posts/${postId}` : "/api/posts"
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          category: category || "未分类",
          tags,
          type,
          published: publish,
        }),
      })

      if (res.ok) {
        const saved = await res.json()
        if (publish) {
          router.push(`/blog/${saved.slug}`)
        } else {
          router.push("/admin/dashboard")
        }
      } else {
        const data = await res.json()
        setError(data.error || "保存失败")
      }
    } catch {
      setError("网络错误")
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadError("")

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("title", title || file.name)
      formData.append("category", category || "未分类")
      formData.append("tags", tags.join(","))

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        await res.json()
        router.push("/admin/dashboard")
      } else {
        const data = await res.json()
        setUploadError(data.error || "上传失败")
      }
    } catch {
      setUploadError("网络错误")
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    )
  }

  if (!authenticated) return null

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="icon" className="w-9 h-9">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{isEditing ? "编辑文章" : "写文章"}</h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              支持 Markdown 和 HTML 格式，或直接上传文件
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            存为草稿
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="gap-1.5"
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            发布
          </Button>
        </div>
      </div>

      {/* Upload Section */}
      <Card className="mb-8 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Upload className="w-4 h-4 text-primary" />
            上传文件
            <Badge variant="outline">.md / .html</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept=".md,.html,.htm"
              onChange={handleFileUpload}
              disabled={uploading}
              className="max-w-sm"
            />
            {uploading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
            {uploadError && <span className="text-sm text-destructive">{uploadError}</span>}
          </div>
        </CardContent>
      </Card>

      {/* Editor Form */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in-up">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="space-y-2">
            <Input
              placeholder="文章标题"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="text-xl font-bold h-14"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Slug (URL)</label>
            <Input
              placeholder="article-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">摘要</label>
            <Textarea
              placeholder="文章摘要..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">正文内容</label>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => setType(type === "markdown" ? "html" : "markdown")}
              >
                切换为 {type === "markdown" ? "HTML" : "Markdown"} 编辑
              </Button>
              <Badge variant="accent">{type.toUpperCase()}</Badge>
            </div>
            <Textarea
              placeholder={type === "markdown" ? "## 开始写你的 Markdown 文章..." : "<article>\n  <h2>开始写你的 HTML 文章...</h2>\n</article>"}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              className="font-mono text-sm leading-relaxed"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Publish Status */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="text-sm font-semibold">发布状态</h3>
              <div className="flex items-center gap-2">
                <Badge variant={published ? "accent" : "default"}>
                  {published ? "已发布" : "草稿"}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs w-full"
                onClick={() => setPublished(!published)}
              >
                切换状态
              </Button>
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="text-sm font-semibold">分类</h3>
              <Input
                placeholder="例如：前端开发"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="text-sm font-semibold">标签</h3>
              <div className="flex gap-1">
                <Input
                  placeholder="输入标签"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                  className="text-sm"
                />
                <Button variant="outline" size="icon" onClick={addTag} className="shrink-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Badge key={tag} variant="primary" className="gap-1 cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag}
                    <X className="w-3 h-3" />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Link href={`/blog/${slug}`} target="_blank" className={`block ${!slug ? "pointer-events-none opacity-50" : ""}`}>
            <Button variant="outline" className="w-full gap-1.5" size="sm" disabled={!slug}>
              <Eye className="w-4 h-4" />
              预览
            </Button>
          </Link>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminEditorPage() {
  return (
    <Suspense fallback={
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">加载中...</p>
      </div>
    }>
      <EditorContent />
    </Suspense>
  )
}
