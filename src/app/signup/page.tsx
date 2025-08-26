

import { UserAuthForm } from "@/components/shopiggo/UserAuthForm"
import Link from "next/link"
import { AuthLogo, HeaderLogo } from "@/components/shopiggo/Logo"

export default function SignUpPage() {
    return (
        <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
             <div className="absolute left-4 top-4 md:left-8 md:top-8 lg:hidden">
                <HeaderLogo />
            </div>
             <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-primary" />
                <Link href="/" className="relative z-20 flex items-center text-lg font-medium">
                    <AuthLogo />
                </Link>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg text-primary-foreground">
                            &ldquo;This platform saved me so much time and helped me find the best deals. The AI assistant is a game-changer!&rdquo;
                        </p>
                        <footer className="text-sm text-primary-foreground/80">Sofia Davis</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight font-headline">
                            Create an account
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your details below to create your account
                        </p>
                    </div>
                    <UserAuthForm isSignUp={true} />
                    <p className="px-8 text-center text-sm text-muted-foreground">
                        By clicking continue, you agree to our{" "}
                        <Link
                            href="/terms"
                            className="hover:text-primary underline underline-offset-4"
                        >
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                            href="/privacy"
                            className="hover:text-primary underline underline-offset-4"
                        >
                            Privacy Policy
                        </Link>
                        .
                    </p>
                     <p className="px-8 text-center text-sm text-muted-foreground">
                        <Link
                            href="/login"
                            className="hover:text-primary underline underline-offset-4"
                        >
                            Already have an account? Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
    
