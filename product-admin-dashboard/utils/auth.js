export function isLoggedIn() {
  return typeof window !== "undefined" && Boolean(localStorage.getItem("token"));
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
