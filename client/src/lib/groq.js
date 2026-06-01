import { apiRequest } from "./queryClient";




















export const getChatCompletion = async (messages) => {
  try {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("VITE_GROQ_API_KEY is missing in environment variables.");
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        messages,
        model: "llama-3.1-8b-instant"
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || "Failed to get AI response");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting chat completion:", error);
    throw error;
  }
};

// Helper function to prepare chat history
export const prepareChatMessages = (messages) => {
  // Add system message at the beginning if it doesn't exist
  if (messages.length === 0 || messages[0].role !== "system") {
    return [
    {
      role: "system",
      content: "You are GujaratEduBot, a specialized admission assistant for Gujarat colleges in India. You help students with Gujarat university admission requirements, entrance exams like GUJCET, scholarship information specific to Gujarat, and college cutoffs for Gujarat institutions. Always focus your responses on Gujarat-specific educational information. Be helpful, concise, and accurate."
    },
    ...messages];

  }
  return messages;
};