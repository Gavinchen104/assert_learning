import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/solid-router'
import { AppShell } from './components/AppShell'
import { Diff } from './pages/Diff'
import { Guidelines } from './pages/Guidelines'
import { Home } from './pages/Home'
import { Review } from './pages/Review'

const rootRoute = createRootRoute({
  component: AppShell,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

const reviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/review',
  component: Review,
})

const diffRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/diff',
  component: Diff,
})

const guidelinesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/guidelines',
  component: Guidelines,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  reviewRoute,
  diffRoute,
  guidelinesRoute,
])

export const router = createRouter({
  routeTree,
})

declare module '@tanstack/solid-router' {
  interface Register {
    router: typeof router
  }
}
