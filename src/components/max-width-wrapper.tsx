import { cn } from "@/utils"
import { ReactNode } from "react"

interface MaxWidthWrapperProps {
  className?: string
  children: ReactNode
}

export function MaxWidthWrapper({ className, children }: MaxWidthWrapperProps) {
  return (
    <div className={cn("h-full mx-auto max-w-screen-xl md:px-20", className)}>
      {children}
    </div>
  )
}
