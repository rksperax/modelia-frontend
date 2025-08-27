export interface GenerationRequest {
  imageDataUrl: string;
  prompt: string;
  style: string;
}

export interface Generation {
  id: string;
  imageUrl: string;
  prompt: string;
  style: string;
  createdAt: string;
}

export interface APIError {
  message: string;
}
