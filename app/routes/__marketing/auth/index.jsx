import { AuthForm } from '~/components/auth'
import { login, signup } from '~/data/auth.server'
import { validateCredentials } from '~/data/validation.server'
import authStyles from '~/styles/auth.css'

const AuthPage = () => {
  return (<AuthForm />)
}

export async function action({ request }) {
  const searchParams = new URL(request.url).searchParams
  const authMode = searchParams.get('mode') || 'login'
  const formData = await request.formData()
  const credentials = Object.fromEntries(formData)

  try {
    validateCredentials(credentials)
  } catch (error) {
    return error
  }

  try {
    if (authMode === 'login') {
      return await login(credentials)
    } else {
      return await signup(credentials)
    }
  } catch (error) {
    if (error.status === 422) {
      return { credentials: error.message }
    }
    if (error.status === 401) {
      return { credentials: error.message }
    }
  }
  return null
}

export function headers({
  actionHeaders,
  loaderHeaders,
  parentHeaders
}) {
  return {
    'Cache-Control': parentHeaders.get('Cache-Control')
  }
}

export function links() {
  return [{ rel: 'stylesheet', href: authStyles }]
}

export default AuthPage