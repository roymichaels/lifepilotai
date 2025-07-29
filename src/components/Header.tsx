
import { LogOut, User } from "lucide-react"
import { Button } from "./ui/button"
import { ThemeToggle } from "./ui/theme-toggle"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"

export function Header() {
  const { logout, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => {
    logout()
    navigate("/login")
  }
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="text-xl font-bold" onClick={navigate("/")}>Home</div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/onboarding')}>
            Onboarding
          </Button>
          <ThemeToggle />
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt="User Avatar" />
                    <AvatarFallback className="bg-muted text-white">
                      {user.id.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700" align="end" forceMount>
                <DropdownMenuItem onClick={() => navigate('/settings')} className="hover:bg-gray-800 cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="hover:bg-gray-800 cursor-pointer text-red-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
          )}
        </div>
      </div>
    </header>
  )
}
