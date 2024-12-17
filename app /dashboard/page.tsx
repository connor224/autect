'use client'

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { redirect } from 'next/navigation'

const supportedLanguages = [
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'cs', name: 'Czech', flag: '🇨🇿' },
  { code: 'da', name: 'Danish', flag: '🇩🇰' },
  { code: 'jv', name: 'Javanese', flag: '🇮🇩' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺' },
  { code: 'fa', name: 'Persian', flag: '🇮🇷' },
  { code: 'sk', name: 'Slovak', flag: '🇸🇰' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
]

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [guilds, setGuilds] = useState([])
  const [selectedGuild, setSelectedGuild] = useState(null)
  const [translationChannel, setTranslationChannel] = useState('')
  const [translationLanguage, setTranslationLanguage] = useState('')
  const [defaultLanguage, setDefaultLanguage] = useState('')

  useEffect(() => {
    if (status === "authenticated" && session) {
      fetch('/api/guilds')
        .then(res => res.json())
        .then(data => setGuilds(data))
    }
  }, [status, session])

  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (status === "unauthenticated") {
    redirect('/api/auth/signin')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Here you would typically send this data to your backend
    console.log({
      guild: selectedGuild,
      translationChannel,
      translationLanguage,
      defaultLanguage
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Select a Server</h2>
        <select 
          className="w-full p-2 border rounded"
          onChange={(e) => setSelectedGuild(e.target.value)}
        >
          <option value="">Select a server</option>
          {guilds.map(guild => (
            <option key={guild.id} value={guild.id}>{guild.name}</option>
          ))}
        </select>
      </div>
      {selectedGuild && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Automatic Translation Channel</h2>
            <input 
              type="text" 
              placeholder="Enter channel name" 
              className="w-full p-2 border rounded"
              value={translationChannel}
              onChange={(e) => setTranslationChannel(e.target.value)}
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Translation Language</h2>
            <select 
              className="w-full p-2 border rounded"
              value={translationLanguage}
              onChange={(e) => setTranslationLanguage(e.target.value)}
            >
              <option value="">Select a language</option>
              {supportedLanguages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Default Bot Language</h2>
            <select 
              className="w-full p-2 border rounded"
              value={defaultLanguage}
              onChange={(e) => setDefaultLanguage(e.target.value)}
            >
              <option value="">Select a language</option>
              {supportedLanguages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Save Settings
          </button>
        </form>
      )}
    </div>
  )
}

