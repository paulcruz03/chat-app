'use client'
import { useState } from "react";

import { initiateChat } from "@/lib/api"
import { useAuth } from "@/contexts/auth";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import ChatInput from "@/components/widgets/chat/input";

export default function HomeContent() {
  const { user } = useAuth()
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  async function submit(message: string) {
    setIsSubmitted(true)
    if (user) {
      const response = await initiateChat(await user.getIdToken(), message)
      if (response) {
        redirect(`/chats/${response.chatId}`)
      }
     
      toast.success("Error encountered")
    }
    setIsSubmitted(false)
  }

  return (
    <ChatInput loading={isSubmitted} submit={submit} />
  )
}