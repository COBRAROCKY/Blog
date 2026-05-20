import fs from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const POSTS_FILE = path.join(DATA_DIR, "posts.json")
const COMMENTS_FILE = path.join(DATA_DIR, "comments.json")
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json")
const UPLOADS_DIR = path.join(DATA_DIR, "uploads")

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function readJSON<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8")
      return JSON.parse(raw) as T
    }
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e)
  }
  return fallback
}

function writeJSON<T>(filePath: string, data: T): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8")
}

// --- Types ---

export interface Post {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  coverImage: string
  published: boolean
  createdAt: string
  updatedAt: string
  type: "markdown" | "html"
}

export interface Comment {
  id: string
  postId: string
  author: string
  content: string
  createdAt: string
  approved: boolean
}

export interface Settings {
  siteName: string
  siteDescription: string
  authorName: string
  authorBio: string
  authorAvatar: string
  socialLinks: {
    github?: string
    twitter?: string
    email?: string
  }
  adminPassword: string
  adminUsername: string
}

// --- Default Data ---

const DEFAULT_POSTS: Post[] = [
  {
    id: "1",
    slug: "hello-world",
    title: "欢迎来到我的博客",
    excerpt: "这是我的第一篇博客文章，在这里我将分享技术、生活和思考。",
    content: `## 你好，世界！\n\n这是我的个人博客的第一篇文章。\n\n### 关于本博客\n\n这个博客是我用来记录技术学习、生活感悟和个人思考的地方。\n\n### 技术栈\n\n- **框架**: Next.js 14 + React 18\n- **样式**: Tailwind CSS\n- **语言**: TypeScript\n- **内容**: Markdown + HTML 支持\n\n### 我会写什么？\n\n1. 前端开发技术分享\n2. 编程学习笔记\n3. 开源项目介绍\n4. 偶尔的生活杂记\n\n> 写作是最好的思考方式。\n\n欢迎常来看看！`,
    category: "随想",
    tags: ["博客", "介绍"],
    coverImage: "/images/default-banner.jpg",
    published: true,
    createdAt: "2026-05-10T08:00:00.000Z",
    updatedAt: "2026-05-10T08:00:00.000Z",
    type: "markdown",
  },
  {
    id: "2",
    slug: "nextjs-app-router-guide",
    title: "Next.js App Router 完全指南",
    excerpt: "深入理解 Next.js App Router 的核心概念、路由系统、数据获取和服务端组件。",
    content: `## Next.js App Router 完全指南\n\nNext.js 13+ 引入了全新的 App Router，这是一次重大的架构升级。\n\n### 核心概念\n\n#### 1. 文件系统路由\n\n\`\`\`\napp/\n  page.tsx        → /\n  blog/\n    page.tsx      → /blog\n    [slug]/\n      page.tsx    → /blog/:slug\n\`\`\`\n\n#### 2. 服务端组件\n\n默认情况下，App Router 中的所有组件都是服务端组件：\n\n\`\`\`tsx\n// 这是在服务端渲染的\nasync function BlogList() {\n  const posts = await getPosts()\n  return <div>{posts.map(p => <PostCard key={p.id} post={p} />)}</div>\n}\n\`\`\`\n\n#### 3. 客户端组件\n\n需要使用交互功能时，添加 \`"use client"\` 指令：\n\n\`\`\`tsx\n"use client"\nimport { useState } from "react"\n\nfunction SearchBar() {\n  const [query, setQuery] = useState("")\n  return <input value={query} onChange={e => setQuery(e.target.value)} />\n}\n\`\`\`\n\n### 最佳实践\n\n1. 尽可能使用服务端组件\n2. 客户端组件尽量保持在叶子节点\n3. 使用 \`loading.tsx\` 提供加载状态\n4. 使用 \`error.tsx\` 处理错误\n\n希望这篇指南对你有帮助！`,
    category: "前端开发",
    tags: ["Next.js", "React", "TypeScript"],
    coverImage: "/images/default-banner.jpg",
    published: true,
    createdAt: "2026-05-11T10:00:00.000Z",
    updatedAt: "2026-05-11T10:00:00.000Z",
    type: "markdown",
  },
  {
    id: "3",
    slug: "tailwind-css-best-practices",
    title: "Tailwind CSS 设计系统最佳实践",
    excerpt: "如何使用 Tailwind CSS 构建可维护的设计系统，包括颜色语义化、组件变体和响应式策略。",
    content: `## Tailwind CSS 设计系统最佳实践\n\nTailwind CSS 是一个实用优先的 CSS 框架。但要真正用好它，需要建立一套设计系统。\n\n### 1. 语义化颜色令牌\n\n\`\`\`css\n@layer base {\n  :root {\n    --primary: 217 91% 60%;\n    --background: 240 10% 3.9%;\n    --foreground: 210 40% 98%;\n  }\n}\n\`\`\`\n\n### 2. 组件变体\n\n使用 \`class-variance-authority\` 创建类型安全的组件变体：\n\n\`\`\`tsx\nconst buttonVariants = cva("base-styles", {\n  variants: {\n    variant: { primary: "bg-primary", ghost: "hover:bg-muted" },\n    size: { sm: "h-8 px-3", lg: "h-12 px-8" }\n  }\n})\n\`\`\`\n\n### 3. 响应式策略\n\n- 移动优先，渐进增强\n- 使用容器查询进行组件级响应式\n- 避免固定的断点思维\n\n### 总结\n\n设计系统的核心是一致性。定义好变量后，整个项目的视觉语言会自然地统一起来。`,
    category: "前端开发",
    tags: ["Tailwind CSS", "设计系统", "CSS"],
    coverImage: "/images/default-banner.jpg",
    published: true,
    createdAt: "2026-05-12T12:00:00.000Z",
    updatedAt: "2026-05-12T12:00:00.000Z",
    type: "markdown",
  },
]

