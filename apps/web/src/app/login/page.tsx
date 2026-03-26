"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ScanEyeIcon, EyeIcon, EyeOffIcon, ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"

const DEMO_EMAIL = "demo@sitelenshq.com"
const DEMO_PASSWORD = "sitelens2026"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState(DEMO_EMAIL)
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    await new Promise((r) => setTimeout(r, 600))

    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      router.push("/dashboard")
    } else {
      setError("Invalid credentials. Use the demo account below.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — branding panel */}
      <div className="hidden lg:flex flex-col justify-between bg-muted/30 border-r p-12">
        <div className="flex items-center gap-2">
          <ScanEyeIcon className="size-5" />
          <span className="font-semibold text-base tracking-tight">SiteLensHQ</span>
        </div>

        <div className="flex flex-col gap-6">
          <blockquote className="text-2xl font-semibold leading-snug tracking-tight">
            "We went from weekly site visits to daily drone intelligence — every stakeholder sees the same picture."
          </blockquote>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">Khalid Al-Otaibi</p>
            <p className="text-sm text-muted-foreground">Project Director, Riyadh North Corridor</p>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} SiteLensHQ · Construction Intelligence Platform
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex flex-col items-center justify-center p-8 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-sm flex flex-col gap-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <ScanEyeIcon className="size-5" />
            <span className="font-semibold text-base tracking-tight">SiteLensHQ</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
            <p className="text-sm text-muted-foreground">
              Access your construction intelligence platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive rounded-md bg-destructive/10 px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full mt-1" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign in
                  <ArrowRightIcon className="size-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Demo credentials hint */}
          <div className="rounded-lg border border-dashed p-4 flex flex-col gap-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Demo credentials
            </p>
            <div className="grid grid-cols-[60px_1fr] gap-x-2 gap-y-1 text-sm">
              <span className="text-muted-foreground">Email</span>
              <span className="font-mono text-xs">{DEMO_EMAIL}</span>
              <span className="text-muted-foreground">Password</span>
              <span className="font-mono text-xs">{DEMO_PASSWORD}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
