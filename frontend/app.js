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

// ================= BACKEND CONFIG =================
const BACKEND_CHAT_API = "http://localhost:5000/api/chat";

// Bot Responses
const botResponses = [
  "Men, Women or Kids?",
  "Browse latest fashion 🔥",
  "Great choice!",
  "Added to wishlist ❤️",
  "Item available in all sizes",
  "Check today's offers 💸",
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
  "✨ Men's product added 👔.",
  "🎨 Product image saved to wishlist ❤️!"
];

const imageResponses = [
  "✅Looks like a shirt 👕 Added to your wishlist",
  "📸 Beautiful! dress saved successfully.",
  "✨ Men's product added 👔.",
  "🎨 Product image saved to wishlist ❤️!"
];

const QUICK_ACTION_EMOJIS = {
  // Main actions
  "plan a gift": "🎁",
  "plan a trip": "🧳",
  "plan a theme": "🎨",
  "suggest a gift": "🎁",

  // Gift planner
  "friend": "👫",
  "mother": "👩",
  "father": "👨",
  "partner": "❤️",
  "sibling": "🧑‍🤝‍🧑",

  // Age
  "10": "🧒",
  "18": "🎓",
  "25": "🧑",
  "30": "👨‍💼",
  "skip": "⏭️",

  // Budget
  "1000": "💰",
  "2000": "💰",
  "3000": "💰",
  "5000": "💰",

  // Trip planner
  "delhi": "🏙️",
  "goa": "🏖️",
  "manali": "🏔️",
  "bangalore": "🌆",

  "2": "📆",
  "3": "📆",
  "5": "📆",
  "7": "📆",

  "summer": "☀️",
  "winter": "❄️",
  "monsoon": "🌧️",
  "any": "📅",

  "work": "💼",
  "casual": "😎",

  // Theme planner
  "birthday": "🎂",
  "wedding": "💍",
  "anniversary": "💖",

  "kids": "🧒",
  "adults": "🧑",
  "mixed": "👨‍👩‍👧‍👦",

  "fun": "🎉",
  "classy": "✨",
  "traditional": "🪔",

  // Actions
  "add first one": "➕",
  "show wishlist": "❤️",
  "reset": "🔄",
  
  // Missing emoji mappings - ADDED
  "add to wishlist": "❤️",
  "show me more": "👀",
  "share with friend": "📤"
};

const quickActionsContainer = document.querySelector(".quick-actions");

// FIX: Better emoji matching function
function getEmojiForOption(option) {
  const cleanOption = option.toLowerCase().trim();
  
  // Try exact match first
  if (QUICK_ACTION_EMOJIS[cleanOption]) {
    return QUICK_ACTION_EMOJIS[cleanOption];
  }
  
  // Remove existing emojis from option text for matching
  const optionWithoutEmoji = cleanOption.replace(/[^\w\s]/gi, '').trim();
  
  // Try partial matches
  for (const [key, emoji] of Object.entries(QUICK_ACTION_EMOJIS)) {
    // Check if key is contained in option (or vice versa)
    if (optionWithoutEmoji.includes(key) || key.includes(optionWithoutEmoji)) {
      return emoji;
    }
    
    // Try word-by-word matching for longer phrases
    const optionWords = optionWithoutEmoji.split(/\s+/);
    const keyWords = key.split(/\s+/);
    
    // If option contains most key words
    const matchingWords = keyWords.filter(word => 
      optionWords.some(optWord => optWord.includes(word) || word.includes(optWord))
    );
    
    if (matchingWords.length >= Math.max(1, keyWords.length - 1)) {
      return emoji;
    }
  }
  
  return ""; // No emoji found
}

