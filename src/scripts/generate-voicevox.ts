/// <reference types="node" />
import { mkdir, writeFile, readFile } from "node:fs/promises"
import { join } from "node:path"
import { z } from "zod"
import type { TimeData, Expression } from "../types"

const VOICEVOX_BASE_URL = "http://localhost:50021"
const SPEAKER_ID = 23 // 23: WhiteCUL, 3: Zundamon
const OUTPUT_DIRECTORY = "public/sound/voice-wav"

const main = async (): Promise<void> => {
  const expressions = await getAllExpressions()

  for (const expression of expressions) {
    await generateVoicevox(expression.hiragana, `${expression.timeId}_${expression.romaji}.wav`)
  }
}

const generateVoicevox = async (text: string, outputFilename: string): Promise<void> => {
  const audioQuery = await createAudioQuery(text)
  configureSlowAndClearPronunciation(audioQuery)
  const audioBuffer = await synthesizeAudio(audioQuery)
  await saveAudioFile(audioBuffer, outputFilename)
}

const configureSlowAndClearPronunciation = (audioQuery: AudioQuery): void => {
  audioQuery.speedScale = 0.7
  audioQuery.pitchScale = 0.0
  audioQuery.intonationScale = 1.0
  audioQuery.volumeScale = 1.0
  audioQuery.prePhonemeLength = 0.1
  audioQuery.postPhonemeLength = 0.1
}

const saveAudioFile = async (audioBuffer: ArrayBuffer, filename: string): Promise<void> => {
  await mkdir(OUTPUT_DIRECTORY, { recursive: true })
  const outputPath = join(OUTPUT_DIRECTORY, filename)
  await writeFile(outputPath, Buffer.from(audioBuffer))
}

const createAudioQuery = async (text: string): Promise<AudioQuery> => {
  const url = new URL("/audio_query", VOICEVOX_BASE_URL)
  url.searchParams.set("text", text)
  url.searchParams.set("speaker", String(SPEAKER_ID))

  const response = await fetch(url, { method: "POST" })

  if (!response.ok) {
    throw new Error(`Failed to create audio query: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return audioQuerySchema.parse(data)
}

const synthesizeAudio = async (audioQuery: AudioQuery): Promise<ArrayBuffer> => {
  const url = new URL("/synthesis", VOICEVOX_BASE_URL)
  url.searchParams.set("speaker", String(SPEAKER_ID))
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(audioQuery),
  })

  if (!response.ok) {
    throw new Error(`Failed to synthesize audio: ${response.status} ${response.statusText}`)
  }

  return response.arrayBuffer()
}


const getAllExpressions = async (): Promise<Array<{ timeId: string, hiragana: string, romaji: string }>> => {
  const { hours, minutes } = await loadTimeData()
  return combineExpressions(hours, minutes)
}

const loadTimeData = async (): Promise<{ hours: TimeData, minutes: TimeData }> => {
  const hoursContent = await readFile("src/data/hours.json", "utf-8")
  const minutesContent = await readFile("src/data/minutes.json", "utf-8")
  const hoursData = JSON.parse(hoursContent) as TimeData
  const minutesData = JSON.parse(minutesContent) as TimeData
  return { hours: hoursData, minutes: minutesData }
}

const combineExpressions = (
  hours: TimeData,
  minutes: TimeData
): Array<Expression & { timeId: string }> => {
  const expressions: Array<Expression & { timeId: string }> = []
  for (const hourKey in hours) {
    for (const minuteKey in minutes) {
      for (const hourExpression of hours[hourKey].expressions) {
        for (const minuteExpression of minutes[minuteKey].expressions) {
          expressions.push({
            timeId: `${hourKey}${minuteKey}`,
            hiragana: `${hourExpression.hiragana}${minuteExpression.hiragana}`,
            romaji: `${hourExpression.romaji} ${minuteExpression.romaji}`.replaceAll(" ", "_"),
          })
        }
      }
    }
  }  
  return expressions
}

const audioQuerySchema = z.object({
  accent_phrases: z.array(z.unknown()),
  speedScale: z.number(),
  pitchScale: z.number(),
  intonationScale: z.number(),
  volumeScale: z.number(),
  prePhonemeLength: z.number(),
  postPhonemeLength: z.number(),
  outputSamplingRate: z.number(),
  outputStereo: z.boolean(),
  kana: z.string().optional(),
})
type AudioQuery = z.infer<typeof audioQuerySchema>

main()
