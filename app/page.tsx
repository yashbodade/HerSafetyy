"use client"

import { useEffect, useState } from "react"
import { Shield, MapPin, AlertTriangle, BookOpen, Users, ChevronRight, Sparkles, UserRound, LocateFixed, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  const { user } = useAuth()
  const [locationReady, setLocationReady] = useState(false)
  const [locationLabel, setLocationLabel] = useState("Location access is off")
  const firstName = user?.email?.split("@")[0] || "there"

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationReady(true)
        setLocationLabel("Location is ready for SafeRoute")
      },
      () => setLocationLabel("Enable location for safer routes"),
      { enableHighAccuracy: false, timeout: 8000 },
    )
  }, [])
  const features = [
    {
      icon: Shield,
      title: "SOS Help",
      description: "Instant emergency assistance",
      href: "/sos",
      gradient: "coral-gradient",
      delay: "0ms",
    },
    {
      icon: MapPin,
      title: "SafeRoute",
      description: "Navigate safely to your destination",
      href: "/safe-route",
      gradient: "safe-gradient",
      delay: "100ms",
    },
    {
      icon: AlertTriangle,
      title: "Report Incident",
      description: "Report safety concerns anonymously",
      href: "/report",
      gradient: "gradient-bg",
      delay: "200ms",
    },
    {
      icon: BookOpen,
      title: "Learn About Safety",
      description: "Safety tips and resources",
      href: "/learn",
      gradient: "gradient-bg",
      delay: "300ms",
    },
  ]

  return (
    <div className="min-h-screen bg-[#f7f9fc] px-4 pb-8 pt-5 dark:bg-slate-950">
      <div className="mx-auto max-w-md">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Good morning</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">Hi, {firstName}</h1>
          </div>
          <Link href="/settings" aria-label="Open profile" className="flex size-11 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:text-white dark:ring-slate-800">
            <UserRound className="size-5" />
          </Link>
        </header>

        <section className="mb-6 overflow-hidden rounded-3xl bg-slate-950 p-5 text-white shadow-xl shadow-slate-300/40 dark:bg-slate-900 dark:shadow-none">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-100">
                <Sparkles className="size-3.5" /> Your safety centre
              </div>
              <h2 className="text-xl font-semibold leading-tight">Stay aware. Stay connected.</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">Real-time tools for safer routes, trusted guardians, and fast help.</p>
            </div>
            <Shield className="size-10 shrink-0 text-blue-300" />
          </div>
          <Link href="/sos" className="mt-5 flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-blue-50">
            Open emergency help <ChevronRight className="size-4" />
          </Link>
        </section>

        <section className="mb-6 grid grid-cols-[1fr_auto] items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex min-w-0 items-center gap-3">
            <div className={`flex size-10 shrink-0 items-center justify-center rounded-2xl ${locationReady ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50" : "bg-amber-50 text-amber-600 dark:bg-amber-950/50"}`}>
              {locationReady ? <CheckCircle2 className="size-5" /> : <LocateFixed className="size-5" />}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Live safety status</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{locationLabel}</p>
            </div>
          </div>
          <Link href="/safe-route" className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400">Open map</Link>
        </section>

        <section className="mb-6 rounded-3xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-950 dark:bg-blue-950/30">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white"><Users className="size-5" /></div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Become a Guardian</p>
              <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">Opt in to help nearby members when they need support. Your exact location stays private.</p>
              <Link href="/guardian-grid" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-700 dark:text-blue-300">Review settings <ChevronRight className="size-3.5" /></Link>
            </div>
          </div>
        </section>

      {/* Feature Cards */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {features.map((feature, index) => (
          <Link key={feature.title} href={feature.href}>
            <Card
              className="h-32 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in border-0 shadow-md"
              style={{ animationDelay: feature.delay }}
            >
              <CardContent className="p-4 h-full flex flex-col items-center justify-center text-center">
                <div className={`w-12 h-12 rounded-full ${feature.gradient} flex items-center justify-center mb-2`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm text-[#2c3e50] dark:text-white mb-1">{feature.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-tight">{feature.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md">
          <h3 className="font-semibold text-[#2c3e50] dark:text-white mb-3 text-center">Quick Actions</h3>
          <div className="space-y-2">
            <Link href="/guardian">
              <Button
                variant="outline"
                className="w-full justify-start bg-white text-[#2c3e50] border-[#2c3e50] hover:bg-[#2c3e50] hover:text-white"
              >
                <Shield className="w-4 h-4 mr-2" />
                Smart Guardian Mode
              </Button>
            </Link>
            <Link href="/radar">
              <Button
                variant="outline"
                className="w-full justify-start bg-white text-[#2c3e50] border-[#2c3e50] hover:bg-[#2c3e50] hover:text-white"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Live Threat Radar
              </Button>
            </Link>
            <Link href="/guardian-grid">
              <Button
                variant="outline"
                className="w-full justify-start bg-white text-[#2c3e50] border-[#2c3e50] hover:bg-[#2c3e50] hover:text-white"
              >
                <Users className="w-4 h-4 mr-2" />
                Guardian Grid Network
              </Button>
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
