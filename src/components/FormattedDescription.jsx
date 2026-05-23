import React from 'react'

export default function FormattedDescription({ text, className }) {
  if (!text) return null

  const lines = text.split('\n')

  return (
    <div className={`space-y-2 ${className}`}>
      {lines.map((line, i) => {
        const trimmed = line.trim()
        if (!trimmed) return null

        // If line starts with a common bullet point marker
        if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*')) {
          return (
            <div key={i} className="flex items-start gap-2 ml-1">
              <span className="text-violet-400 mt-[2px] text-lg leading-none">•</span>
              <span className="flex-1">{trimmed.substring(1).trim()}</span>
            </div>
          )
        }

        // Otherwise just render as a normal paragraph
        return <p key={i} className="leading-relaxed">{trimmed}</p>
      })}
    </div>
  )
}
