export const API_URL = "http://localhost:5001";

export async function fetchWithToken(url, method = "GET", body, noToken) {
  try {
    let token = undefined;

    const headers = {
      "Content-Type": "application/json",
    };

    if (!noToken) {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "index.html";
      }
      headers["Authorization"] = "Bearer " + token;
    }

    const res = await fetch(API_URL + "/" + url, {
      headers,
      method,
      body: JSON.stringify(body),
    });
    if (res.ok) {
      return res.json();
    } else if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "index.html";
    } else {
      throw new Error();
    }
  } catch (ex) {
    console.log(ex);
    throw new Error("Error Fetching values from: " + url);
  }
}
