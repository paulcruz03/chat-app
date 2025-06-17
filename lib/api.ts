const apiUrl = process.env.NEXT_PUBLIC_API ?? ''

export async function initiateChat(idToken: string, msg: string): Promise<string> {
  console.log(idToken, msg)
  await fetch(`${apiUrl}/chat-init`, {
    method: 'POST',
    body: JSON.stringify({ idToken, userPrompt: msg })
  })
  return ''
}