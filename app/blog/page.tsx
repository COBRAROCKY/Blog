"use client"

import { useState, useMemo } from "react"
import { PostCard } from "@/components/blog/PostCard"
import { SearchBar } from "@/components/blog/SearchBar"
import { TagCloud } from "@/components/blog/TagCloud"
import { getPosts, getAllTags, getCategories, searchPosts, type Post } from "@/lib/db"

// Note: We're using the db functions directly but since this needs to work on client,
// we'll use a server-data approach. For now, let me adjust.
// Actually, for the blog page we should use server component with search params.
// Let me refactor this approach.

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | undefined>()
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()

  // This data will come from the API
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  // Load posts on mount
  useState(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  })

  const tags = useMemo(() => {
    const allTags = new Set(posts.flatMap(p => p.tags))
    return Array.from(allTags).sort()
  }, [posts])

  const categories = useMemo(() => {
    const cats = new Set(posts.map(p => p.category))
    return Array.from(cats)
  }, [posts])

  const filteredPosts = useMemo(() => {
    let result = posts

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      )
    }

    if (selectedTag) {
      result = result.filter(p => p.tags.includes(selectedTag))
    }

    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory)
    }

    return result
  }, [posts, searchQuery, selectedTag, selectedCategory])

  return (
    <div className="container py-16">
      {/* Header */}
      <div className="mb-12 text-center animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">所有文章</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          探索技术世界，发现有趣的知识
        </p>
      </div>

      {/* Search & Filters */}
      <div className="mb-8 space-y-6 animate-fade-in-up">
        <div className="max-w-md mx-auto">
          <SearchBar onSearch={setSearchQuery} />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <TagCloud
            tags={tags}
            selectedTag={selectedTag}
            onSelectTag={setSelectedTag}
          />
        </div>

        {categories.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? undefined : cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <p className="text-muted-foreground text-lg">没有找到匹配的文章</p>
          <p className="text-sm text-muted-foreground mt-2">试试其他关键词或标签</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, i) => (
            <div key={post.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
