"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Settings, Type, Contrast, Eye } from "lucide-react"
import { useTheme } from "next-themes"

export function AccessibilityMenu() {
  const [fontSize, setFontSize] = useState(16)
  const { setTheme } = useTheme()

  const adjustFontSize = (size: number) => {
    setFontSize(size)
    document.documentElement.style.fontSize = `${size}px`
  }

  const toggleHighContrast = () => {
    document.documentElement.classList.toggle('high-contrast')
  }

  const toggleReducedMotion = () => {
    document.documentElement.classList.toggle('reduce-motion')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Accessibility settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => adjustFontSize(fontSize + 1)}>
          <Type className="mr-2 h-4 w-4" />
          Increase Font Size
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => adjustFontSize(fontSize - 1)}>
          <Type className="mr-2 h-4 w-4" />
          Decrease Font Size
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={toggleHighContrast}>
          <Contrast className="mr-2 h-4 w-4" />
          Toggle High Contrast
        </DropdownMenuItem>
        <DropdownMenuItem onClick={toggleReducedMotion}>
          <Eye className="mr-2 h-4 w-4" />
          Toggle Reduced Motion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
