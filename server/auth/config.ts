import type { AuthOptions } from './core/auth'
import { GoogleProvider } from './providers/google'

export const authOptions = {
  cookieKey: 'auth_token',
  providers: {
    /**
     * OAuth2 provider configuration
     *
     * Requirements:
     * - Each provider requires CLIENT_ID and CLIENT_SECRET environment variables
     *   (e.g., DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET)
     *
     * Callback URL:
     * - Set the callback URL for each provider to: {{ BASE_URL }}/api/auth/:provider/callback
     *   (e.g., https://yourdomain.com/api/auth/discord/callback)
     */
    google: new GoogleProvider(),
  },
} satisfies AuthOptions
