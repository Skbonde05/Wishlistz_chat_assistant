// ================= CLOTHES FLOW STATE =================
let clothesFlowActive = false;
let clothesAnswers = [];
let currentClothesStep = 0;

const clothesQuestions = [
  {
    key: "age",
    text: "Select your age group",
    options: ["18–25", "26–35", "36–45"],
  },
  {
    key: "skinTone",
    text: "Select your skin tone",
    options: ["Fair", "Brown", "Dark"],
  },
  {
    key: "height",
    text: "Select your height",
    options: ["<5.5ft", "5.5–6ft", ">6ft"],
  },
  {
    key: "style",
    text: "Preferred style?",
    options: ["Traditional", "Modern", "Casual"],
  },
  {
    key: "occasion",
    text: "For which occasion?",
    options: ["Festival", "Daily Wear", "Party"],
  },
];

// ================= START FLOW =================
function startClothesFlow() {
  clothesFlowActive = true;
  clothesAnswers = [];
  currentClothesStep = 0;
  askNextClothesQuestion();
}

function askNextClothesQuestion() {
  const step = clothesQuestions[currentClothesStep];
  addMessage(step.text, false);
  updateQuickActions(step.options);
}

// ================= HANDLE STEP ANSWER =================
function handleClothesAnswer(answer) {
  clothesAnswers.push({
    [clothesQuestions[currentClothesStep].key]: answer,
  });

  currentClothesStep++;

  if (currentClothesStep < clothesQuestions.length) {
    askNextClothesQuestion();
    return true;
  }

  clothesFlowActive = false;
  sendClothesDataToBackend();
  return true;
}

// ================= SEND TO BACKEND (Q&A FLOW) =================
async function sendClothesDataToBackend() {
  addMessage("Thanks! Finding best clothing recommendations for you 👗✨", false);

  try {
    const res = await fetch("http://localhost:5000/api/recommend/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "CLOTHES_PREFERENCE",
        data: clothesAnswers,
      }),
    });

    const data = await res.json();

    if (data?.recommendation) {
      addMessage(data.recommendation, false);
    } else {
      addMessage("Here are some outfit ideas picked just for you ✨", false);
    }

    updateQuickActions([]);
  } catch (err) {
    console.error("Clothes Flow Error:", err);
    addMessage("Something went wrong while getting recommendations 😕", false);
    updateQuickActions([]);
  }
}

// ================= DIRECT TEXT DETECTION =================
function isDirectClothesRequest(text) {
  const keywords = [
    "clothes",
    "dress",
    "outfit",
    "party",
    "festival",
    "daily wear",
    "skin tone",
    "suggest",
    "recommend",
  ];

  const lower = text.toLowerCase();
  return keywords.some(word => lower.includes(word));
}

// ================= SEND TO BACKEND (FREE TEXT) =================
async function sendDirectClothesQuery(userText) {
  addMessage("Analyzing your preferences… 👗✨", false);

  try {
    const res = await fetch("http://localhost:5000/api/recommend/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "CLOTHES_FREE_TEXT",
        message: userText,
      }),
    });

    const data = await res.json();

    if (data?.recommendation) {
      addMessage(data.recommendation, false);
    } else {
      addMessage("Here’s a party outfit that would suit you perfectly ✨", false);
    }

    updateQuickActions([]);
  } catch (err) {
    console.error("Direct Clothes Error:", err);
    addMessage("Unable to get outfit suggestions right now 😕", false);
    updateQuickActions([]);
  }
}

// ================= EXPOSE TO GLOBAL =================
window.startClothesFlow = startClothesFlow;
window.handleClothesAnswer = handleClothesAnswer;
window.isClothesFlowActive = () => clothesFlowActive;
window.isDirectClothesRequest = isDirectClothesRequest;
window.sendDirectClothesQuery = sendDirectClothesQuery;
