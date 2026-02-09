(function() {
  // Configuration
  const config = {
    apiUrl: 'https://your-backend-url.com/api/chat', // ZMĚŇTE NA VAŠE API
    position: 'bottom-right',
    primaryColor: '#6366f1',
    greeting: 'Ahoj! 👋 Jsem AI asistent KompriMAI. Pomohu vám s webovými stránkami. Co potřebujete?'
  };

  // Generate session ID
  const sessionId = 'session_' + Math.random().toString(36).substr(2, 9);
  
  // Create styles
  const styles = document.createElement('style');
  styles.textContent = `
    #komprimai-chatbot {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    #komprimai-chatbot .chat-button {
      width: 70px;
      height: 70px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.5);
      transition: transform 0.3s;
      border: none;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0%, 100% { box-shadow: 0 4px 20px rgba(99, 102, 241, 0.5); }
      50% { box-shadow: 0 4px 30px rgba(99, 102, 241, 0.8); }
    }
    
    #komprimai-chatbot .chat-button:hover {
      transform: scale(1.1);
      animation: none;
    }
    
    #komprimai-chatbot .proactive-message {
      position: absolute;
      bottom: 85px;
      right: 0;
      background: white;
      padding: 15px 20px;
      border-radius: 18px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
      font-size: 14px;
      color: #1e293b;
      width: 280px;
      max-width: 280px;
      white-space: nowrap;
      display: none;
      animation: slideIn 0.3s ease-out;
      border: 2px solid #6366f1;
    }
    
    #komprimai-chatbot .proactive-message::after {
      content: '';
      position: absolute;
      bottom: -10px;
      right: 25px;
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 10px solid #6366f1;
    }
    
    #komprimai-chatbot .proactive-message.show {
      display: block;
    }
    
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    #komprimai-chatbot .chat-window {
      width: 360px;
      height: 500px;
      background: white;
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      display: none;
      flex-direction: column;
      overflow: hidden;
      position: absolute;
      bottom: 80px;
      right: 0;
      border: 1px solid #e2e8f0;
    }
    
    #komprimai-chatbot .chat-window.open {
      display: flex;
    }
    
    #komprimai-chatbot .chat-header {
      background: linear-gradient(135deg, #6366f1, #764ba2);
      color: white;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    #komprimai-chatbot .chat-header .avatar {
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }
    
    #komprimai-chatbot .chat-header .info {
      flex: 1;
    }
    
    #komprimai-chatbot .chat-header .name {
      font-weight: 700;
      font-size: 16px;
    }
    
    #komprimai-chatbot .chat-header .status {
      font-size: 13px;
      opacity: 0.9;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    #komprimai-chatbot .chat-header .status::before {
      content: '';
      width: 8px;
      height: 8px;
      background: #22c55e;
      border-radius: 50%;
      display: inline-block;
    }
    
    #komprimai-chatbot .chat-messages {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      background: #f8fafc;
    }
    
    #komprimai-chatbot .message {
      margin-bottom: 15px;
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }
    
    #komprimai-chatbot .message.bot {
      flex-direction: row;
    }
    
    #komprimai-chatbot .message.user {
      flex-direction: row-reverse;
    }
    
    #komprimai-chatbot .message .bubble {
      max-width: 75%;
      padding: 12px 16px;
      border-radius: 18px;
      font-size: 14px;
      line-height: 1.5;
    }
    
    #komprimai-chatbot .message.bot .bubble {
      background: white;
      color: #1e293b;
      border-bottom-left-radius: 4px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    }
    
    #komprimai-chatbot .message.user .bubble {
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
      border-bottom-right-radius: 4px;
    }
    
    #komprimai-chatbot .chat-input {
      padding: 15px 20px;
      background: white;
      border-top: 1px solid #e2e8f0;
      display: flex;
      gap: 10px;
    }
    
    #komprimai-chatbot .chat-input input {
      flex: 1;
      padding: 12px 16px;
      border: 1px solid #e2e8f0;
      border-radius: 25px;
      font-size: 14px;
      outline: none;
    }
    
    #komprimai-chatbot .chat-input input:focus {
      border-color: #6366f1;
    }
    
    #komprimai-chatbot .chat-input button {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border: none;
      border-radius: 50%;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
    }
    
    #komprimai-chatbot .chat-input button:hover {
      transform: scale(1.05);
    }
    
    #komprimai-chatbot .typing {
      display: flex;
      gap: 4px;
      padding: 12px 16px;
      align-items: center;
    }
    
    #komprimai-chatbot .typing span {
      width: 8px;
      height: 8px;
      background: #cbd5e1;
      border-radius: 50%;
      animation: typing 1.4s infinite;
    }
    
    #komprimai-chatbot .typing span:nth-child(2) { animation-delay: 0.2s; }
    #komprimai-chatbot .typing span:nth-child(3) { animation-delay: 0.4s; }
    
    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-10px); }
    }
  `;
  document.head.appendChild(styles);
  
  // Create chatbot HTML
  const chatbotHTML = `
    <div id="komprimai-chatbot">
      <div class="proactive-message" id="proactiveMsg">
        <strong>👋 Ahoj!</strong><br>
        Chcete web do 3 dnů? 😊
      </div>
      <div class="chat-window" id="chatWindow">
        <div class="chat-header">
          <div class="avatar">🤖</div>
          <div class="info">
            <div class="name">KompriMAI Asistent</div>
            <div class="status">Online</div>
          </div>
        </div>
        <div class="chat-messages" id="chatMessages">
          <div class="message bot">
            <div class="bubble">
              <strong>Ahoj! 👋</strong><br><br>
              Jsem AI asistent <strong>KompriMAI</strong>.<br><br>
              Pomohu vám s moderními webovými stránkami - od jednoduchých prezentací po e-shopy s AI funkcemi.<br><br>
              Máme 3 balíčky od 4 990 Kč s dodáním do 72 hodin.<br><br>
              Co vás zajímá? 💡
            </div>
          </div>
        </div>
        <div class="chat-input">
          <input type="text" id="chatInput" placeholder="Napište zprávu..." autocomplete="off">
          <button id="sendButton">➤</button>
        </div>
      </div>
      <div class="chat-button" id="chatButton">💬</div>
    </div>
  `;
  
  // Append to body
  const wrapper = document.createElement('div');
  wrapper.innerHTML = chatbotHTML;
  document.body.appendChild(wrapper);
  
  // Elements
  const chatButton = document.getElementById('chatButton');
  const chatWindow = document.getElementById('chatWindow');
  const chatInput = document.getElementById('chatInput');
  const sendButton = document.getElementById('sendButton');
  const chatMessages = document.getElementById('chatMessages');
  const proactiveMsg = document.getElementById('proactiveMsg');

  // Proactive message - show after 5 seconds
  setTimeout(() => {
    if (!chatWindow.classList.contains('open')) {
      proactiveMsg.classList.add('show');
    }
  }, 5000);

  // Toggle chat
  chatButton.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    proactiveMsg.classList.remove('show');
    if (chatWindow.classList.contains('open')) {
      chatInput.focus();
    }
  });
  
  // Send message
  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';
    
    // Show typing
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot typing';
    typingDiv.innerHTML = '<div class="bubble"><span></span><span></span><span></span></div>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    try {
      // Call API
      const response = await fetch(config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          sessionId: sessionId
        })
      });
      
      const data = await response.json();
      
      // Remove typing
      typingDiv.remove();
      
      // Add bot response
      if (data.success) {
        addMessage(data.reply, 'bot');
      } else {
        addMessage('Omlouvám se, mám technické potíže. Zkuste to prosím později.', 'bot');
      }
    } catch (error) {
      typingDiv.remove();
      addMessage('Momentálně nejsem dostupný. Napište nám na hello@komprimai.com 📧', 'bot');
      console.error('Chatbot error:', error);
    }
  }
  
  // Add message to chat
  function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `<div class="bubble">${escapeHtml(text)}</div>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  // Escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  // Event listeners
  sendButton.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
  
  console.log('🤖 KompriMAI Chatbot loaded');
})();
