"use client";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-md px-4 py-12">
        <div className="text-center mb-8">
          <div className="skeleton h-10 w-56 mx-auto mb-3" />
          <div className="skeleton h-4 w-64 mx-auto" />
        </div>
        <div className="skeleton h-96" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Registration failed");
          setLoading(false);
          return;
        }
        const signInRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (signInRes?.error) {
          setError("Account created but login failed. Try logging in.");
          setMode("login");
          setLoading(false);
          return;
        }
      } else {
        const res = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (res?.error) {
          setError("Invalid email or password");
          setLoading(false);
          return;
        }
      }
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md animate-pop">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-black">
              G
            </span>
            GATE CS Prep
          </Link>
          <p className="text-muted-foreground text-sm">
            {mode === "login"
              ? "Sign in to track your progress"
              : "Create an account to start tracking"}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-lg">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="animate-slide-down">
                <label className="block text-sm font-medium mb-1.5">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  placeholder="Your name"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                placeholder={mode === "register" ? "Min. 6 characters" : "Your password"}
              />
            </div>

            {error && (
              <p key={error} className="animate-shake text-sm text-error bg-error/10 border border-error/20 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-press w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Please wait...
                </span>
              ) : mode === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => { setMode("register"); setError(""); setName(""); setEmail(""); setPassword(""); }}
                  className="text-primary font-medium hover:underline"
                >
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => { setMode("login"); setError(""); setName(""); setEmail(""); setPassword(""); }}
                  className="text-primary font-medium hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          <Link href="/" className="hover:underline">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
