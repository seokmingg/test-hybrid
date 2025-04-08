'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatResponse {
  response: string
}

export default function Chat() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [chatCount, setChatCount] = useState(0)
  const MAX_CHAT_COUNT = 5
  const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

  const { mutate: sendMessage, isPending } = useMutation<ChatResponse, Error, string>({
    mutationFn: async (message: string) => {
      const response = await axios.post(`${API_URL}/chat`, { message })
      return response.data
    },
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }])
      setInput('')
      setChatCount(prev => prev + 1)
    },
    onError: (error) => {
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: error.message || '죄송합니다. 오류가 발생했습니다.'
      }])
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    if (chatCount >= MAX_CHAT_COUNT) {
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: '무료 채팅 횟수가 모두 소진되었습니다. 계속해서 사용하시려면 로그인해주세요.' 
      }])
      return
    }

    const newMessage: Message = { role: 'user', content: input }
    setMessages((prev) => [...prev, newMessage])
    sendMessage(input)
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="bg-white rounded-lg shadow-lg p-4 mb-4 h-96 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isPending && (
          <div className="text-center text-gray-500">응답을 기다리는 중...</div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-lg"
          placeholder={chatCount >= MAX_CHAT_COUNT ? "무료 채팅 횟수가 모두 소진되었습니다." : "메시지를 입력하세요..."}
          disabled={isPending || chatCount >= MAX_CHAT_COUNT}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          disabled={isPending || chatCount >= MAX_CHAT_COUNT}
        >
          전송
        </button>
      </form>
      {chatCount < MAX_CHAT_COUNT && (
        <div className="text-sm text-gray-500 mt-2">
          남은 무료 채팅 횟수: {MAX_CHAT_COUNT - chatCount}회
        </div>
      )}
    </div>
  )
} 