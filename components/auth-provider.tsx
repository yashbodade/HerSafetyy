"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useMemo } from "react"
import { createClient } from "@/lib/supabase"

interface User {
  id: string
  email?: string
  name?: string
  avatarUrl?: string
  guardianEnabled?: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  updateProfile: (profile: { name?: string; phone?: string }) => Promise<void>
  setGuardianEnabled: (enabled: boolean) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isConfigured: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Memoize the configuration check to prevent re-renders
  const isConfigured = useMemo(() => {
    return !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
    )
  }, [])

  // Memoize the supabase client to prevent re-creation
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    if (!isConfigured) {
      // For demo purposes, set a mock user
      setUser({ id: "demo-user", email: "demo@hersafety.app" })
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email, name: session.user.user_metadata?.full_name || session.user.user_metadata?.name, avatarUrl: session.user.user_metadata?.avatar_url, guardianEnabled: session.user.user_metadata?.guardian_enabled ?? false } : null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email, name: session.user.user_metadata?.full_name || session.user.user_metadata?.name, avatarUrl: session.user.user_metadata?.avatar_url, guardianEnabled: session.user.user_metadata?.guardian_enabled ?? false } : null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [isConfigured, supabase.auth])

  const updateProfile = async (profile: { name?: string; phone?: string }) => {
    if (!isConfigured) {
      setUser((current) => current ? { ...current, name: profile.name } : current)
      return
    }
    const { data, error } = await supabase.auth.updateUser({ data: { full_name: profile.name, phone: profile.phone } })
    if (error) throw error
    if (data.user) setUser({ id: data.user.id, email: data.user.email, name: data.user.user_metadata?.full_name, avatarUrl: data.user.user_metadata?.avatar_url, guardianEnabled: data.user.user_metadata?.guardian_enabled ?? false })
  }

  const setGuardianEnabled = async (enabled: boolean) => {
    if (!isConfigured) {
      setUser((current) => current ? { ...current, guardianEnabled: enabled } : current)
      return
    }
    const { data, error } = await supabase.auth.updateUser({ data: { guardian_enabled: enabled } })
    if (error) throw error
    if (data.user) setUser((current) => current ? { ...current, guardianEnabled: enabled } : current)
  }

  const signIn = async (email: string, password: string) => {
    if (!isConfigured) {
      throw new Error("Supabase is not configured. Please add your Supabase credentials.")
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signInWithGoogle = async () => {
    if (!isConfigured) {
      throw new Error("Supabase is not configured. Please connect Supabase to enable Google sign-in.")
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
          `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw error
  }

  const signUp = async (email: string, password: string) => {
    if (!isConfigured) {
      throw new Error("Supabase is not configured. Please add your Supabase credentials.")
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
          `${window.location.origin}/auth/callback`,
      },
    })
    if (error) throw error
  }

  const signOut = async () => {
    if (!isConfigured) {
      setUser(null)
      return
    }
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      updateProfile,
      setGuardianEnabled,
      signIn,
      signInWithGoogle,
      signOut,
      signUp,
      isConfigured,
    }),
    [user, loading, isConfigured],
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
