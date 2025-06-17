import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export default function ChatInput() {
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
        <Textarea placeholder="Type your message here." />
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Send message
        </Button>
      </CardFooter>
    </Card>
  )
}