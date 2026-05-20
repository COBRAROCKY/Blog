import { GitBranch, Send, Mail, MapPin, Code2, Coffee, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "关于我",
  description: "一名热爱技术和分享的全栈开发者",
}

const SKILLS = [
  "TypeScript", "React", "Next.js", "Node.js", "Tailwind CSS",
  "Vue.js", "Python", "Docker", "Git", "PostgreSQL",
]

const EXPERIENCE = [
  {
    title: "高级前端工程师",
    company: "某科技公司",
    period: "2024 - 至今",
    description: "负责核心产品前端架构设计与开发，推动技术升级。",
  },
  {
    title: "前端开发工程师",
    company: "某互联网公司",
    period: "2022 - 2024",
    description: "参与多个业务线的前端开发，积累了大量实战经验。",
  },
  {
    title: "全栈开发（自由职业）",
    company: "Freelance",
    period: "2020 - 2022",
    description: "独立承接 Web 开发项目，前后端全盘负责。",
  },
]

export default function AboutPage() {
  return (
    <div className="container py-16">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          {/* Avatar placeholder */}
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_hsl(var(--primary)/0.3)]">
            <Code2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">你好，我是博客作者</h1>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
            全栈开发者，热爱开源与技术分享。专注于 Web 开发、系统设计和用户体验。
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-muted text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
            >
              <GitBranch className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-muted text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
            >
              <Send className="w-5 h-5" />
            </a>
            <a
              href="mailto:hello@example.com"
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-muted text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Skills */}
        <section className="mb-16 animate-fade-in-up">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" />
            技术栈
          </h2>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map(skill => (
              <Badge key={skill} variant="primary">{skill}</Badge>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section className="mb-16 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            经历
          </h2>
          <div className="space-y-6">
            {EXPERIENCE.map((exp, i) => (
              <div
                key={i}
                className="relative pl-6 border-l-2 border-border hover:border-primary/50 transition-colors pb-6 last:pb-0"
              >
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.5)]" />
                <h3 className="font-semibold">{exp.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                  <span>{exp.company}</span>
                  <span>·</span>
                  <span>{exp.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Interests */}
        <section className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            兴趣
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-card transition-all duration-300 text-center">
              <Coffee className="w-6 h-6 text-accent mx-auto mb-2" />
              <span className="text-sm font-medium">开源贡献</span>
            </div>
            <div className="p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-card transition-all duration-300 text-center">
              <Code2 className="w-6 h-6 text-primary mx-auto mb-2" />
              <span className="text-sm font-medium">技术写作</span>
            </div>
            <div className="p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-card transition-all duration-300 text-center">
              <Coffee className="w-6 h-6 text-accent mx-auto mb-2" />
              <span className="text-sm font-medium">咖啡 & 代码</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
