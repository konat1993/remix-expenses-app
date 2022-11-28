import { Outlet } from '@remix-run/react'
import { MainHeader } from '~/components/navigation'
import { getUserFromSession } from '~/data/auth.server'
import marketingStyles from '~/styles/marketing.css'

const MarketingLayoutWithHomeLayout = () => {
  return (
    <>
      <MainHeader />
      <Outlet />
    </>
  )
}

export function loader({ request }) {
  return getUserFromSession(request)
}

export function links() {
  return [
    { rel: 'stylesheet', href: marketingStyles }
  ]
}

export function headers() {
  return {
    'Cache-Control': 'max-age=3600' // 60 minutes
  }
}

export default MarketingLayoutWithHomeLayout