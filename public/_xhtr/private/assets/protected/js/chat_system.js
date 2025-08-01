const userListEl = document.getElementById('user-list');
const chatHeaderEl = document.getElementById('chat-header');
const chatMessagesEl = document.getElementById('chat-messages');
const chatFormEl = document.getElementById('chat-form');
const chatInputEl = document.getElementById('chat-input');
let activeUserEmail = null;
let chatUpdateInterval = null;

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
    const res = await fetch(`/api/chat/fetch?email=${encodeURIComponent(email)}`);
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
  messages.forEach(msg => addMessageToChat(msg.sender, msg.message || msg.reply || '[Empty message]'));
  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

function addMessageToChat(sender, text) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.classList.add(sender === 'user' ? 'user' : 'admin');
  div.textContent = text;
  chatMessagesEl.appendChild(div);
}

function getCurrentMessages() {
  return Array.from(chatMessagesEl.children).map(div => ({
    sender: div.classList.contains('user') ? 'user' : 'admin',
    message: div.textContent
  }));
}

function setActiveUser(email) {
  Array.from(userListEl.children).forEach(li => {
    li.classList.toggle('active', li.getAttribute('data-email') === email);
  });
}

async function startChatWithEmail(email) {
  activeUserEmail = email;
  chatHeaderEl.textContent = `Chat with ${email}`;
  chatInputEl.value = '';
  chatFormEl.style.display = 'flex';
  setActiveUser(email);

  const messages = await fetchMessages(email);
  renderMessages(messages);

  if (chatUpdateInterval) clearInterval(chatUpdateInterval);
  chatUpdateInterval = setInterval(async () => {
    try {
      const latestMessages = await fetchMessages(email);
      if (latestMessages.length !== chatMessagesEl.children.length) {
        renderMessages(latestMessages);
      }
    } catch (err) {
      console.error('Error updating messages:', err);
    }
  }, 2000);
}

userListEl.addEventListener('click', async e => {
  if (e.target.tagName !== 'LI') return;
  const email = e.target.getAttribute('data-email');
  if (email === activeUserEmail) return;
  await startChatWithEmail(email);
});

chatFormEl.addEventListener('submit', async e => {
  e.preventDefault();
  const message = chatInputEl.value.trim();
  const csfrm = 1;
  if (!message || !activeUserEmail) return;

  addMessageToChat('admin', message);
  chatInputEl.value = '';

  try {
    const res = await fetch('/api/chat/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_email: activeUserEmail, message, csfrm })
    });

    if (!res.ok) throw new Error('Failed to send message');

    const updatedMessages = await fetchMessages(activeUserEmail);
    renderMessages(updatedMessages);
  } catch (err) {
    console.error(err);
    alert('Failed to send message');
  }
});

(async () => {
  const updateUsers = async () => {
    const users = await fetchUsers();
    renderUserList(users);
    if (users.length > 0) {
      await startChatWithEmail(users[0].email);
    }
  };
  await updateUsers();
  setInterval(updateUsers, 60000);
})();
