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
import { UserPlus } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export function Register() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()

  const onRegister = async () => {
    try {
      setLoading(true)
      await registerUser()
      toast({ title: 'Success', description: 'Identity created' })
      navigate('/login')
    } catch (error) {
      if (import.meta.env.DEV) console.log('Register error:', error)
      toast({ variant: 'destructive', title: 'Error', description: String(error) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Generate a new identity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Button onClick={onRegister} className="w-full" disabled={loading}>
              {loading ? 'Loading...' : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" /> Create Identity
                </>
              )}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            className="text-sm text-muted-foreground"
            onClick={() => navigate('/login')}
          >
            Return to sign in
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
