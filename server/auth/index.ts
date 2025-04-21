'use server'

import { cache } from 'react'

import { authOptions } from '@/server/auth/config'
import { Auth } from '@/server/auth/core/auth'

const authInstance = new Auth(authOptions)

const handlers = authInstance.handlers.bind(authInstance)
const signOut = authInstance.signOut.bind(authInstance)
const uncachedAuth = authInstance.auth.bind(authInstance)

const auth = cache(uncachedAuth)

export { auth, handlers, signOut }
