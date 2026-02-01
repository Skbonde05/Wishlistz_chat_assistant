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

// FAQ/Home Elements
const homeScreen = document.getElementById("homeScreen");
const chatWithUsCard = document.getElementById("chatWithUsCard");
const faqCard = document.getElementById("faqCard");
const chatInputArea = document.getElementById("chatInputArea");
const faqScreen = document.getElementById("faqScreen");
const faqList = document.getElementById("faqList");
const faqSearchInput = document.getElementById("faqSearchInput");
const faqOpenBtn = document.getElementById("faqOpenBtn");
const faqBackBtn = document.getElementById("faqBackBtn");
const chatFooterBrand = document.getElementById("chatFooterBrand");
const quickActionsContainer = document.querySelector(".quick-actions");

// ================= BACKEND CONFIG =================
const BACKEND_CHAT_API = "https://wishlistz-chat-assistant-jysd.onrender.com/api/chat";

// FAQ DATA
const FAQ_QUESTIONS = [
  "How do I create an account on Wishlistz?",
  "How can I add products to my wishlist?",
  "Can I add products from Amazon/Flipkart links?",
  "How do I share my wishlist with friends or family?",
  "How can I remove an item from my wishlist?",
  "Can I create multiple wishlists (Birthday, Wedding, Shopping)?",
  "How do I track price drops for wishlist items?",
  "How do I get product recommendations on Wishlistz?",
  "How do I upload a product image to save it?",
  "What if a product link is not working?",
  "How can I update my profile details?",
  "How do I change my password?",
  "How can I contact Wishlistz support?",
  "Is Wishlistz free to use?",
  "How do I report a wrong product or duplicate listing?",
  "How do I reset or clear my chat?",
  "Is my wishlist private or public?",
  "How do I delete my Wishlistz account?"
];

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
  "📎 Looks like a shirt 👕 Added to your wishlist",
  "✅ Beautiful! Dress saved successfully.",
  "✨ Men's product added 👔.",
  "🎨 Product image saved to wishlist ❤️!"
];

const imageResponses = [
  "✅ Looks like a shirt 👕 Added to your wishlist",
  "📸 Beautiful! Dress saved successfully.",
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
  "add to wishlist": "❤️",
  "show me more": "👀",
  "share with friend": "📤",
  "chat with us": "💬",
  "frequently asked questions": "❓",

  // General
  "yes": "✅",
  "no": "❌",
  "maybe": "🤔",
  "help": "🆘",
  "search": "🔍",
  "price": "💰",
  "rating": "⭐",
  "buy": "🛒",
  "save": "💾",
  "share": "📤",
  "like": "❤️"
};

// ================= HELPERS =================
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
  setTimeout(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 100);
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

// ================= MESSAGE FUNCTIONS =================
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

function addImageMessage(imageSrc, isUser = false) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';

  const img = document.createElement('img');
  img.src = imageSrc;
  img.className = 'message-image';
  img.alt = 'Uploaded image';
  img.loading = 'lazy';

  // Add error handling for image
  img.onerror = function() {
    this.src = 'https://via.placeholder.com/150x150/1e293b/94a3b8?text=Image';
  };

  const messageTime = document.createElement('span');
  messageTime.className = 'message-time';
  messageTime.textContent = getCurrentTime();

  messageContent.appendChild(img);
  messageContent.appendChild(messageTime);
  messageDiv.appendChild(messageContent);
  chatMessages.appendChild(messageDiv);

  scrollToBottom();
}

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

// ================= TYPING INDICATOR =================
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

// ================= QUICK ACTIONS =================
function getEmojiForOption(option) {
  const cleanOption = option.toLowerCase().trim();

  // Exact match
  if (QUICK_ACTION_EMOJIS[cleanOption]) {
    return QUICK_ACTION_EMOJIS[cleanOption];
  }

  // Remove existing emojis
  const optionWithoutEmoji = cleanOption.replace(/[^\w\s]/gi, '').trim();

  // Partial match
  for (const [key, emoji] of Object.entries(QUICK_ACTION_EMOJIS)) {
    if (optionWithoutEmoji.includes(key) || key.includes(optionWithoutEmoji)) {
      return emoji;
    }

    // Word matching
    const optionWords = optionWithoutEmoji.split(/\s+/);
    const keyWords = key.split(/\s+/);

    const matchingWords = keyWords.filter(word =>
      optionWords.some(optWord => optWord.includes(word) || word.includes(optWord))
    );

    if (matchingWords.length >= Math.max(1, keyWords.length - 1)) {
      return emoji;
    }
  }

  return "";
}

