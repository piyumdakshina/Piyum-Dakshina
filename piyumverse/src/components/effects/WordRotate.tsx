'use client'

interface WordRotateProps {
  words: string[]
}

export function WordRotate({ words }: WordRotateProps) {
  return (
    <span className="word-rotate" aria-live="polite">
      {words.map((word, i) => (
        <span key={i}>{word}</span>
      ))}
    </span>
  )
}
