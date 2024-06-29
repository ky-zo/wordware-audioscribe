'use server'
import Replicate from 'replicate'
const replicate = new Replicate()

type IncrediblyFastWhisperOutput = {
  text: string
  chunks: {
    timestamp: [number, number]
    text: string
  }[]
}

export const transcribe = async ({ publicURL }: { publicURL: string }) => {
  try {
    const output = (await replicate.run('vaibhavs10/incredibly-fast-whisper:3ab86df6c8f54c11309d4d1f930ac292bad43ace52d10c80d87eb258b3c9f79c', {
      input: {
        audio: publicURL,
        batch_size: 24,
        task: 'transcribe',
        timestamp: 'chunk',
      },
    })) as IncrediblyFastWhisperOutput

    const text = output.text

    return { success: true, text: text }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, text: null, error: error.message }
    }
    return { success: false, text: null, error: 'Unknown error' }
  }
}

type OpenAIWhisperOutput = {
  id: number
  end: number
  seek: number
  text: string
  start: number
  tokens: number[]
  avg_logprob: number
  temperature: number
  no_speech_prob: number
  compression_ratio: number
}

export const transcribeWhisper = async ({ publicURL }: { publicURL: string }) => {
  try {
    const output = (await replicate.run('openai/whisper:4d50797290df275329f202e48c76360b3f22b08d28c196cbc54600319435f8d2', {
      input: {
        audio: publicURL,
        model: 'large-v3',
        translate: false,
        temperature: 0,
        transcription: 'plain text',
        suppress_tokens: '-1',
        logprob_threshold: -1,
        no_speech_threshold: 0.6,
        condition_on_previous_text: true,
        compression_ratio_threshold: 2.4,
        temperature_increment_on_fallback: 0.2,
      },
    })) as OpenAIWhisperOutput

    return { success: true, text: output.text }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, text: null, error: error.message }
    }
    return { success: false, text: null, error: 'Unknown error' }
  }
}
