const apiUrl = process.env.NEXT_PUBLIC_API ?? ''
const wsUrl = process.env.NEXT_PUBLIC_WS ?? ''

export async function initiateChat(idToken: string, msg: string): Promise<{ chatId: string, title: string } | null> {
  console.log(idToken, msg)
  const response = await fetch(`${apiUrl}/chat-init`, {
    method: 'POST',
    body: JSON.stringify({ idToken, userPrompt: msg })
  })
  
  if (response.status === 200) {
    return await response.json()
  }
  return null
}

export function startChat(uid: string, chatId: string): WebSocket {
  const ws = new WebSocket(`${wsUrl}/${uid}/${chatId}`);
  ws.onopen = function() {
    console.log("WebSocket is open now.");
  };

  ws.onclose = function() {
    console.log("WebSocket is closed now.");
  };

  ws.onerror = function(error) {
    console.log("WebSocket error: ", error);
  };

  return ws
}