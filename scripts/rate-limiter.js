class RateLimiter {
  constructor() {
    this.attempts = new Map();
    this.maxAttempts = 5;
    this.timeWindow = 60000; // 1 minute
    this.cleanupInterval = 300000; // 5 minutes
    this.startCleanup();
  }

  async canProcess(key) {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the time window
    const validAttempts = attempts.filter(timestamp => 
      now - timestamp < this.timeWindow
    );
    
    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    return true;
  }

  getTimeUntilReset(key) {
    const attempts = this.attempts.get(key) || [];
    if (attempts.length === 0) return 0;
    
    const oldestAttempt = Math.min(...attempts);
    const timeLeft = this.timeWindow - (Date.now() - oldestAttempt);
    return Math.max(0, timeLeft);
  }

  startCleanup() {
    setInterval(() => {
      const now = Date.now();
      for (const [key, attempts] of this.attempts.entries()) {
        const validAttempts = attempts.filter(timestamp => 
          now - timestamp < this.timeWindow
        );
        
        if (validAttempts.length === 0) {
          this.attempts.delete(key);
        } else {
          this.attempts.set(key, validAttempts);
        }
      }
    }, this.cleanupInterval);
  }
}

// Export for use in other scripts
window.RateLimiter = RateLimiter;
