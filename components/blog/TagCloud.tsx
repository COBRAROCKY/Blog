"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TagCloudProps {
  tags: string[]
  selectedTag?: string
  onSelectTag: (tag: string | undefined) => void
}

export function TagCloud({ tags, selectedTag, onSelectTag }: TagCloudProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge
        variant={!selectedTag ? "primary" : "outline"}
        className="cursor-pointer transition-all duration-300"
        onClick={() => onSelectTag(undefined)}
      >
        全部
      </Badge>
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant={selectedTag === tag ? "primary" : "outline"}
          className={cn(
            "cursor-pointer transition-all duration-300",
            selectedTag === tag && "shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
          )}
          onClick={() => onSelectTag(selectedTag === tag ? undefined : tag)}
        >
          {tag}
        </Badge>
      ))}
    </div>
  )
}
