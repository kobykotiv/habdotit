import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface TutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

const Tutorial = ({ isOpen, onClose }: TutorialProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome to Habit Tracker! 🎉</DialogTitle>
          <DialogDescription>Let's get you started on your journey to building better habits.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p>1. Add a new habit by clicking the "Track New Habit" button.</p>
          <p>2. Choose a category and frequency for your habit.</p>
          <p>3. Check in daily to mark your habit as complete.</p>
          <p>4. Watch your streak grow and stay motivated!</p>
          <p>5. View detailed progress in the graphs for each habit.</p>
          <p>6. Your data is stored locally for privacy. Remember to backup regularly!</p>
        </div>
        <Button onClick={onClose} className="mt-4">
          Got it, let's go!
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default Tutorial
