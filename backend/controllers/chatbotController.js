const askChatbot = async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;

  const fallback = {
    success: true,
    text: "I couldn't find a specific answer. Try browsing our exams page or use the Career Guide for personalized recommendations.",
    links: [
      { label: 'Browse Exams', path: '/exams' },
      { label: 'Career Guide', path: '/ai-guide' },
    ],
  };

  if (!apiKey) {
    return res.status(200).json(fallback);
  }

  const { message, conversationHistory } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ success: false, error: 'Message is required.' });
  }

  const sanitizedMessage = message.substring(0, 1000).replace(/[<>]/g, '');

  const systemInstruction = {
    role: 'user',
    parts: [{ text: 'You are a helpful government exam preparation assistant for GovtExamPath.com, serving Indian aspirants. You are knowledgeable about UPSC, SSC, Banking, Railways, Defence, State PSC, and other government exams in India. Keep your responses concise, limited to 2-3 sentences. When relevant, suggest GovtExamPath features like Career Guide, Eligibility Checker, Mind Maps, Compare Exams, Prep Time Estimator, or Exam Calendar. Do not use markdown formatting in your responses.' }],
  };

  const safeHistory = Array.isArray(conversationHistory)
    ? conversationHistory.slice(-10).map(turn => ({
        role: turn.role,
        parts: [{ text: String(turn.parts?.[0]?.text || '').substring(0, 500) }],
      }))
    : [];

  const contents = [
    systemInstruction,
    { role: 'model', parts: [{ text: 'Understood. I am a government exam preparation assistant for GovtExamPath.com. I will keep my responses concise and helpful.' }] },
    ...safeHistory,
    { role: 'user', parts: [{ text: sanitizedMessage }] },
  ];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
        signal: AbortSignal.timeout(12000),
      }
    );

    if (!response.ok) {
      console.warn('[Chatbot] Gemini API returned', response.status);
      return res.status(200).json(fallback);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(200).json(fallback);
    }

    return res.status(200).json({ success: true, text, links: [] });
  } catch (err) {
    console.error('[Chatbot] Error:', err.message);
    return res.status(200).json(fallback);
  }
};

module.exports = { askChatbot };
