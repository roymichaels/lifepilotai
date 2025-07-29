/* @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { useVoiceInput } from '../hooks/useVoiceInput'
import { useTextToSpeech } from '../hooks/useTextToSpeech'
vi.mock('../services/ConfigService', () => ({
  loadConfig: vi.fn(async () => ({ elevenLabsApiKey: '' }))
}))

// mock SpeechRecognition
let lastRec: FakeRec | null = null
class FakeRec {
  start = vi.fn()
  stop = vi.fn()
  onresult: any = null
  onend: any = null
  onerror: any = null
  lang = ''
  interimResults = false
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    lastRec = this
  }
}

describe('useVoiceInput', () => {
  it('records using SpeechRecognition', async () => {
    ;(global as any).SpeechRecognition = FakeRec
    const { result } = renderHook(() => useVoiceInput())
    act(() => { result.current.startRecording() })
    expect(lastRec?.start).toHaveBeenCalled()
    act(() => {
      lastRec?.onresult({ results: [[{ transcript: 'hi' }]] } as any)
    })
    expect(result.current.transcript).toBe('hi')
    act(() => { lastRec?.onend() })
    expect(result.current.isRecording).toBe(false)
  })
})

describe('useTextToSpeech', () => {
  it('speaks via browser speech synthesis', async () => {
    ;(global as any).speechSynthesis = { speak: vi.fn() }
    ;(global as any).SpeechSynthesisUtterance = function (this: any, text: string) {
      this.text = text
    }
    const { result } = renderHook(() => useTextToSpeech())
    await act(async () => {
      await result.current.speak('hello')
    })
    expect((global as any).speechSynthesis.speak).toHaveBeenCalled()
    const utter = (global as any).speechSynthesis.speak.mock.calls[0][0]
    act(() => { utter.onend() })
    expect(result.current.isSpeaking).toBe(false)
  })
})