function updateQuickActions(options = []) {
  if (!quickActionsContainer) return;

  quickActionsContainer.innerHTML = "";
  
  if (options.length === 0) {
    quickActionsContainer.style.display = 'none';
    return;
  }
  
  // Set container styles for horizontal scrolling
  quickActionsContainer.style.display = 'flex';
  quickActionsContainer.style.flexWrap = 'nowrap'; // Important: no wrapping
  quickActionsContainer.style.overflowX = 'auto'; // Enable horizontal scroll
  quickActionsContainer.style.overflowY = 'hidden'; // Disable vertical scroll
  quickActionsContainer.style.gap = '10px'; // Space between buttons
  quickActionsContainer.style.marginTop = '10px';
  quickActionsContainer.style.padding = '10px';
  quickActionsContainer.style.whiteSpace = 'nowrap'; // Prevent text wrapping
  quickActionsContainer.style.scrollbarWidth = 'thin'; // For Firefox
  quickActionsContainer.style.scrollbarColor = '#888 transparent'; // For Firefox
  
  // Hide scrollbar for cleaner look (optional)
  quickActionsContainer.style.msOverflowStyle = 'none'; // IE and Edge
  quickActionsContainer.style.scrollbarWidth = 'none'; // Firefox

  options.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "quick-action";
    
    // Style for horizontal layout
    btn.style.flexShrink = '0'; // Prevent shrinking
    btn.style.whiteSpace = 'nowrap'; // Keep button text on one line
    btn.style.margin = '0'; // Remove margins for tight layout
    btn.style.minWidth = 'max-content'; // Ensure button fits content

    const emoji = getEmojiForOption(option);
    const cleanOptionText = option.replace(/[^\w\s]/gi, '').trim();
    btn.textContent = emoji ? `${emoji} ${cleanOptionText}` : cleanOptionText;

    btn.onclick = () => {
      messageInput.value = cleanOptionText;
      handleSendMessage();
    };

    quickActionsContainer.appendChild(btn);
  });
  
  // Make sure container is visible
  quickActionsContainer.style.display = 'flex';
}

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
    'png': '🖼️',
    'gif': '🖼️',
    'svg': '🖼️',
    'webp': '🖼️'
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
  return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext);
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

// ================= BACKEND CHAT CALL =================
async function getBotResponseFromBackend(userMessage) {
  try {
    const response = await fetch(BACKEND_CHAT_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userMessage,
        userId: "guest_user"
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    return data.reply || getRandomBotResponse();
  } catch (error) {
    console.error("Backend error:", error);
    return getRandomBotResponse();
  }
}

// Add text message
function addMessage(text, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';

  const messageText = document.createElement('p');
  messageText.innerHTML = text.replace(/\n/g, "<br>");

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
  img.loading = 'lazy';

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
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

function handleBotReply(reply) {
  // Clear quick actions first
  updateQuickActions([]);

  if (typeof reply === "string") {
    addMessage(reply, false);
    applyQuickActions(reply);
    return;
  }

  if (reply.type === "PLANNER") {
    renderPlannerResponse(reply);
    updateQuickActions(["Add first one", "Show wishlist", "Reset"]);
    return;
  }

  addMessage("🤖 I'm here to help!", false);
  showDefaultQuickActions();
}

// Bot response logic
async function sendBotResponse(userMessage) {
  showTypingIndicator();

  try {
    const botReply = await getBotResponseFromBackend(userMessage);
    removeTypingIndicator();
    handleBotReply(botReply);
  } catch (error) {
    removeTypingIndicator();
    addMessage(getRandomBotResponse(), false);
    applyQuickActions(userMessage);
  }
}

function renderPlannerResponse(planner) {
  addMessage(planner.title, false);

  if (planner.message) {
    addMessage(planner.message, false);
  }

  const container = document.createElement("div");
  container.className =
    planner.title.includes("Wishlist")
      ? "wishlist-cards"
      : "planner-cards";

  planner.items.forEach((item, index) => {
    const card = document.createElement("div");
    card.className =
      planner.title.includes("Wishlist")
        ? "wishlist-card"
        : "planner-card";

    card.innerHTML = `
      <div class="card-index">${index + 1}</div>
      <img 
        src="${item.imageUrl || item.images?.[0] || 'https://via.placeholder.com/150'}" 
        alt="${item.name || 'Product'}"
      >
      <h4 class="card-title">${item.name || "Product"}</h4>
      ${item.price ? `<p class="price">₹${item.price}</p>` : ""}
      ${item.reason ? `<p class="reason">${item.reason}</p>` : ""}
    `;

    container.appendChild(card);
  });

  chatMessages.appendChild(container);

  if (planner.followUp) {
    addMessage(planner.followUp, false);
  }

  scrollToBottom();
}

// File upload handler
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    addMessage("❌ File size exceeds 5MB limit", true);
    fileInput.value = '';
    return;
  }

  if (isImageFile(file.name)) {
    const reader = new FileReader();
    reader.onload = function(e) {
      addImageMessage(e.target.result, true);
      
      showTypingIndicator();
      setTimeout(() => {
        removeTypingIndicator();
        addMessage(getRandomImageResponse(), false);
        applyQuickActions("image uploaded");
      }, 1000);
    };
    reader.onerror = function() {
      addMessage("❌ Failed to read image file", true);
    };
    reader.readAsDataURL(file);
  } else {
    addFileMessage(file.name, file.size, true);
    
    showTypingIndicator();
    setTimeout(() => {
      removeTypingIndicator();
      addMessage(getRandomFileResponse(), false);
      applyQuickActions("file uploaded");
    }, 1000);
  }

  fileInput.value = '';
}

