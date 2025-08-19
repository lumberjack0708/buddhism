export const API_CONFIG = {
  // baseURL: "server/index.php",                                  // 正式環境    
  baseURL: "http://localhost/buddhism20250815A/server/index.php",  // 開發環境
}

export function getApiUrl(action) {
  return `${API_CONFIG.baseURL}?action=${action}`;
} 