const rateLimitMap = new Map();

export const rateLimit = (identifier, limit = 10, windowMs = 60000) => {
  const now = Date.now();
  const userRequests = rateLimitMap.get(identifier) || [];
  
  const recentRequests = userRequests.filter(time => now - time < windowMs);
  
  if (recentRequests.length >= limit) {
    return { success: false, remaining: 0 };
  }
  
  recentRequests.push(now);
  rateLimitMap.set(identifier, recentRequests);
  
  return { success: true, remaining: limit - recentRequests.length };
};

export const clearOldEntries = () => {
  const now = Date.now();
  for (const [key, requests] of rateLimitMap.entries()) {
    const recent = requests.filter(time => now - time < 60000);
    if (recent.length === 0) {
      rateLimitMap.delete(key);
    } else {
      rateLimitMap.set(key, recent);
    }
  }
};
