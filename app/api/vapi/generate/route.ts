import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  const body = await request.json();

  const toolCall = body?.message?.toolCalls?.[0];
  const toolCallId = toolCall?.id;
  const { type, role, level, techstack, amount, userid } =
    toolCall?.function?.arguments ?? {};

  try {
    // ✅ NEW: idempotency check — skip if this exact tool call already succeeded
    const existing = await db
      .collection("interviews")
      .where("vapiToolCallId", "==", toolCallId)
      .limit(1)
      .get();

    if (!existing.empty) {
      return Response.json({
        results: [{ toolCallId, result: "Interview already generated." }],
      });
    }

    const { text: questions } = await generateText({
      model: google("gemini-3.8-flash"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
    });

    const cleanedQuestions = questions
      .trim()
      .replace(/^```json\s*/, "")
      .replace(/```$/, "");

    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(","),
      questions: JSON.parse(cleanedQuestions),
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
      vapiToolCallId: toolCallId, // ✅ NEW: store this so we can detect retries next time
    };

    await db.collection("interviews").add(interview);

    return Response.json({
      results: [
        {
          toolCallId,
          result: "The interview has been generated and saved successfully.",
        },
      ],
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      {
        results: [
          {
            toolCallId,
            result: "Sorry, something went wrong generating the interview.",
          },
        ],
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}