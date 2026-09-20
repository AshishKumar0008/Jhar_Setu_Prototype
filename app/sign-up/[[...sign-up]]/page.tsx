import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TricolorLine } from "@/components/patterns/tricolor-line";
import { Logo } from "@/components/branding/logo";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA]">
      <header className="sticky top-0 z-40 w-full bg-white border-b border-[#E2E5EA]">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo variant="full" size="sm" />

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#0F62B4] font-medium transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Home / मुख्य पृष्ठ</span>
          </Link>
        </div>
        <TricolorLine />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 my-auto">
        <div className="mb-4 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
            पंजीकरण / Register New Account
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            Create an officer or stakeholder account on JharSetu
          </p>
        </div>
        <SignUp />
      </main>
    </div>
  );
}
