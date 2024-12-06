import { Message } from '../types/chat';

export class ChatService {
  private readonly API_URL = 'http://localhost:11434/api';
  
  async sendMessage(message: string): Promise<string> {
    try {
      const response = await fetch(`${this.API_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama2:latest',
          prompt: `You are a friendly AI tutor helping students understand linear regression and machine learning concepts. 
                  Keep explanations simple, use analogies, and focus on intuitive understanding.
                  Always maintain a friendly, encouraging tone.
                  
                  Context: We're using JAX for accelerated linear regression computations.
                  Key features:
                  - Automatic differentiation
                  - JIT compilation
                  - Vectorized operations
                  
                  User question: ${message}
                  
                  Response (explain as if to a beginner):`,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            top_k: 40,
            num_ctx: 2048
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Chat error:', error);
      return `I'm having trouble connecting to the AI service. Please make sure:
              1. Ollama is installed (https://ollama.ai)
              2. Run 'ollama run llama2:latest' in your terminal
              3. Try again once the model is running`;
    }
  }
}