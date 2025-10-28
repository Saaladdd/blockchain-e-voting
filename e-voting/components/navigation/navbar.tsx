"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Vote, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ElectionSwitcher } from "@/components/navigation/election-switcher"
import { useAuth } from "@/components/auth/auth-provider"
import { useElection } from "@/lib/election-context"

interface NavbarProps {
  role?: "voter" | "party" | "admin"
  title?: string
}

export function Navbar({ role, title }: NavbarProps) {
  const pathname = usePathname()
  const { logout } = useAuth()
  const { selectedElection } = useElection()

  const getNavLinks = () => {
    switch (role) {
      case "voter":
        return [
          { href: "/voter/dashboard", label: "Dashboard" },
          { href: "/voter/confirmation", label: "Status" },
        ]
      case "party":
        return [{ href: "/party/dashboard", label: "Dashboard" }]
      case "admin":
        return [{ href: "/admin/dashboard", label: "Dashboard" }]
      default:
        return []
    }
  }

  const navLinks = getNavLinks()

  const getDisplayTitle = () => {
    if (selectedElection && role) {
      return `${title || "Dashboard"} - ${selectedElection.name}`
    }
    return title
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Vote className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-serif font-bold text-foreground">SecureVote</h1>
          </div>
        </Link>

        {/* Center Section - Election Switcher and Navigation */}
        <div className="flex items-center gap-6">

          {/* Navigation Links */}
          {navLinks.length > 0 && (
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === link.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {role && (
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="h-9 px-3 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
