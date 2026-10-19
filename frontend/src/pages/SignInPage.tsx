import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link as RouterLink, Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import PasswordField from '../components/PasswordField'
import useAuth from '../hooks/useAuth'
import useIsSlow from '../hooks/useIsSlow'
import {
  validateSignInForm,
  type FormErrors,
  type SignInFormValues,
} from '../utils/validators'
import { getErrorMessage } from '../utils/errors'

// The sign in screen.
export default function SignInPage() {
  const { user, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // after sign up we arrive here with the email that was just used
  const registeredEmail: string = location.state?.registeredEmail ?? ''

  const [values, setValues] = useState<SignInFormValues>({ email: registeredEmail, password: '' })
  const [errors, setErrors] = useState<FormErrors<SignInFormValues>>({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  // true when the server takes long to answer, because it was asleep
  const slow = useIsSlow(submitting)

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  // go back to the page they were trying to open, or the dashboard
  const from = location.state?.from?.pathname || '/dashboard'

  // Keeps what was typed and clears the error of that field.
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    setValues({ ...values, [name]: value })
    setErrors({ ...errors, [name]: undefined })
    setServerError('')
  }

  // Checks the form, then signs the person in.
  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const found = validateSignInForm(values)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      return
    }

    setSubmitting(true)
    try {
      await signIn(values)
      navigate(from, { replace: true })
    } catch (error) {
      setServerError(getErrorMessage(error))
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to see where your money went.">
      <form onSubmit={handleSubmit} noValidate>
        <Stack spacing={2}>
          {serverError && <Alert severity="error">{serverError}</Alert>}
          {slow && (
            <Alert severity="info">The server was asleep and is waking up. This can take up to a minute.</Alert>
          )}
          {registeredEmail && !serverError && (
            <Alert severity="success">Account created. Please sign in.</Alert>
          )}

          <TextField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={handleChange}
            error={Boolean(errors.email)}
            helperText={errors.email}
            fullWidth
          />
          <PasswordField
            label="Password"
            name="password"
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange}
            error={Boolean(errors.password)}
            helperText={errors.password}
            fullWidth
          />

          <Button type="submit" variant="contained" size="large" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </Button>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            New to Retain?{' '}
            <Link component={RouterLink} to="/signup" sx={{ py: 0.75 }}>
              Create an account
            </Link>
          </Typography>
        </Stack>
      </form>
    </AuthLayout>
  )
}
