"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Share2, Twitter, Facebook, Link } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

import { ShareModalProps } from "@/lib/types"

export function ShareModal({ stats, achievements }: ShareModalProps) {
  const { toast } = useToast()
  const [sharing, setSharing] = useState(false)

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = `I've completed ${stats.totalCompletions} habits and earned ${achievements.length} achievements!`

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${shareUrl}`)
  }

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`)
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
    toast({
      title: "Link copied!",
      description: "Share your progress with friends"
    })
  }

  const shareImage = async () => {
    setSharing(true)
    try {
      const element = document.getElementById('stats-card')
      if (!element) return

      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(element)
      const dataUrl = canvas.toDataURL()
      
      if (navigator.share) {
        const blob = await (await fetch(dataUrl)).blob()
        const file = new File([blob], 'stats.png', { type: 'image/png' })
        await navigator.share({
          files: [file],
          title: 'My Habit Progress',
          text: shareText
        })
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
    setSharing(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Share2 className="w-4 h-4 mr-2" />
          Share Progress
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Your Progress</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <Button onClick={shareToTwitter} variant="outline">
            <Twitter className="w-4 h-4 mr-2" />
            Share on Twitter
          </Button>
          <Button onClick={shareToFacebook} variant="outline">
            <Facebook className="w-4 h-4 mr-2" />
            Share on Facebook
          </Button>
          <Button onClick={copyLink} variant="outline">
            <Link className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
          <Button onClick={shareImage} disabled={sharing}>
            {sharing ? "Generating..." : "Share as Image"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
