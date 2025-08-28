import type { APIError, Generation, GenerationRequest } from '../types'
import { delay, generateId, generateMockImageUrl } from '../utils/common'

export async function generate(
  request: GenerationRequest,
  signal?: AbortSignal
): Promise<Generation> {
  // Simulate API delay (1-2 seconds)
  const delayTime = Math.random() * 1000 + 1000
  await delay(delayTime)

  // Check if request was aborted
  if (signal?.aborted) {
    throw new Error('Request aborted')
  }

  // 20% chance of error
  const random = Math.random()
  if (random < 0.2) {
    const apiError: APIError = { message: 'Model overloaded' }
    throw new Error(apiError.message)
  }

  const generation: Generation = {
    id: generateId(),
    imageUrl: generateMockImageUrl(request.prompt, request.style),
    prompt: request.prompt,
    style: request.style,
    createdAt: new Date().toISOString(),
  }

  return generation
}
