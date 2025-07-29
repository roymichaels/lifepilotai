/* @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { sendChatMessage } from '../api/chat'
import { generateWidgets } from '../api/widgets'
import { AuraMemoryService } from '../services/AuraMemoryService'

vi.mock('react', async () => {
  const actual: any = await vi.importActual('react')
  return { ...actual, useEffect: vi.fn() }
})

const updateProject = vi.fn()

vi.mock('../hooks/useProjectStorage', () => ({
  useProjectStorage: () => ({
    activeProject: { id: '1', widgets: [] },
    updateProject
  })
}))

vi.mock('../services/AuraMemoryService', () => ({
  AuraMemoryService: {
    addMessage: vi.fn(),
    getConversation: vi.fn().mockResolvedValue([]),
    getProactiveTips: vi.fn().mockResolvedValue([]),
    startTipScheduler: vi.fn(),
    stopTipScheduler: vi.fn()
  }
}))

vi.mock('../api/chat', () => ({
  sendChatMessage: vi.fn().mockResolvedValue({ message: 'hi' })
}))

vi.mock('../api/widgets', () => ({
  generateWidgets: vi.fn().mockResolvedValue({ widgets: [{ id: 'w1' }] })
}))

vi.mock('../lib/waku', () => ({
  connect: vi.fn(),
  send: vi.fn(),
  listen: vi.fn().mockResolvedValue({ unsubscribe: vi.fn() })
}))

describe('ChatContext', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(React, 'useEffect').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.clearAllTimers()
    ;(React.useEffect as any).mockRestore()
  })

  it('sends message and updates widgets', async () => {
    const mod = await import('../contexts/ChatContext')
    const ChatProvider = mod.ChatProvider
    const useChatContext = mod.useChatContext

  const AuthProvider = (await import('../contexts/AuthContext')).AuthProvider
  const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>
        <ChatProvider>{children}</ChatProvider>
      </AuthProvider>
    )

    const { result } = renderHook(() => useChatContext(), { wrapper })

    await act(async () => {
      await result.current.sendMessage('hello')
      vi.runAllTimers()
    })

    expect(sendChatMessage).toHaveBeenCalledWith('hello')
    expect(generateWidgets).toHaveBeenCalled()
    expect(AuraMemoryService.addMessage).toHaveBeenCalled()
    expect(updateProject).toHaveBeenCalledWith('1', { widgets: [{ id: 'w1' }] })
    expect(result.current.auraState).toBe('idle')
  })
})
