'use client'

import { JSX, useEffect, useRef, useState } from "react";
import MarkdownView from 'react-showdown';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/contexts/auth";
import { startChat } from "@/lib/api";
import ChatInput from "@/components/widgets/chat/input";
import { ChatHistory, WsMessage } from "@/schema";
import { Loader2 } from "lucide-react";

function Chat({ mode, text }: { text:string, mode: 'user' | 'model'; }): JSX.Element {
  return <div className={`
    text-white w-2/3 p-4 rounded-md mt-4
    ${mode === 'user' ? 'bg-indigo-900 text-right self-end' : 'bg-indigo-500 text-left w-2/3'}
  `}>
    <MarkdownView
      markdown={text}
      options={{ tables: true, emoji: true }}
    />
  </div>
}

export function ChatUi({ chatId }: { chatId: string }) {
  const chatbox = useRef<null | HTMLDivElement>(null)
  const { user, loading, chats } = useAuth()
  const [isLoading, setIsLoading] = useState(true);
  const [currentChat, setCurretChat] = useState<ChatHistory[]>([])
  const [title, setTitle] = useState<string>('')
  const [ws, setWs] = useState<WebSocket | null>(null)

  useEffect(() => {
    const [activeChat] = chats.filter(chat => (chat.id === chatId))
    if (activeChat && !loading) {
      setTitle(activeChat.title ?? '')
      setCurretChat(activeChat.history ?? [])
      if (user) {
        setWs(startChat(user?.uid, chatId))
        setIsLoading(false)
        if (chatbox.current) {
          scrollToLatest()
        }
      }
    }
  }, [chats, loading])

  useEffect(() => {
    if (ws) {
      ws.onmessage = function(msg){
        const msgData: WsMessage = JSON.parse(msg.data)
        if (msgData.type === 'loading') {
          setIsLoading(true)
        } else {
          setIsLoading(false)
          console.log(currentChat)
          setCurretChat(prev => [...prev, { role: "model", text: msgData.message }])
          scrollToLatest()
        }
        console.log(msgData)
      }
    }
  }, [ws])

  function scrollToLatest() {
    setTimeout(
      () => chatbox.current?.scrollTo({ top: chatbox.current.scrollHeight, behavior: "smooth" }),
      10
    )
  }

  async function submit(message: string) {
    setCurretChat(prev => [...prev, { role: "user", text: message }])
    scrollToLatest()
    ws?.send(message);
  }

  return (
    <>
      <Card className="w-full mx-10 lg:max-w-5xl mb-4">
        <CardHeader>
          <CardTitle className="text-center">
            <h2 className="text-2xl">
              {title}
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent ref={chatbox} className="overflow-y-auto lg:max-h-165 max-h-130 flex flex-col">
          {
            (!user)
              ? <Loader2 className="animate-spin flex self-center justify-self-center m-4" />
              : currentChat.map((e, i) => <Chat key={i} mode={e.role} text={e.text} />)
          }
        </CardContent>
      </Card>
      <ChatInput hideTitle loading={isLoading} submit={submit} />
    </>
  )
}