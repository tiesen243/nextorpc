import { getBaseUrl } from '@/lib/utils'

export abstract class BaseProvider {
  protected abstract provider: unknown

  public abstract createAuthorizationURL(
    state: string,
    codeVerifier: string | null,
  ): URL

  public abstract fetchUserData(
    code: string,
    codeVerifier: string | null,
  ): Promise<{
    providerAccountId: string
    providerAccountName: string
    email: string
    image: string
  }>

  protected getCallbackUrl(provider: string) {
    const baseUrl = getBaseUrl()
    return `${baseUrl}/api/auth/${provider}/callback`
  }
}
