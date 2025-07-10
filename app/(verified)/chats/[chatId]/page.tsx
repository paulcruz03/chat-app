import { ChatUi } from "@/components/widgets/chat-ui"

export default async function Page({
  params,
}: {
  params: Promise<{ chatId: string }>
}) {
  const { chatId } = await params
  return (
    <div className="container lg:px-4 lg:mx-auto flex flex-col h-screen items-center justify-center">
      <ChatUi chatId={chatId} />
    </div>
  )
}