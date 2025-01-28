import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
  try {
    const { analysis } = await request.json()

    // Create a concise prompt from the analysis
		const imagePrompt = `Create a visual representation of feedback that is humorous, relatable, and easy to interpret. Use playful characters, metaphors, or analogies that align with the tone of the feedback. For example, if someone’s presentation was too long, depict a group of sleepy sloths in a meeting, or if the energy was amazing, show a rocket ship blasting off with cheering stick figures. Use bright, cheerful colors and a cartoonish or doodle-like style to keep it lighthearted. Ensure that the image conveys actionable insight subtly, while making people smile or chuckle. The goal is to balance joy with useful takeaways.: ${analysis.slice(0, 300)}...`

    const image = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural"
    })

    return NextResponse.json({
      imageUrl: image.data[0].url
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    )
  }
}
