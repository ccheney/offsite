import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
  try {
    const { transcript } = await request.json()

    const systemPrompt = `
Read the following meeting transcript in its entirety. Then, provide an analysis that addresses each of the following:

Novel or Unexpected Insights

Identify new or original ideas introduced during the conversation.
Highlight potential opportunities or interesting directions mentioned by the participants.
Emerging Themes or Patterns

Group related discussion points or recurring keywords.
Show how different ideas connect or build upon one another.
Negative Sentiment

Pinpoint moments where participants express frustration, confusion, skepticism, or dissatisfaction.
Discuss the possible causes of these negative feelings and how they might be resolved.
Challenges & Fresh Perspectives

Note any complex issues or bottlenecks that the team encountered.
Suggest how a new approach or additional resources could help address these challenges.
Actionable Next Steps

Outline clear follow-up tasks or recommendations based on your analysis.
Focus on practical actions that could leverage new insights or mitigate the identified challenges.

<meeting-transcript>
${transcript}
</meeting-transcript>
`

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        }
      ],
      model: "gpt-3.5-turbo",
    })

    return NextResponse.json({
      result: completion.choices[0].message.content
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze transcript' },
      { status: 500 }
    )
  }
}
