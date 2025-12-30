// DOM Elements
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatMessages = document.getElementById('chatMessages');
const attachButton = document.getElementById('attachButton');
const fileInput = document.getElementById('fileInput');
const chatContainer = document.getElementById('chatContainer');
const minimizeButton = document.getElementById('minimizeButton');
const minimizedChat = document.getElementById('minimizedChat');
const themeToggle = document.getElementById('themeToggle');
const quickActions = document.querySelectorAll('.quick-action');

// Bot Responses
const botResponses = [
  "Welcome to Wishlistz 🛍️",
  "Men, Women or Kids?",
  "Browse latest fashion 🔥",
  "Great choice!",
  "Added to wishlist ❤️",
  "Item available in all sizes",
  "Check today’s offers 💸",
  "Popular item right now ⭐",
  "View your wishlist anytime",
  "New arrivals are live ✨",
  "Need size help?",
  "More styles available 👗👔",
  "Item saved successfully ✔️",
  "Shop smart with Wishlistz 🛒",
  "What would you like to add?"
];

const fileResponses = [
  "📎Looks like a shirt 👕 Added to your wishlist",
  "✅Beautiful! dress saved successfully.",
  "✨ Men’s product added 👔.",
  "🎨 Product image saved to wishlist ❤️!"
];

const imageResponses = [
  "✅Looks like a shirt 👕 Added to your wishlist",
  "📸 Beautiful! dress saved successfully.",
  "✨ Men’s product added 👔.",
  "🎨 Product image saved to wishlist ❤️!"
];

