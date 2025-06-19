'use client'

import { useEffect, useState } from "react";

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

export function ChatUi({ chatId }: { chatId: string }) {
  const { user, loading, chats } = useAuth()
  const [isLoading, setIsLoading] = useState(true);
  const [currentChat, setCurretChat] = useState<ChatHistory[]>([])
  const [title, setTitle] = useState<string>('')

  useEffect(() => {
    const [activeChat] = chats.filter(chat => (chat.id === chatId))
    if (activeChat) {
      setTitle(activeChat.title ?? '')
      setCurretChat(activeChat.history ?? [])
    }
  }, [chats])

  if (!user) {
    return (<>Invalid Chat</>)
  }
  
  const ws = startChat(user?.uid, chatId)
  
  ws.onmessage = function(msg){
    const msgData: WsMessage = JSON.parse(msg.data)
    if (msgData.type === 'loading') {
      setIsLoading(true)
    } else {
      setIsLoading(false)
      setCurretChat([...currentChat, { role: "model", text: msgData.message }])
    }
    console.log(msgData)
  }

  async function submit(message: string) {
    setCurretChat([...currentChat, { role: "user", text: message }])
    ws.send(message);
  }

  return (
    <>
      <Card className="w-full mx-10 lg:max-w-xl mb-4">
        <CardHeader>
          <CardTitle className="text-center">
            <h2 className="text-2xl">
              {title}
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto h-full">
            Jokester began sneaking into the castle in the middle of the night and leaving
            jokes all over the place: under the king's pillow, in his soup, even in the
            royal toilet. The king was furious, but he couldn't seem to stop Jokester. And
            then, one day, the people of the kingdom discovered that the jokes left by
            Jokester were so funny that they couldn't help but laugh. And once they
            started laughing, they couldn't stop.
            Jokester began sneaking into the castle in the middle of the night and leaving
            jokes all over the place: under the king's pillow, in his soup, even in the
            royal toilet. The king was furious, but he couldn't seem to stop Jokester. And
            then, one day, the people of the kingdom discovered that the jokes left by
            Jokester were so funny that they couldn't help but laugh. And once they
            started laughing, they couldn't stop.
            Jokester began sneaking into the castle in the middle of the night and leaving
            jokes all over the place: under the king's pillow, in his soup, even in the
            royal toilet. The king was furious, but he couldn't seem to stop Jokester. And
            then, one day, the people of the kingdom discovered that the jokes left by
            Jokester were so funny that they couldn't help but laugh. And once they
            started laughing, they couldn't stop.
            Jokester began sneaking into the castle in the middle of the night and leaving
            jokes all over the place: under the king's pillow, in his soup, even in the
            royal toilet. The king was furious, but he couldn't seem to stop Jokester. And
            then, one day, the people of the kingdom discovered that the jokes left by
            Jokester were so funny that they couldn't help but laugh. And once they
            started laughing, they couldn't stop.
        </CardContent>
      </Card>
      <ChatInput hideTitle loading={isLoading} submit={submit} />
    </>
  )
}