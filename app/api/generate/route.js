import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const systemPrompt = `
You're a flashcard Creator. Your task is to generate concise and effective flashcards based on the given topic or content. Follow these guidelines:

1. Create clear and concise questions for the front of the flashcard.
2. Provide accurate and Informative answers for the back of the flashcard.
3. Ensure theat each flashcard focuses on a single concept or piece of information.
4. Use simple language to make the flashcards accessible to a wide range of learners.
5. Include a variety of question types, such as definitions, examples, comparisons, and applications.
6. Avoid overly complex or ambiguous phrasing in both questions and answers.
7. When appropriate, mnemonics or memory aids to help reinforce the information.
8. Tailor the difficulty level of the flashcards to the user's specified preferences.
9. If given a body of text, extract the most important and relevant information for the flashcards.
10. Aim to create a balanced set of flashcards that covers the topic comprehensively.
11. Generate only 10 Flashcards.

Remember, the goal is to facilitate effective learning and retention of information through these flashcards.

Return in the following JSON Format
{
  "flashcards": [
        {
            "front": str,
            "back": str
        }
    ]
}
`;

export async function POST(req) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const data = await req.json();

    if (!data.text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-latest',
      systemInstruction: systemPrompt
    });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: data.text }] }]
    });

    const response = await result.response;

    if (!response.candidates || !response.candidates[0]?.content?.parts[0]?.text) {
      throw new Error('Invalid response from API');
    }

    const responseText = response.candidates[0].content.parts[0].text;
    const cleanText = responseText.replace(/```json\n?|```/g, '').trim();

    try {
      const flashcards = JSON.parse(cleanText);
      return NextResponse.json(flashcards.flashcards || []);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return NextResponse.json({ error: 'Failed to parse API response' }, { status: 500 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Internal server error',
        details: error.errorDetails || null
      },
      { status: error.status || 500 }
    );
  }
}