function updateQuickActions(options = []) {
  if (!quickActionsContainer) return;

  quickActionsContainer.innerHTML = "";

  if (options.length === 0) {
    quickActionsContainer.classList.add('hidden');
    return;
  }

  quickActionsContainer.classList.remove('hidden');
  quickActionsContainer.style.display = 'flex';

  options.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "quick-action";

    const emoji = getEmojiForOption(option);
    const cleanOptionText = option.replace(/[^\w\s]/gi, '').trim();
    btn.textContent = emoji ? `${emoji} ${cleanOptionText}` : cleanOptionText;

    btn.onclick = () => {
      messageInput.value = cleanOptionText;
      handleSendMessage();
    };

    quickActionsContainer.appendChild(btn);
  });

  scrollToBottom();
}

// ================= BACKEND CHAT =================
async function getBotResponseFromBackend(userMessage) {
  try {
    const response = await fetch(BACKEND_CHAT_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        message: userMessage,
        userId: "guest_user",
        timestamp: new Date().toISOString()
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

// ================= SCREEN MANAGEMENT =================
function showHomeScreen() {
  homeScreen.style.display = "flex";
  faqScreen.classList.add("hidden");
  if (chatFooterBrand) chatFooterBrand.style.display = "block";
  if (chatInputArea) chatInputArea.classList.add("hidden");
  updateQuickActions([]);

  // Clear any existing messages except home screen
  const messages = chatMessages.querySelectorAll('.message, .planner-cards, .wishlist-cards');
  messages.forEach(msg => {
    if (!msg.classList.contains('home-screen') && !msg.classList.contains('faq-screen')) {
      msg.remove();
    }
  });
}

function openFAQScreen() {
  homeScreen.style.display = "none";
  faqScreen.classList.remove("hidden");
  if (chatFooterBrand) chatFooterBrand.style.display = "none";
  if (chatInputArea) chatInputArea.classList.add("hidden");
  updateQuickActions([]);
  renderFAQList("");
  if (faqSearchInput) {
    faqSearchInput.value = "";
    faqSearchInput.focus();
  }
}

function startChatFlow() {
  // Clear existing content except header
  chatMessages.innerHTML = '';

  // Re-add home screen structure (hidden)
  const tempHome = document.createElement('div');
  tempHome.className = 'home-screen';
  tempHome.style.display = 'none';
  chatMessages.appendChild(tempHome);

  const tempFaq = document.createElement('div');
  tempFaq.className = 'faq-screen hidden';
  chatMessages.appendChild(tempFaq);

  // Show input and hide footer
  if (chatInputArea) chatInputArea.classList.remove("hidden");
  if (chatFooterBrand) chatFooterBrand.style.display = "none";

  // Add welcome messages
  setTimeout(() => {
    addMessage("Welcome to Wishlistz! 👋", false);
    addMessage("I'm here to help you with shopping, gift planning, trip planning, and more! How can I assist you today? 💬", false);
    showDefaultQuickActions();
  }, 300);

  // Focus on input
  setTimeout(() => {
    if (messageInput) {
      messageInput.focus();
    }
  }, 500);
}

// ================= FAQ FUNCTIONS =================
function renderFAQList(filter = "") {
  if (!faqList) return;

  faqList.innerHTML = "";

  const filtered = FAQ_QUESTIONS.filter(q =>
    q.toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) {
    const empty = document.createElement("div");
    empty.className = "faq-item";
    empty.textContent = "No results found. Try a different search term.";
    faqList.appendChild(empty);
    return;
  }

  filtered.forEach(question => {
    const item = document.createElement("div");
    item.className = "faq-item";
    item.textContent = question;

    item.addEventListener("click", () => {
      startChatFlow();
      setTimeout(() => {
        messageInput.value = question;
        handleSendMessage();
      }, 100);
    });

    faqList.appendChild(item);
  });
}

// ================= CHAT HANDLING =================
async function handleSendMessage() {
  const messageText = messageInput.value.trim();
  if (messageText === '') return;

  addMessage(messageText, true);
  messageInput.value = '';
  messageInput.focus();

  sendButton.disabled = true;
  sendButton.style.opacity = '0.5';
  sendButton.style.cursor = 'not-allowed';

  await sendBotResponse(messageText);

  sendButton.disabled = false;
  sendButton.style.opacity = '1';
  sendButton.style.cursor = 'pointer';
}

async function sendBotResponse(userMessage) {
  showTypingIndicator();

  try {
    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));

    const botReply = await getBotResponseFromBackend(userMessage);
    removeTypingIndicator();
    handleBotReply(botReply, userMessage);
  } catch (error) {
    removeTypingIndicator();
    console.error("Error getting bot response:", error);
    addMessage("I'm having trouble connecting right now. Please try again in a moment. ⚠️", false);
    showDefaultQuickActions();
  }
}

function handleBotReply(reply, userMessage = "") {
  updateQuickActions([]);

  if (typeof reply === "string") {
    addMessage(reply, false);
    applyQuickActions(reply);
    return;
  }

  if (reply && reply.type === "PLANNER") {
    renderPlannerResponse(reply);
    updateQuickActions(["Add first one", "Show wishlist", "Reset"]);
    return;
  }

  // Default response
  addMessage("Got it! How else can I help you today? 🤖", false);
  showDefaultQuickActions();
}

function renderPlannerResponse(planner) {
  if (!planner || !planner.title) {
    addMessage("Here are some suggestions for you:", false);
    return;
  }

  addMessage(planner.title, false);

  if (planner.message) {
    addMessage(planner.message, false);
  }

  const container = document.createElement("div");
  container.className = planner.title.includes("Wishlist") ? "wishlist-cards" : "planner-cards";

  const items = planner.items || [];
  if (items.length === 0) {
    addMessage("No items found. Try a different search.", false);
    return;
  }

  items.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = planner.title.includes("Wishlist") ? "wishlist-card" : "planner-card";

    const img = document.createElement('img');
    img.src = item.imageUrl || item.images?.[0] || 'https://via.placeholder.com/150x150/1e293b/94a3b8?text=Product';
    img.alt = item.name || 'Product';
    img.loading = 'lazy';
    img.onerror = function() {
      this.src = 'https://via.placeholder.com/150x150/1e293b/94a3b8?text=Product';
    };

    if (planner.title.includes("Wishlist")) {
      card.innerHTML = `
        <div class="card-index">${index + 1}</div>
        <div class="wishlist-card-content">
          <h4>${item.name || "Product"}</h4>
          ${item.price ? `<p class="price">₹${item.price}</p>` : ""}
        </div>
      `;
      card.insertBefore(img, card.firstChild);
    } else {
      card.innerHTML = `
        <div class="card-index">${index + 1}</div>
        <h4 class="card-title">${item.name || "Product"}</h4>
        ${item.price ? `<p class="price">₹${item.price}</p>` : ""}
        ${item.reason ? `<p class="reason">${item.reason}</p>` : ""}
      `;
      card.insertBefore(img, card.querySelector('.card-title'));
    }

    container.appendChild(card);
  });

  chatMessages.appendChild(container);

  if (planner.followUp) {
    addMessage(planner.followUp, false);
  }

  scrollToBottom();
}