// Helpers
function getCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutes} ${ampm}`;
}

function getFileExtension(filename) {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
}

function getFileIcon(extension) {
  const iconMap = {
    'pdf': '📄',
    'doc': '📝',
    'docx': '📝',
    'txt': '📃',
    'jpg': '🖼️',
    'jpeg': '🖼️',
    'png': '🖼️'
  };
  return iconMap[extension] || '📎';
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function isImageFile(filename) {
  const ext = getFileExtension(filename);
  return ['jpg', 'jpeg', 'png'].includes(ext);
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getRandomBotResponse() {
  return botResponses[Math.floor(Math.random() * botResponses.length)];
}
function getRandomFileResponse() {
  return fileResponses[Math.floor(Math.random() * fileResponses.length)];
}
function getRandomImageResponse() {
  return imageResponses[Math.floor(Math.random() * imageResponses.length)];
}

// Add text message
function addMessage(text, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';

  const messageText = document.createElement('p');
  messageText.textContent = text;

  const messageTime = document.createElement('span');
  messageTime.className = 'message-time';
  messageTime.textContent = getCurrentTime();

  messageContent.appendChild(messageText);
  messageContent.appendChild(messageTime);
  messageDiv.appendChild(messageContent);
  chatMessages.appendChild(messageDiv);

  scrollToBottom();
}

// Add image message
function addImageMessage(imageSrc, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

  const messageContent = document.createElement('div');
  messageContent.className = 'message-content has-image';

  const img = document.createElement('img');
  img.src = imageSrc;
  img.className = 'message-image';
  img.alt = 'Uploaded image';

  const messageTime = document.createElement('span');
  messageTime.className = 'message-time';
  messageTime.textContent = getCurrentTime();

  messageContent.appendChild(img);
  messageContent.appendChild(messageTime);
  messageDiv.appendChild(messageContent);
  chatMessages.appendChild(messageDiv);

  scrollToBottom();
}

// Add file message
function addFileMessage(fileName, fileSize, isUser = false) {
  const extension = getFileExtension(fileName);
  const icon = getFileIcon(extension);

  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';

  const fileCard = document.createElement('div');
  fileCard.className = 'file-card';

  const fileIcon = document.createElement('div');
  fileIcon.className = 'file-icon';
  fileIcon.textContent = icon;

  const fileInfo = document.createElement('div');
  fileInfo.className = 'file-info';

  const fileNameDiv = document.createElement('div');
  fileNameDiv.className = 'file-name';
  fileNameDiv.textContent = fileName;

  const fileSizeDiv = document.createElement('div');
  fileSizeDiv.className = 'file-size';
  fileSizeDiv.textContent = formatFileSize(fileSize);

  fileInfo.appendChild(fileNameDiv);
  fileInfo.appendChild(fileSizeDiv);
  fileCard.appendChild(fileIcon);
  fileCard.appendChild(fileInfo);

  const messageTime = document.createElement('span');
  messageTime.className = 'message-time';
  messageTime.textContent = getCurrentTime();

  messageContent.appendChild(fileCard);
  messageContent.appendChild(messageTime);
  messageDiv.appendChild(messageContent);
  chatMessages.appendChild(messageDiv);

  scrollToBottom();
}

// Typing indicator
function showTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'message bot-message';
  typingDiv.id = 'typingIndicator';

  const typingContent = document.createElement('div');
  typingContent.className = 'message-content';

  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'typing-indicator';

  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('div');
    dot.className = 'typing-dot';
    typingIndicator.appendChild(dot);
  }

  typingContent.appendChild(typingIndicator);
  typingDiv.appendChild(typingContent);
  chatMessages.appendChild(typingDiv);

  scrollToBottom();
}

function removeTypingIndicator() {
  const typingIndicator = document.getElementById('typingIndicator');
  if (typingIndicator) typingIndicator.remove();
}

// Bot response logic
function sendBotResponse(isFileUpload = false, isImageUpload = false) {
  showTypingIndicator();
  const thinkingTime = Math.random() * 1000 + 1000;
  setTimeout(() => {
    removeTypingIndicator();
    const botMessage = isImageUpload
      ? getRandomImageResponse()
      : isFileUpload
      ? getRandomFileResponse()
      : getRandomBotResponse();
    addMessage(botMessage, false);
  }, thinkingTime);
}

// File upload handler
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (isImageFile(file.name)) {
    const reader = new FileReader();
    reader.onload = function (e) {
      addImageMessage(e.target.result, true);
      sendBotResponse(false, true);
    };
    reader.readAsDataURL(file);
  } else {
    addFileMessage(file.name, file.size, true);
    sendBotResponse(true, false);
  }

  fileInput.value = '';
}

// Send message
function handleSendMessage() {
  const messageText = messageInput.value.trim();
  if (messageText === '') return;

  addMessage(messageText, true);
  messageInput.value = '';
  messageInput.focus();
  sendBotResponse();
}

// Event Listeners
attachButton.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileUpload);
sendButton.addEventListener('click', handleSendMessage);
messageInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') handleSendMessage();
});
window.addEventListener('load', () => {
  messageInput.focus();
  setTimeout(scrollToBottom, 100);
  chatContainer.style.display = 'none';
  minimizedChat.classList.remove('hidden');
});
messageInput.addEventListener('input', () => {
  const isEmpty = messageInput.value.trim() === '';
  sendButton.style.opacity = isEmpty ? '0.5' : '1';
  sendButton.style.cursor = isEmpty ? 'not-allowed' : 'pointer';
});
if (messageInput.value.trim() === '') {
  sendButton.style.opacity = '0.5';
  sendButton.style.cursor = 'not-allowed';
}

// Theme toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  themeToggle.textContent = document.body.classList.contains('light-mode') ? '🌞' : '🌓';
});

// ================= FULLSCREEN OPEN / CLOSE LOGIC =================
function isMobile() {
  return window.innerWidth <= 768;
}

// OPEN CHAT
minimizedChat.addEventListener('click', () => {
  chatContainer.style.display = 'flex';
  minimizedChat.classList.add('hidden');

  // 📱 Mobile → fullscreen
  if (isMobile()) {
    chatContainer.classList.add('fullscreen');
  }
});

// MINIMIZE CHAT
minimizeButton.addEventListener('click', () => {
  chatContainer.classList.remove('fullscreen');
  chatContainer.style.display = 'none';
  minimizedChat.classList.remove('hidden');
});

// Quick actions
quickActions.forEach(button => {
  button.addEventListener('click', () => {
    const text = button.textContent;
    addMessage(text, true);
    sendBotResponse();
  });
});
