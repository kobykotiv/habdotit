"use client"

import { useState } from "react"

type TimelineEntry = {
  id: string
  date: string
  note: string
  photo?: string
}

export default function ManualTimeline() {
  const [entries, setEntries] = useState<TimelineEntry[]>([])
  const [note, setNote] = useState("")
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  const addEntry = () => {
    if (!note.trim()) return
    const newEntry: TimelineEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      note,
      photo: photoFile ? URL.createObjectURL(photoFile) : undefined,
    }
    setEntries([newEntry, ...entries])
    setNote("")
    setPhotoFile(null)
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Manual Timeline</h1>
      <p className="text-lg">
        Helpful suggestions to quit or improve habits. Take a photo of what you want to change and add your notes.
      </p>
      {/* Input Section */}
      <div className="p-4 border rounded-md space-y-4">
        <textarea 
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter a tip or suggestion..."
          className="w-full p-2 border rounded"
        />
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => 
            e.target.files && setPhotoFile(e.target.files[0])
          }
        />
        <button onClick={addEntry} className="px-4 py-2 bg-blue-500 text-white rounded">
          Add Entry
        </button>
      </div>
      {/* Timeline */}
      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="p-4 border rounded-md">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Entry on {entry.date}</span>
            </div>
            {entry.photo && (
              <img src={entry.photo} alt="Timeline entry" className="w-full h-auto mb-2 rounded"/>
            )}
            <p>{entry.note}</p>
          </div>
        ))}
      </div>
      {/* Helpful Suggestions Section */}
      <div className="p-4 border rounded-md">
        <h2 className="text-2xl font-bold mb-2">Tips for Breaking Compulsive Patterns</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Identify triggers and plan ahead for alternative actions.</li>
          <li>Replace the unwanted habit with a healthier behavior.</li>
          <li>Keep a visual timeline of your progress to stay motivated.</li>
          <li>Reach out to supportive friends or communities.</li>
        </ul>
      </div>
    </div>
  )
}
