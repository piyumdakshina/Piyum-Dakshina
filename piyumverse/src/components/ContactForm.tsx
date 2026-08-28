'use client'

import { useState, FormEvent } from 'react'

type FieldErrors = Partial<Record<'name' | 'email' | 'subject' | 'message', string>>

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = (data: typeof formData): FieldErrors => {
    const errors: FieldErrors = {}
    if (!data.name.trim()) errors.name = 'Please enter your name.'
    if (!data.email.trim()) {
      errors.email = 'Please enter your email.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errors.email = 'Please enter a valid email address.'
    }
    if (!data.subject.trim()) errors.subject = 'Please add a subject.'
    if (!data.message.trim()) {
      errors.message = 'Please write a message.'
    } else if (data.message.trim().length < 10) {
      errors.message = 'Your message should be at least 10 characters.'
    }
    return errors
  }

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    const errors = validate(formData)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/contact-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error('Failed to send message')

      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass = (hasError?: string) =>
    `w-full px-4 py-2.5 rounded-lg bg-surface border text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 transition-all ${
      hasError
        ? 'border-red-500/60 focus:border-red-500/80 focus:ring-red-500/30'
        : 'border-white/10 focus:border-teal/50 focus:ring-teal/30'
    }`

  if (submitted) {
    return (
      <div className="rounded-2xl border border-grey bg-obsidian p-8 text-center">
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="text-xl font-medium text-teal mb-2">Message Sent!</h3>
        <p className="text-text-secondary">
          Thank you for reaching out. I will get back to you soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-grey bg-obsidian p-8 space-y-5" noValidate>
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm text-text-secondary mb-1.5">
            Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            aria-invalid={!!fieldErrors.name}
            aria-describedby={fieldErrors.name ? 'name-error' : undefined}
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            className={inputClass(fieldErrors.name)}
            placeholder="Your name"
          />
          {fieldErrors.name && (
            <p id="name-error" className="text-red-400 text-sm mt-1.5">
              {fieldErrors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm text-text-secondary mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            className={inputClass(fieldErrors.email)}
            placeholder="your@email.com"
          />
          {fieldErrors.email && (
            <p id="email-error" className="text-red-400 text-sm mt-1.5">
              {fieldErrors.email}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm text-text-secondary mb-1.5">
          Subject
        </label>
        <input
          id="subject"
          type="text"
          aria-invalid={!!fieldErrors.subject}
          aria-describedby={fieldErrors.subject ? 'subject-error' : undefined}
          value={formData.subject}
          onChange={(e) => updateField('subject', e.target.value)}
          className={inputClass(fieldErrors.subject)}
          placeholder="What is this about?"
        />
        {fieldErrors.subject && (
          <p id="subject-error" className="text-red-400 text-sm mt-1.5">
            {fieldErrors.subject}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm text-text-secondary mb-1.5">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          aria-invalid={!!fieldErrors.message}
          aria-describedby={fieldErrors.message ? 'message-error' : undefined}
          value={formData.message}
          onChange={(e) => updateField('message', e.target.value)}
          className={`${inputClass(fieldErrors.message)} resize-none`}
          placeholder="Your message..."
        />
        {fieldErrors.message && (
          <p id="message-error" className="text-red-400 text-sm mt-1.5">
            {fieldErrors.message}
          </p>
        )}
      </div>

      {(error || Object.keys(fieldErrors).length > 0) && (
        <div role="alert">
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-3 rounded-full font-medium btn-theme justify-center disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Sending…
          </>
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  )
}
