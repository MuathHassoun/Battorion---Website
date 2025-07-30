(function () {
  function injectHTMLAndCSS() {
    const style = document.createElement('style');
    style.textContent = `
      * {
        box-sizing: border-box;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      body, html {
        height: 100%;
        margin: 0;
        background: #f0f2f5;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .chat-container {
        display: flex;
        width: 900px;
        height: 650px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        overflow: hidden;
      }
      .sidebar {
        width: 280px;
        background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        color: #fff;
        display: flex;
        flex-direction: column;
      }
      .sidebar-header {
        padding: 25px;
        font-size: 22px;
        font-weight: 700;
        text-align: center;
        border-bottom: 1px solid rgba(255,255,255,0.2);
        user-select: none;
      }
      .user-list {
        flex: 1;
        overflow-y: auto;
        padding: 0;
        margin: 0;
        list-style: none;
      }
      .user-list li {
        padding: 15px 20px;
        cursor: pointer;
        border-bottom: 1px solid rgba(255,255,255,0.15);
        transition: background-color 0.3s;
        font-weight: 600;
        font-size: 15px;
      }
      .user-list li:hover {
        background-color: rgba(255,255,255,0.15);
      }
      .user-list li.active {
        background-color: #ff6a00;
        box-shadow: inset 5px 0 0 0 #fff;
      }
      .chat-box {
        flex: 1;
        display: flex;
        flex-direction: column;
        background: #fafafa;
      }
      .chat-header {
        padding: 20px 25px;
        font-size: 20px;
        font-weight: 700;
        border-bottom: 1px solid #ddd;
        background: #fff;
        user-select: none;
      }
      .chat-messages {
        flex: 1;
        padding: 20px 25px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 14px;
        background: #fefefe;
      }
      .message {
        max-width: 65%;
        padding: 12px 18px;
        border-radius: 20px;
        line-height: 1.4;
        word-wrap: break-word;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        font-size: 15px;
        position: relative;
      }
      .message.user {
        background: #ff6a00;
        color: #fff;
        align-self: flex-end;
        border-bottom-right-radius: 4px;
      }
      .message.admin {
        background: #e0e0e0;
        color: #333;
        align-self: flex-start;
        border-bottom-left-radius: 4px;
      }
      .chat-input-container {
        display: flex;
        gap: 15px;
        padding: 15px 25px;
        background: #fff;
        border-top: 1px solid #ddd;
      }
      .chat-input-container input[type="text"] {
        flex: 1;
        padding: 12px 20px;
        border-radius: 30px;
        border: 1px solid #ccc;
        font-size: 16px;
        outline: none;
        transition: border-color 0.3s;
      }
      .chat-input-container input[type="text"]:focus {
        border-color: #ff6a00;
      }
      .chat-input-container button {
        padding: 12px 30px;
        border: none;
        border-radius: 30px;
        background: #ff6a00;
        color: white;
        font-weight: 700;
        font-size: 15px;
        cursor: pointer;
        transition: background 0.3s;
      }
      .chat-input-container button:hover {
        background: #e05500;
      }
      @media (max-width: 900px) {
        .chat-container {
          width: 100%;
          height: 100vh;
          flex-direction: column;
        }
        .sidebar {
          width: 100%;
          height: 200px;
        }
        .chat-box {
          flex: 1;
          height: calc(100vh - 200px);
        }
      }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.className = 'chat-container';
    container.innerHTML = `
      <aside class="sidebar">
        <div class="sidebar-header">Users</div>
        <ul class="user-list" id="user-list"></ul>
      </aside>
      <section class="chat-box">
        <header class="chat-header" id="chat-header">Select a user to chat</header>
        <div class="chat-messages" id="chat-messages"></div>
        <form class="chat-input-container" id="chat-form" style="display:none;">
          <input type="text" id="chat-input" placeholder="Type your message..." autocomplete="off" />
          <button type="submit">Send</button>
        </form>
      </section>
    `;
    document.body.innerHTML = '';
    document.body.appendChild(container);
  }

  function setupChatLogic() {
    const userListEl = document.getElementById('user-list');
    const chatHeaderEl = document.getElementById('chat-header');
    const chatMessagesEl = document.getElementById('chat-messages');
    const chatFormEl = document.getElementById('chat-form');
    const chatInputEl = document.getElementById('chat-input');
    let activeUserEmail = null;

    async function fetchUsers() {
      try {
        const res = await fetch('/api/chat/users');
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        return data.users || [];
      } catch (e) {
        console.error(e);
        return [];
      }
    }

    async function fetchMessages(email) {
      try {
        const res = await fetch(`/api/chat/messages?email=${encodeURIComponent(email)}`);
        if (!res.ok) throw new Error('Failed to fetch messages');
        const data = await res.json();
        return data.data || [];
      } catch (e) {
        console.error(e);
        return [];
      }
    }

    function renderUserList(users) {
      userListEl.innerHTML = '';
      users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user.email;
        li.setAttribute('data-email', user.email);
        li.classList.toggle('active', user.email === activeUserEmail);
        userListEl.appendChild(li);
      });
    }

    function renderMessages(messages) {
      chatMessagesEl.innerHTML = '';
      messages.forEach(msg => {
        const div = document.createElement('div');
        div.classList.add('message', msg.sender === 'user' ? 'user' : 'admin');
        div.textContent = msg.message;
        chatMessagesEl.appendChild(div);
      });
      chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
    }

    userListEl.addEventListener('click', async e => {
      if (e.target.tagName !== 'LI') return;
      const email = e.target.getAttribute('data-email');
      if (email === activeUserEmail) return;

      activeUserEmail = email;
      setActiveUser(email);

      chatHeaderEl.textContent = `Chat with ${email}`;
      chatInputEl.value = '';
      chatFormEl.style.display = 'flex';

      const messages = await fetchMessages(email);
      renderMessages(messages);
    });

    function setActiveUser(email) {
      Array.from(userListEl.children).forEach(li => {
        li.classList.toggle('active', li.getAttribute('data-email') === email);
      });
    }

    chatFormEl.addEventListener('submit', async e => {
      e.preventDefault();
      const message = chatInputEl.value.trim();
      if (!message || !activeUserEmail) return;
      renderMessages([...getCurrentMessages(), { sender: 'user', message }]);
      chatInputEl.value = '';

      try {
        const res = await fetch('/api/chat/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_email: activeUserEmail, message })
        });
        if (!res.ok) throw new Error('Failed to send message');
      } catch (err) {
        console.error(err);
        alert('Failed to send message');
      }
    });

    function getCurrentMessages() {
      return Array.from(chatMessagesEl.children).map(div => ({
        sender: div.classList.contains('user') ? 'user' : 'admin',
        message: div.textContent
      }));
    }

    (async () => {
      const users = await fetchUsers();
      renderUserList(users);
      if (users.length > 0) {
        activeUserEmail = users[0].email;
        setActiveUser(activeUserEmail);
        chatHeaderEl.textContent = `Chat with ${activeUserEmail}`;
        chatFormEl.style.display = 'flex';
        const messages = await fetchMessages(activeUserEmail);
        renderMessages(messages);
      }
    })();
  }

  document.addEventListener('DOMContentLoaded', () => {
    injectHTMLAndCSS();
    setupChatLogic();
  });
})();
