import { clsx, type ClassValue } from "clsx"
import { Metadata } from "next"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parseColor = (color: string): number => {
  const hex = color.startsWith("#") ? color.slice(1) : color
  return parseInt(hex, 16)
}

export function constructMetadata({
  title = "PingPanda - A Modern Fullstack Event Monitoring SaaS",
  description = "A Modern Fullstack Event Monitoring SaaS",
  image = "/thumbnail.png",
  icons = "/favicon.ico",
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@merykassis48",
    },
    icons,
    metadataBase: new URL("https://merk48-ping-panda.vercel.app/"),
  }
}
