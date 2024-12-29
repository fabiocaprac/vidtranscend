import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { GoogleGenerativeAI } from '@google/generative-ai'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { transcription } = await req.json()

    if (!transcription) {
      return new Response(
        JSON.stringify({ error: 'Transcription is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `
      Analyze this video transcription and create a hierarchical summary suitable for a mind map.
      Format the response as a JSON object with this structure:
      {
        "text": "Main Topic",
        "children": [
          {
            "text": "Subtopic 1",
            "children": [
              { "text": "Point 1" },
              { "text": "Point 2" }
            ]
          }
        ]
      }
      
      Here's the transcription:
      ${transcription}
    `

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    const summary = JSON.parse(text)

    return new Response(
      JSON.stringify({ summary }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})