const DEFAULT_COMMENTS: Comment[] = [
  {
    id: "1",
    postId: "1",
    author: "访客小明",
    content: "恭喜开博！期待更多精彩内容。",
    createdAt: "2026-05-10T10:00:00.000Z",
    approved: true,
  },
]

const DEFAULT_SETTINGS: Settings = {
  siteName: "QSpace",
  siteDescription: "一个关于技术、编程与生活的个人博客",
  authorName: "博客作者",
  authorBio: "全栈开发者，热爱开源与技术分享。专注于 Web 开发、系统设计和用户体验。",
  authorAvatar: "",
  socialLinks: {
    github: "https://github.com",
    twitter: "https://twitter.com",
    email: "hello@example.com",
  },
  adminPassword: "$2a$10$placeholder", // will be set on first run
  adminUsername: "admin",
}

// --- DB Functions ---

export function initDB() {
  ensureDir(DATA_DIR)
  ensureDir(UPLOADS_DIR)

  if (!fs.existsSync(POSTS_FILE)) {
    writeJSON(POSTS_FILE, DEFAULT_POSTS)
  }
  if (!fs.existsSync(COMMENTS_FILE)) {
    writeJSON(COMMENTS_FILE, DEFAULT_COMMENTS)
  }
  if (!fs.existsSync(SETTINGS_FILE)) {
    writeJSON(SETTINGS_FILE, DEFAULT_SETTINGS)
  }
}

// Posts
export function getPosts(): Post[] {
  return readJSON<Post[]>(POSTS_FILE, DEFAULT_POSTS)
    .filter(p => p.published)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getAllPosts(): Post[] {
  return readJSON<Post[]>(POSTS_FILE, DEFAULT_POSTS)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getPostBySlug(slug: string): Post | undefined {
  const posts = readJSON<Post[]>(POSTS_FILE, DEFAULT_POSTS)
  return posts.find(p => p.slug === slug && p.published)
}

export function getPostById(id: string): Post | undefined {
  const posts = readJSON<Post[]>(POSTS_FILE, DEFAULT_POSTS)
  return posts.find(p => p.id === id)
}

export function createPost(post: Omit<Post, "id" | "createdAt" | "updatedAt">): Post {
  const posts = readJSON<Post[]>(POSTS_FILE, DEFAULT_POSTS)
  const newPost: Post = {
    ...post,
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  posts.push(newPost)
  writeJSON(POSTS_FILE, posts)
  return newPost
}

export function updatePost(id: string, updates: Partial<Post>): Post | undefined {
  const posts = readJSON<Post[]>(POSTS_FILE, DEFAULT_POSTS)
  const index = posts.findIndex(p => p.id === id)
  if (index === -1) return undefined
  posts[index] = { ...posts[index], ...updates, updatedAt: new Date().toISOString() }
  writeJSON(POSTS_FILE, posts)
  return posts[index]
}

export function deletePost(id: string): boolean {
  const posts = readJSON<Post[]>(POSTS_FILE, DEFAULT_POSTS)
  const filtered = posts.filter(p => p.id !== id)
  if (filtered.length === posts.length) return false
  writeJSON(POSTS_FILE, filtered)
  return true
}

export function getCategories(): string[] {
  const posts = getPosts()
  const cats = new Set(posts.map(p => p.category))
  return Array.from(cats)
}

export function getAllTags(): string[] {
  const posts = getPosts()
  const tags = new Set(posts.flatMap(p => p.tags))
  return Array.from(tags).sort()
}

export function searchPosts(query: string): Post[] {
  const posts = getPosts()
  const q = query.toLowerCase()
  return posts.filter(
    p =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
  )
}

// Comments
export function getComments(postId: string): Comment[] {
  const comments = readJSON<Comment[]>(COMMENTS_FILE, DEFAULT_COMMENTS)
  return comments
    .filter(c => c.postId === postId && c.approved)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
}

export function getAllComments(): Comment[] {
  return readJSON<Comment[]>(COMMENTS_FILE, DEFAULT_COMMENTS)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function addComment(comment: Omit<Comment, "id" | "createdAt" | "approved">): Comment {
  const comments = readJSON<Comment[]>(COMMENTS_FILE, DEFAULT_COMMENTS)
  const newComment: Comment = {
    ...comment,
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
    approved: true,
  }
  comments.push(newComment)
  writeJSON(COMMENTS_FILE, comments)
  return newComment
}

export function approveComment(id: string): boolean {
  const comments = readJSON<Comment[]>(COMMENTS_FILE, DEFAULT_COMMENTS)
  const comment = comments.find(c => c.id === id)
  if (!comment) return false
  comment.approved = true
  writeJSON(COMMENTS_FILE, comments)
  return true
}

export function deleteComment(id: string): boolean {
  const comments = readJSON<Comment[]>(COMMENTS_FILE, DEFAULT_COMMENTS)
  const filtered = comments.filter(c => c.id !== id)
  if (filtered.length === comments.length) return false
  writeJSON(COMMENTS_FILE, filtered)
  return true
}

// Settings
export function getSettings(): Settings {
  return readJSON<Settings>(SETTINGS_FILE, DEFAULT_SETTINGS)
}

export function updateSettings(updates: Partial<Settings>): Settings {
  const settings = getSettings()
  const updated = { ...settings, ...updates }
  writeJSON(SETTINGS_FILE, updated)
  return updated
}

// Upload
export function getUploadsDir(): string {
  ensureDir(UPLOADS_DIR)
  return UPLOADS_DIR
}
