// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Supabase
jest.mock('@/supabase', () => ({
  useSupabase: () => ({
    supabase: {
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: null, error: null })),
          })),
        })),
        insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
        update: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
      auth: {
        signInWithPassword: jest.fn(),
        signOut: jest.fn(),
        signUp: jest.fn(),
      },
      storage: {
        from: jest.fn(() => ({
          upload: jest.fn(),
          getPublicUrl: jest.fn(() => ({ data: { publicUrl: '' } })),
        })),
      },
    },
  }),
  useUser: () => ({
    user: null,
    profile: null,
    isUserLoading: false,
  }),
  useAuth: () => ({
    signIn: jest.fn(),
    signOut: jest.fn(),
    signUp: jest.fn(),
  }),
}))















