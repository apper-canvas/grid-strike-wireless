import { createBrowserRouter } from "react-router-dom"
import { Suspense, lazy } from "react"

// Layout
const Layout = lazy(() => import("@/components/organisms/Layout"))

// Pages
const GamePage = lazy(() => import("@/components/pages/GamePage"))
const NotFound = lazy(() => import("@/components/pages/NotFound"))

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-surface">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
      <p className="text-white/70 font-sans">Loading Grid Strike...</p>
    </div>
  </div>
)

const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <GamePage />
      </Suspense>
    )
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFound />
      </Suspense>
    )
  }
]

const routes = [
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Layout />
      </Suspense>
    ),
    children: [...mainRoutes]
  }
]

export const router = createBrowserRouter(routes)