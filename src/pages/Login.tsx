import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { useToast } from '@/hooks/useToast'
import { LogIn } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { loadConfig } from '@/services/ConfigService'
import { setBaseURL } from '@/api/api'

export function Login() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { login } = useAuth()
  const navigate = useNavigate()
  const onLogin = async () => {
    try {
      setLoading(true)
      await login()
      toast({ title: 'Success', description: 'Identity created' })
      const cfg = await loadConfig()
      if (cfg) {
        setBaseURL(cfg.apiBaseUrl)
        navigate('/dashboard')
      } else {
        navigate('/setup')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast({ variant: 'destructive', title: 'Error', description: String(error) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Create a local identity to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Button onClick={onLogin} className="w-full" disabled={loading}>
              {loading ? 'Loading...' : (
                <>
                  <LogIn className="mr-2 h-4 w-4" /> Connect
                </>
              )}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            className="text-sm text-muted-foreground"
            onClick={() => navigate('/register')}
          >
            Need a new identity?
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
