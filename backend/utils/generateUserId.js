// Generate custom user ID in format: YYYYMMDDHHmmss
// Example: 20250114143025 (January 14, 2025 at 14:30:25)
// If collision occurs, adds milliseconds to ensure uniqueness
export const generateUserId = async (UserModel = null) => {
  const now = new Date();
  
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  let userId = `${year}${month}${day}${hours}${minutes}${seconds}`;
  
  // Check for collision if UserModel is provided
  if (UserModel) {
    let exists = await UserModel.findOne({ userId });
    let attempts = 0;
    const maxAttempts = 100;
    
    // If collision, add milliseconds (3 digits) to make it unique
    while (exists && attempts < maxAttempts) {
      const ms = String(now.getMilliseconds()).padStart(3, '0');
      userId = `${year}${month}${day}${hours}${minutes}${seconds}${ms}`;
      exists = await UserModel.findOne({ userId });
      attempts++;
    }
    
    // If still collision after max attempts, add random suffix
    if (exists) {
      const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      userId = `${year}${month}${day}${hours}${minutes}${seconds}${randomSuffix}`;
    }
  }
  
  return userId;
};

// Validate custom user ID format
export const isValidUserId = (userId) => {
  return /^\d{14}$/.test(userId) && userId.length === 14;
};
