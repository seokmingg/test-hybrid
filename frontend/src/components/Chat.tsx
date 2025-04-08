'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Chat() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const queryClient = useQueryClient()

  const { mutate: sendMessage, isLoading } = useMutation({
    mutationFn: async (message: string) => {
      const response = await axios.post('/api/chat', { message })
      return response.data
    },
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }])
      setInput('')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

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
        {isLoading && (
          <div className="text-center text-gray-500">Thinking...</div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-lg"
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          disabled={isLoading}
        >
          Send
        </button>
      </form>
    </div>
  )
} 