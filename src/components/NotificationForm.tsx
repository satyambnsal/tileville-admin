'use client'

import { useState } from 'react'

export default function NotificationForm() {
  const [type, setType] = useState('competition')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [recipients, setRecipients] = useState('all')
  const [addresses, setAddresses] = useState('')
  const [entryFee, setEntryFee] = useState('1')
  const [prizePool, setPrizePool] = useState('100')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const content = {
        title,
        message,
        ...(type === 'competition' && {
          name: title,
          entryFee: parseFloat(entryFee),
          startTime: new Date(),
          prizePool: parseFloat(prizePool)
        }),
      }

      const recipientList =
        recipients === 'all' ? ['all'] : addresses.split(',').map((addr) => addr.trim())

      console.log('Sending notification with data:', {
        type,
        content,
        recipients: recipientList,
      })

      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          content,
          recipients: recipientList,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to send notification')
      }

      const data = await res.json()
      console.log('Notification response:', data)

      // Clear form
      setTitle('')
      setMessage('')
      setAddresses('')
      setEntryFee('1')
      setPrizePool('100')
      alert('Notification sent successfully!')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      alert(`Error sending notification: ${errorMessage}`)
    }finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-2">Notification Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="competition">New Competition</option>
          <option value="announcement">General Announcement</option>
          <option value="maintenance">Maintenance Alert</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border rounded"
          rows={4}
          required
        />
      </div>

      {type === 'competition' && (
        <>
          <div>
            <label className="block text-gray-700 mb-2">Entry Fee (MINA)</label>
            <input
              type="number"
              value={entryFee}
              onChange={(e) => setEntryFee(e.target.value)}
              className="w-full p-2 border rounded"
              min="0"
              step="0.1"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Prize Pool (MINA)</label>
            <input
              type="number"
              value={prizePool}
              onChange={(e) => setPrizePool(e.target.value)}
              className="w-full p-2 border rounded"
              min="0"
              step="0.1"
              required
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-gray-700 mb-2">Recipients</label>
        <select
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        >
          <option value="all">All Users</option>
          <option value="specific">Specific Addresses</option>
        </select>

        {recipients === 'specific' && (
          <textarea
            value={addresses}
            onChange={(e) => setAddresses(e.target.value)}
            placeholder="Enter wallet addresses, separated by commas"
            className="w-full p-2 border rounded"
            rows={3}
            required
          />
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {loading ? 'Sending...' : 'Send Notification'}
      </button>
    </form>
  )
}
