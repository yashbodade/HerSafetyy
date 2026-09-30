"use client"

import { useState } from "react"
import Link from "next/link"
import { Shield, Mail, Lock } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const { signIn, signInWithGoogle, isConfigured } = useAuth()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [pending, setPending] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setPending(true)
    try {
      await signIn(email, password)
      window.location.href = "/"
    } catch {
      toast({ title: "Unable to sign in", description: "Check your email and password, then try again.", variant: "destructive" })
    } finally {
      setPending(false)
    }
  }

  const google = async () => {
    setPending(true)
    try {
      await signInWithGoogle()
    } catch {
      toast({ title: "Google sign-in unavailable", description: isConfigured ? "Please try again." : "Connect Supabase OAuth to enable Google sign-in.", variant: "destructive" })
      setPending(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-white">
      <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30"><Shield className="size-7" /></div>
          <p className="text-sm font-semibold text-blue-300">HerSafety</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">Your safety network is ready when you are.</p>
        </div>
        <Card className="border-white/10 bg-white text-slate-950 shadow-2xl">
          <CardHeader><CardTitle>Sign in securely</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button type="button" variant="outline" className="h-12 w-full" onClick={google} disabled={pending}>
              <span className="mr-2 text-base font-bold text-blue-600">G</span> Continue with Google
            </Button>
            <div className="flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200" />or use email<span className="h-px flex-1 bg-slate-200" /></div>
            <form onSubmit={submit} className="flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-sm font-medium">Email<div className="relative"><Mail className="absolute left-3 top-3 size-4 text-slate-400" /><Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" placeholder="you@example.com" /></div></label>
              <label className="flex flex-col gap-1 text-sm font-medium">Password<div className="relative"><Lock className="absolute left-3 top-3 size-4 text-slate-400" /><Input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9" placeholder="Your password" /></div></label>
              <Button className="mt-2 h-12 w-full" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</Button>
            </form>
            <p className="text-center text-sm text-slate-500">New here? <Link href="/auth/sign-up" className="font-semibold text-blue-600">Create an account</Link></p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
