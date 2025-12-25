const API_URL = "http://192.168.4.2:3000";

// Auth credentials (format: id:token)
const AUTH_HEADER = "root:root";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: AUTH_HEADER,
});

export async function toggleLight() {
  const response = await fetch(`${API_URL}/toggle/light`, {
    method: "POST",
    headers: getHeaders(),
  });
  return response.json();
}

export async function toggleDoor() {
  const response = await fetch(`${API_URL}/toggle/door`, {
    method: "POST",
    headers: getHeaders(),
  });
  return response.json();
}

export async function toggleHeat() {
  const response = await fetch(`${API_URL}/toggle/heat`, {
    method: "POST",
    headers: getHeaders(),
  });
  return response.json();
}

export async function updateTemperature(temp: string) {
  const response = await fetch(`${API_URL}/temp`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ temp }),
  });
  return response.json();
}

export async function getHistory() {
  const response = await fetch(`${API_URL}/history`, {
    method: "GET",
    headers: getHeaders(),
  });
  return response.json();
}