// ================= QUICK ACTIONS LOGIC =================
function showDefaultQuickActions() {
  updateQuickActions([
    "Suggest a gift",
    "Plan a trip",
    "Plan a theme",
    "Browse fashion"
  ]);
}

function applyQuickActions(botText) {
  const text = botText.toLowerCase();

  if (text.includes("who is the gift") || text.includes("gift for")) {
    updateQuickActions(["Friend", "Mother", "Father", "Partner", "Sibling"]);
    return;
  }

  if (text.includes("age") || text.includes("how old")) {
    updateQuickActions(["10", "18", "25", "30", "Skip"]);
    return;
  }

  if (text.includes("budget") || text.includes("price") || text.includes("cost")) {
    updateQuickActions(["1000", "2000", "3000", "5000"]);
    return;
  }

  if (text.includes("travel") || text.includes("trip") || text.includes("destination")) {
    updateQuickActions(["Delhi", "Goa", "Manali", "Bangalore"]);
    return;
  }

  if (text.includes("how many days") || text.includes("duration")) {
    updateQuickActions(["2", "3", "5", "7"]);
    return;
  }

  if (text.includes("season") || text.includes("month") || text.includes("weather")) {
    updateQuickActions(["Summer", "Winter", "Monsoon", "Any"]);
    return;
  }

  if (text.includes("work trip") || text.includes("casual") || text.includes("purpose")) {
    updateQuickActions(["Work", "Casual", "Vacation", "Business"]);
    return;
  }

  if (text.includes("event") || text.includes("occasion")) {
    updateQuickActions(["Birthday", "Wedding", "Anniversary", "Festival"]);
    return;
  }

  if (text.includes("event for") || text.includes("for kids") || text.includes("for adults")) {
    updateQuickActions(["Kids", "Adults", "Mixed", "All ages"]);
    return;
  }

  if (text.includes("vibe") || text.includes("style") || text.includes("theme")) {
    updateQuickActions(["Fun", "Classy", "Traditional", "Modern"]);
    return;
  }

  if (text.includes("image") || text.includes("file") || text.includes("upload") || text.includes("photo")) {
    updateQuickActions(["Show me more", "Add to wishlist", "Share with friend"]);
    return;
  }

  // Default actions
  showDefaultQuickActions();
}