// Send message
async function handleSendMessage() {
  const messageText = messageInput.value.trim();
  if (messageText === '') return;

  addMessage(messageText, true);
  messageInput.value = '';
  messageInput.focus();
  
  // Reset send button state
  sendButton.style.opacity = '0.5';
  sendButton.style.cursor = 'not-allowed';

  await sendBotResponse(messageText);
}

// Check if mobile
function isMobile() {
  return window.innerWidth <= 768;
}

// Initialize chat - DO NOT CLEAR PREVIOUS MESSAGES
function initializeChat() {
  // DON'T clear chat messages - keep previous messages
  // chatMessages.innerHTML = '';
  
  // Show welcome message if chat is empty
  if (chatMessages.children.length === 0) {
    setTimeout(() => {
      addMessage("Welcome to Wishlistz! How can I help you today? 🛍️", false);
      // Show default quick actions
      showDefaultQuickActions();
    }, 500);
  } else {
    // If there are already messages, just show default quick actions
    showDefaultQuickActions();
  }

  // Set initial send button state
  sendButton.style.opacity = '0.5';
  sendButton.style.cursor = 'not-allowed';

  // Focus input
  messageInput.focus();
}

// Show default quick actions (always show these)
function showDefaultQuickActions() {
  // FIX: Don't include emojis in the text - the emoji system will add them
  updateQuickActions([
    "Suggest a gift",
    "Plan a trip",
    "Plan a theme"
  ]);
}

function applyQuickActions(botText) {
  const text = botText.toLowerCase();

  // 🎁 GIFT PLANNER
  if (text.includes("who is the gift")) {
    updateQuickActions(["Friend", "Mother", "Partner", "Sibling"]);
    return;
  }

  if (text.includes("age")) {
    updateQuickActions(["10", "18", "25", "30", "Skip"]);
    return;
  }

  if (text.includes("budget")) {
    updateQuickActions(["1000", "2000", "3000", "5000"]);
    return;
  }

  // 🧳 TRIP PLANNER
  if (text.includes("traveling to")) {
    updateQuickActions(["Delhi", "Goa", "Manali", "Bangalore"]);
    return;
  }

  if (text.includes("how many days")) {
    updateQuickActions(["2", "3", "5", "7"]);
    return;
  }

  if (text.includes("season") || text.includes("month")) {
    updateQuickActions(["Summer", "Winter", "Monsoon", "Any"]);
    return;
  }

  if (text.includes("work trip") || text.includes("casual")) {
    updateQuickActions(["Work", "Casual"]);
    return;
  }

  // 🎨 THEME PLANNER
  if (text.includes("event")) {
    updateQuickActions(["Birthday", "Wedding", "Anniversary"]);
    return;
  }

  if (text.includes("event for")) {
    updateQuickActions(["Kids", "Adults", "Mixed"]);
    return;
  }

  if (text.includes("vibe")) {
    updateQuickActions(["Fun", "Classy", "Traditional"]);
    return;
  }

  // Image/file responses
  if (text.includes("image") || text.includes("file") || text.includes("upload")) {
    updateQuickActions(["Show me more", "Add to wishlist", "Share with friend"]);
    return;
  }

  // 🔄 RESET / DEFAULT - Show default quick actions when asking for help
  if (text.includes("help you") || text.includes("what would you like") || 
      text.includes("welcome") || text.includes("help today") ||
      text.includes("i'm here to help")) {
    showDefaultQuickActions();
    return;
  }

  // For other responses, show default quick actions
  showDefaultQuickActions();
}

