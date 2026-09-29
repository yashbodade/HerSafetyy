"use client"

import { useState } from "react"
import Link from "next/link"
import { Shield } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function SignUpPage() {
  const { signUp } = useAuth()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [pending, setPending] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setPending(true)
    try {
      await signUp(email, password)
      toast({ title: "Check your email", description: "Confirm your address to finish creating your account." })
    } catch {
      toast({ title: "Unable to create account", description: "Please check your details and try again.", variant: "destructive" })
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-10 text-white">
      <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center">
        <div className="mb-8 text-center"><div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-blue-600"><Shield className="size-7" /></div><h1 className="text-3xl font-bold">Create your account</h1><p className="mt-2 text-sm text-slate-400">Join a safer, more connected community.</p></div>
        <Card className="border-white/10 bg-white text-slate-950"><CardHeader><CardTitle>Your details</CardTitle></CardHeader><CardContent><form onSubmit={submit} className="flex flex-col gap-4"><label className="flex flex-col gap-1 text-sm font-medium">Email<Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></label><label className="flex flex-col gap-1 text-sm font-medium">Password<Input required minLength={8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" /></label><Button className="h-12" disabled={pending}>{pending ? "Creating account…" : "Create account"}</Button></form><p className="mt-5 text-center text-sm text-slate-500">Already registered? <Link href="/auth/login" className="font-semibold text-blue-600">Sign in</Link></p></CardContent></Card>
      </div>
    </main>
  )
}
