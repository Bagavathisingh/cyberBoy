// Utility functions to manage chatbot data storage

const STORAGE_KEY = 'cyberboy_chatbot_data'

export const getChatbotData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : {
      totalQueries: 0,
      totalMessages: 0,
      totalUserMessages: 0,
      totalBotMessages: 0,
      conversations: [],
      recentActivity: [],
      lastUpdated: null
    }
  } catch (error) {
    console.error('Error reading chatbot data:', error)
    return {
      totalQueries: 0,
      totalMessages: 0,
      totalUserMessages: 0,
      totalBotMessages: 0,
      conversations: [],
      recentActivity: [],
      lastUpdated: null
    }
  }
}

export const saveChatbotData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error saving chatbot data:', error)
  }
}


export const addMessage = async (message, sessionId = null) => {
  const data = getChatbotData()

  data.totalMessages++
  if (message.sender === 'user') {
    data.totalUserMessages++
    data.totalQueries++
  } else {
    data.totalBotMessages++
  }

  // Add to recent activity
  const activity = {
    id: Date.now(),
    action: message.sender === 'user'
      ? `User query: "${message.text.substring(0, 50)}${message.text.length > 50 ? '...' : ''}"`
      : `Cyber Boy responded`,
    time: new Date().toISOString(),
    type: message.isError ? 'error' : message.sender === 'user' ? 'info' : 'success'
  }
  data.recentActivity.unshift(activity)
  if (data.recentActivity.length > 20) {
    data.recentActivity = data.recentActivity.slice(0, 20)
  }
  data.lastUpdated = new Date().toISOString()
  saveChatbotData(data)

  // Send to backend with logged-in user
  try {
    let userId = 'anonymous'
    const user = localStorage.getItem('cyberboy_user')
    if (user) {
      const parsed = JSON.parse(user)
      userId = parsed._id || parsed.email || 'anonymous'
    }
    const payload = {
      userId,
      activity: [message.text],
      startedAt: new Date().toISOString(),
      ...(sessionId && { sessionId })
    }
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    await fetch(`${BACKEND_URL}/api/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  } catch (err) {
    // Optionally handle/report error
    console.error('Failed to save message to backend:', err)
  }

  return data
}

export const addConversation = (messages) => {
  const data = getChatbotData()

  const conversation = {
    id: Date.now(),
    messages: messages,
    messageCount: messages.length,
    createdAt: new Date().toISOString()
  }

  data.conversations.unshift(conversation)

  // Keep only last 10 conversations
  if (data.conversations.length > 10) {
    data.conversations = data.conversations.slice(0, 10)
  }

  saveChatbotData(data)
  return data
}

export const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'Never'

  const now = new Date()
  const time = new Date(timestamp)
  const diffInSeconds = Math.floor((now - time) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  return `${Math.floor(diffInSeconds / 86400)} days ago`
}

