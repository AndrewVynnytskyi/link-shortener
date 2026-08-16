/**
 * Claims embedded in the signed JWT and attached to `req.user` by
 * {@link JwtStrategy}. Deliberately excludes the password hash — never
 * add it back here, it would be shipped to the browser as the cookie
 * value.
 */
export interface JwtPayload {
  sub: string;
  username: string;
  email: string;
}

/**
 * Express augmentation so `req.user` is typed as {@link JwtPayload}
 * wherever a route is guarded by {@link JwtAuthGuard}.
 */

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends JwtPayload {}
  }
}
