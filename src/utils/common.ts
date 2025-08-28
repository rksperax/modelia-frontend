import { unknownError } from "../constants/validationError";

export function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function generateMockImageUrl(prompt: string, style: string): string {
  // In a real app, this would be the generated image URL

  return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#3B82F6;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="512" height="512" fill="url(#grad)"/>
        <text x="256" y="256" text-anchor="middle" dominant-baseline="middle" 
              fill="white" font-family="Arial" font-size="16" opacity="0.8">
          Generated: ${style}
        </text>
        <text x="256" y="280" text-anchor="middle" dominant-baseline="middle" 
              fill="white" font-family="Arial" font-size="12" opacity="0.6">
          ${prompt.substring(0, 20)}...
        </text>
      </svg>
    `)}`
}


export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error = new Error(unknownError);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxAttempts) {
        throw lastError;
      }

      // Exponential backoff: 1s, 2s, 4s...
      const delayTime = baseDelay * Math.pow(2, attempt - 1);
      await delay(delayTime);
    }
  }

  throw lastError;
}