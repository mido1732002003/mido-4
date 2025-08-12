'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Mail, Chrome, Loader2 } from 'lucide-react'
import { SITE_NAME } from '@/lib/constants'

export default function SignInPage() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const message = searchParams.get('message')
  const error = searchParams.get('error')
  
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  
  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const result = await signIn('email', {
        email,
        redirect: false,
        callbackUrl,
      })
      
      if (result?.ok) {
        setEmailSent(true)
      }
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  async function handleGoogleSignIn() {
    setIsLoading(true)
    await signIn('google', { callbackUrl })
  }
  
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Sign in to {SITE_NAME}</CardTitle>
        <CardDescription>
          Choose your preferred sign in method
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {message === 'check-email' && (
          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>
              Check your email for a sign in link
            </AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              {error === 'OAuthAccountNotLinked'
                ? 'This email is already associated with another sign in method'
                : 'An error occurred during sign in'}
            </AlertDescription>
          </Alert>
        )}
        
        {emailSent ? (
          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>
              We sent you a magic link to {email}. Check your inbox!
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <form onSubmit={handleEmailSignIn}>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <Button
                type="submit"
                className="mt-4 w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                Sign in with Email
              </Button>
            </form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full"
            >
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>
          </>
        )}
      </CardContent>
      <CardFooter>
        <div className="text-sm text-muted-foreground">
          <Link href="/" className="hover:underline">
            ← Back to home
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}