// Event Listeners
attachButton.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', handleFileUpload);

sendButton.addEventListener('click', handleSendMessage);

messageInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    handleSendMessage();
  }
});

messageInput.addEventListener('input', () => {
  const isEmpty = messageInput.value.trim() === '';
  sendButton.style.opacity = isEmpty ? '0.5' : '1';
  sendButton.style.cursor = isEmpty ? 'not-allowed' : 'pointer';
});

// Theme toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  themeToggle.textContent = document.body.classList.contains('light-mode') ? '🌞' : '🌓';
  
  // Save theme preference
  localStorage.setItem('chatTheme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
});

// ================= FULLSCREEN OPEN / CLOSE LOGIC =================
minimizedChat.addEventListener('click', () => {
  chatContainer.style.display = 'flex';
  minimizedChat.classList.add('hidden');
  
  if (isMobile()) {
    chatContainer.classList.add('fullscreen');
  }
  
  // Focus input when opening
  setTimeout(() => {
    messageInput.focus();
  }, 100);
});

minimizeButton.addEventListener('click', () => {
  if (isMobile()) {
    chatContainer.classList.remove('fullscreen');
  }
  chatContainer.style.display = 'none';
  minimizedChat.classList.remove('hidden');
});

// Window resize handler
window.addEventListener('resize', () => {
  if (!isMobile() && chatContainer.classList.contains('fullscreen')) {
    chatContainer.classList.remove('fullscreen');
  }
});

// Load saved theme
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('chatTheme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    themeToggle.textContent = '🌞';
  }
  
  // Initialize chat
  initializeChat();
  
  // Set initial state for mobile
  if (isMobile()) {
    chatContainer.style.display = 'none';
    minimizedChat.classList.remove('hidden');
  } else {
    chatContainer.style.display = 'flex';
    minimizedChat.classList.add('hidden');
  }
});

// Add CSS for horizontal scrolling quick actions
(function injectQuickActionCSS() {
  const styleId = 'quick-action-horizontal-css';
  if (document.getElementById(styleId)) return;
  
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    .quick-actions {
      display: flex;
      flex-wrap: nowrap;
      overflow-x: auto;
      overflow-y: hidden;
      gap: 10px;
      margin-top: 10px;
      padding: 10px;
      white-space: nowrap;
      scrollbar-width: thin;
      scrollbar-color: #888 transparent;
    }
    
    .quick-actions::-webkit-scrollbar {
      height: 6px;
    }
    
    .quick-actions::-webkit-scrollbar-track {
      background: transparent;
      border-radius: 3px;
    }
    
    .quick-actions::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 3px;
    }
    
    .quick-actions::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
    
    .quick-action {
      background: var(--button-bg, #007bff);
      color: white;
      border: none;
      border-radius: 20px;
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;
      flex-shrink: 0;
      min-width: max-content;
    }
    
    .quick-action:hover {
      background: var(--button-hover, #0056b3);
      transform: translateY(-2px);
    }
    
    /* Hide scrollbar for Chrome, Safari and Opera */
    .quick-actions::-webkit-scrollbar {
      display: none;
    }
    
    /* Hide scrollbar for IE, Edge and Firefox */
    .quick-actions {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
    }
    
    /* Show scrollbar on hover */
    .quick-actions:hover::-webkit-scrollbar {
      display: block;
    }
  `;
  document.head.appendChild(style);
})();