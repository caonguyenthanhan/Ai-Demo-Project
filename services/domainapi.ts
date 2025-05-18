export async function callDomainAPI(messages: any[], apiUrl: string) {
  const url = `${apiUrl}/chat/domain`;
  const headers = {
    "Content-Type": "application/json"
  };
  const data = { messages };
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
  }
  const result = await response.json();
  return result.message;
} 