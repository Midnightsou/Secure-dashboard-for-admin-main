import { fetchWithToken } from "./const.js";

export async function fetchCurrentUser() {
  return fetchWithToken("api/users/current");
}
export async function fetchAllUsers() {
  return fetchWithToken("api/users/");
}

export async function fetchUsersCount() {
  return fetchWithToken("api/users/count");
}

export async function fetchLogs() {
  return fetchWithToken("api/logs");
}

export async function fetchLogsCount() {
  return fetchWithToken("api/logs/count");
}
export async function inviteUser(email) {
  return fetchWithToken("api/users", "POST", { email });
}

export async function deleteUser(id) {
  return fetchWithToken("api/users/" + id, "DELETE");
}

export async function verifyUser(email, token, password) {
  return fetchWithToken(
    "api/admin/verify",
    "POST",
    { email, token, password },
    false
  );
}
