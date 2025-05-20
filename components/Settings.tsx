import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateApiKey } from '@/config/api-keys'

const API_KEYS = {
  OPENAI_API_KEY: 'OpenAI API Key',
  GEMINI_API_KEY: 'Gemini API Key',
  AIMLAPI_API_KEY: 'AIMLAPI Key',
  GROK_API_KEY: 'Grok API Key',
  CLAUDE_API_KEY: 'Claude API Key',
  DEEPSEEK_API_KEY: 'DeepSeek API Key'
}

export default function Settings() {
  const [keys, setKeys] = useState<Record<string, string>>({})

  useEffect(() => {
    // Load saved keys from localStorage
    const savedKeys = Object.keys(API_KEYS).reduce((acc, key) => {
      const value = localStorage.getItem(`api_key_${key}`) || ''
      return { ...acc, [key]: value }
    }, {})
    setKeys(savedKeys)
  }, [])

  const handleSave = (key: string, value: string) => {
    updateApiKey(key, value)
    localStorage.setItem(`api_key_${key}`, value)
    setKeys(prev => ({ ...prev, [key]: value }))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>API Keys Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(API_KEYS).map(([key, label]) => (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium">{label}</label>
              <div className="flex gap-2">
                <Input
                  type="password"
                  value={keys[key] || ''}
                  onChange={(e) => setKeys(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={`Enter your ${label}`}
                />
                <Button onClick={() => handleSave(key, keys[key] || '')}>
                  Save
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 