'use client'

import { JSX, useEffect, useRef, useState } from "react";
import MarkdownView from 'react-showdown';
import { Loader2 } from "lucide-react";

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
import { Skeleton } from "@/components/ui/skeleton";

function Chat({ mode, text }: { text:string, mode: 'user' | 'model'; }): JSX.Element {
  return <div className={`
    text-white w-98 p-4 rounded-md mt-4
    ${mode === 'user' ? 'bg-indigo-900 text-right self-end' : 'bg-indigo-500 text-left'}
  `}>
    <MarkdownView
      className="chat-message"
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
  }, [chats, loading, chatId, user])

  useEffect(() => {
    if (ws) {
      ws.onmessage = function(msg){
        const msgData: WsMessage = JSON.parse(msg.data)
        if (msgData.type === 'loading') {
          setIsLoading(true)
        } else {
          setIsLoading(false)
          setCurretChat(prev => [...prev, { role: "model", text: msgData.message }])
          scrollToLatest()
        }
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
      <Card className="w-full mx-10 lg:max-w-3xl mb-4">
        <CardHeader>
          <CardTitle className="text-center">
            {isLoading && <Skeleton className="h-(--text-2xl) w-1/2 justify-self-center" />}
            <h2 className="text-2xl">
              {title}
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent ref={chatbox} className="overflow-y-auto overflow-x-hidden md:max-h-[40vh] max-h-[40vh] flex flex-col">
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