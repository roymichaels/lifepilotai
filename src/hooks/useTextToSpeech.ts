import { useState, useCallback } from 'react'
import api from '@/api/api'

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const speak = useCallback(async (text: string) => {
    if (!text) return
    try {
      if (import.meta.env.VITE_ELEVENLABS_API_KEY) {
        const response = await api.post('/ai/tts', { text }, { responseType: 'blob' })
        const url = URL.createObjectURL(response.data)
        const audio = new Audio(url)
        setIsSpeaking(true)
        audio.onended = () => {
          setIsSpeaking(false)
          URL.revokeObjectURL(url)
        }
        await audio.play()
      } else {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.onend = () => setIsSpeaking(false)
        setIsSpeaking(true)
        speechSynthesis.speak(utterance)
      }
    } catch (err) {
      console.error('TTS error', err)
      const utter = new SpeechSynthesisUtterance(text)
      utter.onend = () => setIsSpeaking(false)
      setIsSpeaking(true)
      speechSynthesis.speak(utter)
    }
  }, [])

  return { speak, isSpeaking }
}
