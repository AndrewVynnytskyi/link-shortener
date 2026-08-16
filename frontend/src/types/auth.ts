/** The authenticated user's claims, mirroring the backend's JwtPayload. */
export interface AuthUser {
  sub: string;
  username: string;
  email: string;
}

export interface LoginInput {
  login: string;
  password: string;
}

export interface SignupInput {
  username: string;
  email: string;
  password: string;
}
