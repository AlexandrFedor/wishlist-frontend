const ACCESS_TOKEN_COOKIE = "access_token";
const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function setAccessTokenCookie(token: string, maxAge = DEFAULT_MAX_AGE) {
  if (typeof document === "undefined") return;
  const encoded = encodeURIComponent(token);
  document.cookie = `${ACCESS_TOKEN_COOKIE}=${encoded}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

export function clearAccessTokenCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${ACCESS_TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export { ACCESS_TOKEN_COOKIE };
