import ChatSession from "../models/ChatSession.js";
import Message from "../models/Message.js";
import Wishlist from "../models/Wishlist.js";

import { detectIntent } from "../utils/intentDetector.js";
import { getIndexFromText } from "../utils/wishlistHelper.js";

import { handleGiftPlanner } from "../services/planner/giftPlanner.service.js";
import { handleTripPlanner } from "../services/planner/tripPlanner.service.js";
import { handleThemePlanner } from "../services/planner/themePlanner.service.js";
import { handleFAQ } from "../services/faq.service.js";

/* ==========================
   BOT REPLY HELPER
========================== */
const sendReply = async (res, userId, reply) => {
  const text =
    typeof reply === "string"
      ? reply
      : reply?.message || JSON.stringify(reply);

  await Message.create({
    userId,
    sender: "bot",
    message: text
  });

  return res.json({ reply });
};

export const chatHandler = async (req, res) => {
  try {
    const message = req.body.message;
    const userId = req.user?.id || req.body.userId || "guest_user";

    /* ==========================
       1️⃣ BASIC VALIDATION
    ========================== */
    if (!message || message.trim().length === 0) {
      return sendReply(res, userId, "Could you please provide a bit more detail? 🙂");
    }

    const userMessage = message.trim();
    const lowerMessage = userMessage.toLowerCase();

    /* ==========================
       SAVE USER MESSAGE
    ========================== */
    await Message.create({
      userId,
      sender: "user",
      message: userMessage
    });

    /* ==========================
       2️⃣ GET OR CREATE SESSION
    ========================== */
    let session = await ChatSession.findOne({ userId });
    if (!session) {
      session = await ChatSession.create({
        userId,
        lastIntent: null,
        context: {}
      });
    }

    /* ==========================
       3️⃣ SESSION TIMEOUT (30 min)
    ========================== */
    const THIRTY_MIN = 30 * 60 * 1000;
    if (Date.now() - new Date(session.updatedAt).getTime() > THIRTY_MIN) {
      session.lastIntent = null;
      session.context = {};
      await session.save();
    }

    /* ==========================
       4️⃣ RESET COMMAND
    ========================== */
    const resetCommands = ["reset", "start over", "clear", "new chat"];
    if (resetCommands.includes(lowerMessage)) {
      session.lastIntent = null;
      session.context = {};
      await session.save();
      return sendReply(res, userId, "🔄 Conversation reset. How can I help you now?");
    }

    /* ==========================
       5️⃣ FAQ (GLOBAL INTERRUPT)
    ========================== */
    const faqReply = handleFAQ(userMessage);
    if (faqReply) {
      return sendReply(res, userId, faqReply);
    }

    /* ==========================
       6️⃣ CONTINUE ACTIVE PLANNERS
    ========================== */
    if (session.lastIntent === "GIFT_PLANNER") {
      const reply = await handleGiftPlanner(userMessage, session);
      return sendReply(res, userId, reply);
    }

    if (session.lastIntent === "TRIP_PLANNER") {
      const reply = await handleTripPlanner(userMessage, session);
      return sendReply(res, userId, reply);
    }

    if (session.lastIntent === "THEME_PLANNER") {
      const reply = await handleThemePlanner(userMessage, session);
      return sendReply(res, userId, reply);
    }

    /* ==========================
       7️⃣ WISHLIST COMMANDS (DB)
    ========================== */

    // ADD ITEM - Fix 1: Move this outside of planner check
    if (lowerMessage.includes("add") && lowerMessage.includes("first")) {
      const items = session.context.lastItems;
      if (!items?.length) {
        return sendReply(res, userId, "There's nothing to add yet 😊");
      }

      const item = items[0];

      await Wishlist.create({
        userId,
        productId: item._id || item.id,
        name: item.name,
        price: item.price,
        images: item.images
      });

      return sendReply(res, userId, `❤️ ${item.name} added to your wishlist.`);
    }

    // ADD ITEM BY INDEX
    if (lowerMessage.includes("add")) {
      const index = getIndexFromText(lowerMessage);
      const lastItems = session.context.lastItems || [];

      if (index === null || !lastItems[index]) {
        return sendReply(
          res,
          userId,
          "Please specify which item to add (first, second, etc.)"
        );
      }

      await Wishlist.findOneAndUpdate(
        { userId },
        { 
          $addToSet: { 
            products: {
              productId: lastItems[index]._id || lastItems[index].id,
              name: lastItems[index].name,
              price: lastItems[index].price,
              images: lastItems[index].images
            }
          } 
        },
        { upsert: true, new: true }
      );

      return sendReply(
        res,
        userId,
        `❤️ ${lastItems[index].name} added to your wishlist.`
      );
    }

    // SHOW WISHLIST - Fix 2: Add SHOW_WISHLIST intent handling
    if (lowerMessage.includes("show my wishlist") || lowerMessage.includes("show wishlist")) {
      const wishlist = await Wishlist.findOne({ userId });

      if (!wishlist || !wishlist.products || wishlist.products.length === 0) {
        return sendReply(res, userId, "📝 Your wishlist is empty.");
      }

      return sendReply(res, userId, {
        type: "PLANNER",
        title: "❤️ Your Wishlist",
        items: wishlist.products.map(p => ({
          name: p.name,
          reason: `₹${p.price}`,
          imageUrl: p.images?.[0] || ""
        }))
      });
    }

    // REMOVE ITEM
    if (lowerMessage.includes("remove")) {
      const index = getIndexFromText(lowerMessage);
      const wishlist = await Wishlist.findOne({ userId });

      if (!wishlist || !wishlist.products || wishlist.products.length === 0) {
        return sendReply(res, userId, "Your wishlist is empty.");
      }

      if (index === null || !wishlist.products[index]) {
        return sendReply(res, userId, "Item not found in your wishlist.");
      }

      // Remove the item at the specified index
      wishlist.products.splice(index, 1);
      await wishlist.save();

      return sendReply(res, userId, "🗑️ Item removed from your wishlist.");
    }

    /* ==========================
       8️⃣ INTENT DETECTION
    ========================== */
    const intent = detectIntent(userMessage);

    // Handle SHOW_WISHLIST intent - Fix 3: Add the requested intent handler
    if (intent === "SHOW_WISHLIST") {
      const wishlist = await Wishlist.findOne({ userId });

      if (!wishlist || !wishlist.products || wishlist.products.length === 0) {
        return sendReply(res, userId, "Your wishlist is empty 💔");
      }

      return sendReply(res, userId, {
        type: "PLANNER",
        title: "❤️ Your Wishlist",
        items: wishlist.products.map(item => ({
          name: item.name,
          price: item.price,
          imageUrl: item.images?.[0] || "",
          reason: `₹${item.price}`
        }))
      });
    }

    /* ==========================
       9️⃣ START NEW PLANNERS
    ========================== */
    if (intent === "GIFT_PLANNER") {
      session.lastIntent = "GIFT_PLANNER";
      session.context = {};
      await session.save();
      return sendReply(res, userId, "🎁 Sure! Who is the gift for?");
    }

    if (intent === "TRIP_PLANNER") {
      session.lastIntent = "TRIP_PLANNER";
      session.context = {};
      await session.save();
      return sendReply(res, userId, "🧳 Sure! Where are you traveling to?");
    }

    if (intent === "THEME_PLANNER") {
      session.lastIntent = "THEME_PLANNER";
      session.context = {};
      await session.save();
      return sendReply(res, userId, "🎨 Sure! What kind of event are you planning?");
    }

    /* ==========================
       10️⃣ ADD_FIRST_ITEM INTENT HANDLING
    ========================== */
    if (intent === "ADD_FIRST_ITEM") {
      const items = session.context.lastItems;
      if (!items?.length) {
        return sendReply(res, userId, "There's nothing to add yet 😊");
      }

      const item = items[0];

      await Wishlist.findOneAndUpdate(
        { userId },
        { 
          $addToSet: { 
            products: {
              productId: item._id || item.id,
              name: item.name,
              price: item.price,
              images: item.images
            }
          } 
        },
        { upsert: true, new: true }
      );

      return sendReply(res, userId, `❤️ ${item.name} added to your wishlist.`);
    }

    /* ==========================
       11️⃣ DEFAULT RESPONSE
    ========================== */
    return sendReply(
      res,
      userId,
      "Hi 👋 I can help you plan gifts 🎁, trips 🧳, or event themes 🎨. What would you like to do?"
    );

  } catch (err) {
    console.error("Chat error:", err);
    return res.status(500).json({
      reply: "⚠️ Something went wrong on the server."
    });
  }
};