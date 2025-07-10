'use client'
import { KeyboardEvent, useState } from "react";
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

export default function ChatInput({ loading, hideTitle, submit }: { loading: boolean; hideTitle?: boolean; submit: (message: string) => void }) {
  const [message, setMessage] = useState<string>("");

  function onEnterPress(e: KeyboardEvent) {
    if(e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      console.log('here')
      formSubmit();
    }
  }

  function formSubmit() {
    submit(message);
    setMessage('');
  }

  return (
    <Card className="w-full mx-10 lg:max-w-3xl mb-4">
      {!hideTitle && <CardHeader>
        <CardTitle className="text-center">
          <h2 className="text-2xl">
            Ask me everything
          </h2>
        </CardTitle>
      </CardHeader>}
      <CardContent>
        <Textarea
          disabled={loading}
          placeholder="Type your message here."
          value={message}
          onKeyDown={onEnterPress}
          onChange={(e) => setMessage(e.target.value)}
        />
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button onClick={formSubmit} disabled={loading} type="submit" className="w-full">
          {loading ? <span className="flex items-center gap-2">
              <Loader2 className="animate-spin" />
              Please wait
          </span> : <span>Send message</span>}
        </Button>
      </CardFooter>
    </Card>
  )
}