// ================= FILE UPLOAD =================
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    addMessage("❌ File size exceeds 5MB limit. Please choose a smaller file.", true);
    fileInput.value = '';
    return;
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 
                       'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                       'text/plain'];
  if (!allowedTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|pdf|doc|docx|txt)$/i)) {
    addMessage("❌ File type not supported. Please upload images, PDFs, or documents.", true);
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
      addMessage("❌ Failed to read image file. Please try again.", true);
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

// ================= EVENT LISTENERS =================
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
  sendButton.disabled = isEmpty;
  sendButton.style.opacity = isEmpty ? '0.5' : '1';
  sendButton.style.cursor = isEmpty ? 'not-allowed' : 'pointer';
});

// Theme toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  const isLightMode = document.body.classList.contains('light-mode');
  themeToggle.textContent = isLightMode ? '🌞' : '🌓';
  themeToggle.title = isLightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode';
  localStorage.setItem('chatTheme', isLightMode ? 'light' : 'dark');
});

// Open/Close chat
minimizedChat.addEventListener('click', () => {
  chatContainer.style.display = 'flex';
  minimizedChat.classList.add('hidden');

  if (isMobile()) {
    document.body.style.overflow = 'hidden';
  }

  setTimeout(() => {
    if (messageInput && !chatInputArea.classList.contains('hidden')) {
      messageInput.focus();
    }
  }, 300);
});

minimizeButton.addEventListener('click', () => {
  if (isMobile()) {
    document.body.style.overflow = '';
  }
  chatContainer.style.display = 'none';
  minimizedChat.classList.remove('hidden');
});

// FAQ Event Listeners
if (chatWithUsCard) {
  chatWithUsCard.addEventListener("click", startChatFlow);
}

if (faqCard) {
  faqCard.addEventListener("click", openFAQScreen);
}

if (faqOpenBtn) {
  faqOpenBtn.addEventListener("click", openFAQScreen);
}

if (faqBackBtn) {
  faqBackBtn.addEventListener("click", () => {
    showHomeScreen();
  });
}

if (faqSearchInput) {
  faqSearchInput.addEventListener("input", (e) => {
    renderFAQList(e.target.value);
  });

  faqSearchInput.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const firstItem = faqList.querySelector('.faq-item');
      if (firstItem) {
        firstItem.click();
      }
    }
  });
}

// ================= UTILITY FUNCTIONS =================
function isMobile() {
  return window.innerWidth <= 768;
}

function initializeChat() {
  // Load saved theme
  const savedTheme = localStorage.getItem('chatTheme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    themeToggle.textContent = '🌞';
    themeToggle.title = 'Switch to Dark Mode';
  }

  // Initialize FAQ list
  renderFAQList("");

  // Set initial UI state
  showHomeScreen();

  // Auto-open on desktop, minimized on mobile
  if (isMobile()) {
    chatContainer.style.display = 'none';
    minimizedChat.classList.remove('hidden');
  } else {
    chatContainer.style.display = 'flex';
    minimizedChat.classList.add('hidden');
  }

  // Initial send button state
  sendButton.disabled = true;
  sendButton.style.opacity = '0.5';
  sendButton.style.cursor = 'not-allowed';

  // Add CSS for typing indicator if not already present
  if (!document.querySelector('#typing-css')) {
    const style = document.createElement('style');
    style.id = 'typing-css';
    style.textContent = `
      .typing-indicator {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 8px 12px;
      }

      .typing-dot {
        width: 8px;
        height: 8px;
        background: #94a3b8;
        border-radius: 50%;
        animation: typingAnimation 1.4s infinite ease-in-out;
      }

      .typing-dot:nth-child(1) { animation-delay: -0.32s; }
      .typing-dot:nth-child(2) { animation-delay: -0.16s; }

      @keyframes typingAnimation {
        0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
        40% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
}

// Handle window resize
window.addEventListener('resize', () => {
  if (!isMobile() && chatContainer.classList.contains('fullscreen')) {
    chatContainer.classList.remove('fullscreen');
    document.body.style.overflow = '';
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Ctrl + / to focus input
  if (e.ctrlKey && e.key === '/') {
    e.preventDefault();
    if (messageInput && !chatInputArea.classList.contains('hidden')) {
      messageInput.focus();
    }
  }

  // Escape to minimize chat
  if (e.key === 'Escape' && chatContainer.style.display === 'flex') {
    minimizeButton.click();
  }
});

// ================= INITIALIZE =================
document.addEventListener('DOMContentLoaded', initializeChat);

// Handle page visibility
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && messageInput && !chatInputArea.classList.contains('hidden')) {
    messageInput.focus();
  }
});

// Error handling for images
window.addEventListener('error', function(e) {
  if (e.target.tagName === 'IMG') {
    e.target.src = 'https://via.placeholder.com/150x150/1e293b/94a3b8?text=Image';
  }
}, true);