import { marked } from 'marked';
import { Message } from '../types/chat';
import { ChatService } from '../services/ChatService';

export class Chat {
  private messages: Message[] = [];
  private chatService: ChatService;
  private container: HTMLElement;
  private isProcessing: boolean = false;
  
  constructor(containerId: string) {
    this.chatService = new ChatService();
    this.container = document.getElementById(containerId)!;
    this.initializeUI();
    this.addWelcomeMessage();
  }
  
  private initializeUI(): void {
    this.container.innerHTML = `
      <div class="chat-container">
        <div class="chat-messages"></div>
        <div class="chat-input">
          <textarea 
            placeholder="Ask anything about linear regression! Try: 'What makes JAX special?'" 
            rows="2"
          ></textarea>
          <button>Send</button>
        </div>
      </div>
    `;
    
    const button = this.container.querySelector('button')!;
    const textarea = this.container.querySelector('textarea')!;
    
    button.addEventListener('click', () => this.handleSend());
    textarea.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSend();
      }
    });
  }

  private addWelcomeMessage(): void {
    const welcomeMessage = {
      role: 'assistant' as const,
      content: `👋 Hi! I'm your friendly AI tutor, powered by Llama 2! I'm here to help you understand linear regression and JAX.

Some interesting topics we can explore:
- 🚀 What makes JAX special for machine learning?
- 📊 How does linear regression work?
- ⚡ What is automatic differentiation?
- 🔄 How does gradient descent optimize the model?
- 🧮 What are weights and biases?

Feel free to ask anything - I'll explain it in a simple way!`
    };
    this.addMessage(welcomeMessage);
  }
  
  private async handleSend(): Promise<void> {
    if (this.isProcessing) return;
    
    const textarea = this.container.querySelector('textarea')!;
    const button = this.container.querySelector('button')!;
    const message = textarea.value.trim();
    
    if (!message) return;
    
    try {
      this.isProcessing = true;
      textarea.disabled = true;
      button.disabled = true;
      
      textarea.value = '';
      this.addMessage({ role: 'user', content: message });
      
      const response = await this.chatService.sendMessage(message);
      this.addMessage({ role: 'assistant', content: response });
    } finally {
      this.isProcessing = false;
      textarea.disabled = false;
      button.disabled = false;
      textarea.focus();
    }
  }
  
  private addMessage(message: Message): void {
    this.messages.push(message);
    this.renderMessages();
  }
  
  private renderMessages(): void {
    const messagesDiv = this.container.querySelector('.chat-messages')!;
    messagesDiv.innerHTML = this.messages
      .map(msg => `
        <div class="message ${msg.role}">
          <div class="message-content">
            ${marked(msg.content, { breaks: true })}
          </div>
        </div>
      `)
      .join('');
    
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
}