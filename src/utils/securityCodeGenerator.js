/**
 * 安全驗證碼產生器
 * 實現日期重組和被11整除的驗證邏輯
 */

/**
 * 產生今日有效的安全驗證碼
 * @returns {string} 安全驗證碼
 */
export const generateSecurityCode = () => {
  // 取得今日日期，格式 MMDD
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  // 重組日期：將月份和日期拆開重組（MMDD -> DDMM）
  const rearranged = day + month; // 例如：9801
  
  // 找出能讓數字被11整除的最小附加位數
  for (let i = 0; i <= 9; i++) {
    const candidate = parseInt(rearranged + i);
    if (candidate % 11 === 0) {
      return candidate.toString();
    }
  }
  
  // 如果單位數不行，嘗試兩位數
  for (let i = 10; i <= 99; i++) {
    const candidate = parseInt(rearranged + String(i).padStart(2, '0'));
    if (candidate % 11 === 0) {
      return candidate.toString();
    }
  }
  
  // 理論上不會到這裡
  return null;
};

/**
 * 驗證安全驗證碼是否有效（前端驗證）
 * @param {string} securityCode - 要驗證的安全碼
 * @returns {object} 驗證結果
 */
export const validateSecurityCode = (securityCode) => {
  if (!securityCode || !isNumeric(securityCode)) {
    return { valid: false, message: '安全驗證碼格式錯誤' };
  }
  
  // 取得今日日期，格式 MMDD
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  // 重組日期：將月份和日期拆開重組（MMDD -> DDMM）
  const rearranged = day + month;
  const baseNumber = parseInt(rearranged);
  
  const providedCode = parseInt(securityCode);
  const codeStr = String(providedCode);
  const rearrangedStr = String(baseNumber);
  
  // 驗證：安全碼必須以重組日期開頭
  if (!codeStr.startsWith(rearrangedStr)) {
    return { valid: false, message: '安全驗證碼錯誤' };
  }
  
  // 驗證：安全碼必須能被11整除
  if (providedCode % 11 !== 0) {
    return { valid: false, message: '安全驗證碼錯誤' };
  }
  
  return { valid: true, message: '安全驗證通過' };
};

/**
 * 檢查字符串是否為數字
 * @param {string} str - 要檢查的字符串
 * @returns {boolean} 是否為數字
 */
const isNumeric = (str) => {
  return !isNaN(str) && !isNaN(parseFloat(str));
};

/**
 * 取得安全驗證相關資訊（用於除錯）
 * @returns {object} 安全驗證資訊
 */
export const getSecurityInfo = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dateString = month + day;
  const rearranged = day + month;
  const validCode = generateSecurityCode();
  
  return {
    today_date: dateString,
    rearranged: rearranged,
    valid_security_code: validCode,
    timestamp: today.toISOString()
  };
};

const securityCodeGenerator = {
  generateSecurityCode,
  validateSecurityCode,
  getSecurityInfo
};

export default securityCodeGenerator;
