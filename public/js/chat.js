function getUserEmail() {
  return localStorage.getItem('userEmail');
}

function setUserEmail(email) {
  localStorage.setItem('userEmail', email);
}

async function submitEmail() {
  const emailInput = document.getElementById('user-email');
  const email = emailInput.value.trim();
  if (!email || !email.includes('@')) {
    alert('Please enter a valid email.');
    return;
  }

  document.getElementById('email-request').style.display = 'none';
  const currentEmail = getUserEmail();
  if (currentEmail && currentEmail.trim() !== '' && currentEmail.includes('@')) {
    setUserEmail(email);
    await saveEmailToDatabase(email);
    showChatWindow();
    await startChatWithEmail(email);
  } else {
    window.location.href = "https://battorion-ap-is.vercel.app/?email=" + encodeURIComponent(email) + "&chatting=true";
  }
}

async function closeSubmitEmailWindow() {
  document.getElementById('email-request').style.display = 'none';
}

async function saveEmailToDatabase(email) {
  try {
    const res = await fetch('/api/chat/insert-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_email: email })
    });

    const result = await res.json();
    if (!res.ok) {
      console.error('Failed to save email:', result);
    } else {
      console.log('Email saved:', result);
    }
  } catch (error) {
    console.error('Error while saving email:', error);
  }
}

function showChatWindow() {
  document.getElementById('chat-window').style.display = 'flex';
  document.getElementById('chat-toggle-btn').style.display = 'none';
  document.getElementById('chat-input').focus();
}

function hideChatWindow() {
  document.getElementById('chat-window').style.display = 'none';
  document.getElementById('chat-toggle-btn').style.display = 'flex';
  if (window.chatUpdateInterval) {
    clearInterval(window.chatUpdateInterval);
    window.chatUpdateInterval = null;
  }
}

async function startChatWithEmail(email) {
  const chatMessages = document.getElementById('chat-messages');
  chatMessages.innerHTML = '';
  const messages = await fetchMessages(email);
  messages.forEach(m => addMessageToChat(m.sender, m.message));

  if (window.chatUpdateInterval) {
    clearInterval(window.chatUpdateInterval);
  }

  window.chatUpdateInterval = setInterval(async () => {
    const newMessages = await fetchMessages(email);
    if (chatMessages.children.length !== newMessages.length) {
      chatMessages.innerHTML = '';
      newMessages.forEach(m => addMessageToChat(m.sender, m.message));
    }
  }, 500);
}

async function fetchMessages(email) {
  try {
    const res = await fetch(`/api/chat/fetch?email=${encodeURIComponent(email)}`);
    const result = await res.json();
    if (!res.ok) {
      console.error('Failed to fetch messages:', result);
      return [];
    }

    const userMessages = result.data
      .filter(msg => msg.message || msg.reply)
      .map(msg => ({
        sender: msg.sender,
        message: msg.message || msg.reply,
        timestamp: msg.timestamp
      }));

    if (userMessages.length === 0) {
      return [
        {
          sender: 'admin',
          message: `Welcome to support chat!\n${email}`,
          timestamp: new Date().toISOString()
        }
      ];
    }
    return userMessages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

async function sendMessage(email, message) {
  console.log('Send message:', message, 'from email:', email);
  const csfrm = 0;

  try {
    const res = await fetch('/api/chat/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_email: email, message, csfrm })
    });

    const result = await res.json();
    if (!res.ok) {
      console.error('Failed to save message:', result);
    } else {
      console.log('Message saved:', result);
    }
  } catch (error) {
    console.error('Error while saving message:', error);
  }
}

function addMessageToChat(sender, message) {
  const chatMessages = document.getElementById('chat-messages');
  const msgElem = document.createElement('div');
  msgElem.classList.add('message');
  msgElem.classList.add(sender);
  msgElem.textContent = message;
  chatMessages.appendChild(msgElem);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

document.addEventListener('DOMContentLoaded', () => {
  const email = getUserEmail();
  if (email) {
    document.getElementById('chat-toggle-btn').style.display = 'flex';
    document.getElementById('email-request').style.display = 'none';
  } else {
    document.getElementById('chat-toggle-btn').style.display = 'flex';
  }
});

document.getElementById('chat-toggle-btn').addEventListener('click', () => {
  const email = getUserEmail();
  if (!email) {
    document.getElementById('chat-window').style.display = 'none';
    document.getElementById('email-request').style.display = 'block';
    document.getElementById('user-email').focus();
    return;
  }

  document.getElementById('email-request').style.display = 'none';
  showChatWindow();
  startChatWithEmail(email);
});

document.addEventListener('click', (e) => {
  const chatWindow = document.getElementById('chat-window');
  const chatToggleBtn = document.getElementById('chat-toggle-btn');
  const emailRequest = document.getElementById('email-request');
  if (!chatWindow.contains(e.target) && !chatToggleBtn.contains(e.target) && !emailRequest.contains(e.target)) {
    if (chatWindow.style.display === 'flex') {
      hideChatWindow();
    }
  }
});

document.getElementById('chat-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = document.getElementById('chat-input').value.trim();
  if (!message) return;

  const email = getUserEmail();
  if (!email) {
    alert('Missing email. Please reload and enter again.');
    return;
  }

  addMessageToChat('user', message);
  await sendMessage(email, message);
  document.getElementById('chat-input').value = '';
});

