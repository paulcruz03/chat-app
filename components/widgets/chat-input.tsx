'use client'
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { initiateChat } from "@/lib/api"
import { useAuth } from "@/contexts/auth";

export default function ChatInput() {
  const { user } = useAuth()
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  async function submit() {
    setIsSubmitted(true)
    if (user) {
      await initiateChat(await user.getIdToken(), message)
    }
    setIsSubmitted(false)
  }

  return (
    <Card className="w-full mx-10 lg:max-w-xl">
      <CardHeader>
        <CardTitle className="text-center">
          <h2 className="text-2xl">
            Ask me everything
          </h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Type your message here."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button onClick={() => submit()} disabled={isSubmitted} type="submit" className="w-full">
          {isSubmitted ? <span className="flex items-center gap-2">
              <Loader2 className="animate-spin" />
              Please wait
          </span> : <span>Send message</span>}
        </Button>
      </CardFooter>
    </Card>
  )
}