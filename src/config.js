export const API_CONFIG = {
  baseURL: "http://localhost/buddhism/server/index.php",
  assetBaseURL: "http://localhost/buddhism/server/",
}

export function getApiUrl(action) {
  return `${API_CONFIG.baseURL}?action=${action}`;
} 