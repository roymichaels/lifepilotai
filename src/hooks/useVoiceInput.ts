import { useState, useRef, useCallback } from 'react'
import api from '@/api/api'

export function useVoiceInput() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<any>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const start = useCallback(async () => {
    if (isRecording) return
    if ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) {
      const Rec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new Rec()
      recognition.lang = 'en-US'
      recognition.interimResults = false
      recognition.onresult = e => {
        const text = Array.from(e.results).map(r => r[0].transcript).join(' ')
        setTranscript(text)
      }
      recognition.onend = () => setIsRecording(false)
      recognition.onerror = () => setIsRecording(false)
      recognition.start()
      recognitionRef.current = recognition
      setIsRecording(true)
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const recorder = new MediaRecorder(stream)
        chunksRef.current = []
        recorder.ondataavailable = e => {
          if (e.data.size > 0) chunksRef.current.push(e.data)
        }
        recorder.onstop = async () => {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
          try {
            const formData = new FormData()
            formData.append('file', blob, 'recording.webm')
            const res = await api.post('/ai/whisper', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            })
            if (res.data?.text) setTranscript(res.data.text)
          } catch (err) {
            console.error('Whisper transcription failed', err)
          }
          setIsRecording(false)
        }
        recorder.start()
        mediaRecorderRef.current = recorder
        setIsRecording(true)
      } catch (err) {
        console.error('Unable to access microphone', err)
      }
    }
  }, [isRecording])

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
    recognitionRef.current = null
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current = null
    }
  }, [])

  return { startRecording: start, stopRecording: stop, transcript, setTranscript, isRecording }
}
