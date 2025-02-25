import Link from "next/link"
import { Home, BarChart, User } from "lucide-react"

const Navbar = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <div className="flex justify-around items-center h-16">
        <Link href="/" className="flex flex-col items-center text-muted-foreground hover:text-primary">
          <Home className="w-6 h-6" />
          <span className="text-xs">Home</span>
        </Link>
        <Link href="/stats" className="flex flex-col items-center text-muted-foreground hover:text-primary">
          <BarChart className="w-6 h-6" />
          <span className="text-xs">Stats</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center text-muted-foreground hover:text-primary">
          <User className="w-6 h-6" />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </nav>
  )
}

export default Navbar

