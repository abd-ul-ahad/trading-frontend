'use client'

import { motion } from 'framer-motion'
import { memo, useState, useMemo } from 'react'
import { countries } from 'countries-list'

export const ContactSection = memo(function ContactSection() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [countryCode, setCountryCode] = useState('+1')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [question, setQuestion] = useState('')

  const countriesList = useMemo(() => {
    return Object.entries(countries)
      .map(([code, country]) => ({
        code,
        name: country.name,
        callingCode: typeof country.phone === 'number' ? `+${country.phone}` : (Array.isArray(country.phone) ? `+${country.phone[0]}` : `+${country.phone}`),
      }))
      .filter((c) => c.callingCode && c.callingCode !== '+undefined') // Filter out countries without phone codes
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log({ firstName, lastName, email, countryCode, phoneNumber, question })
  }

  return (
    <section className="px-6 pb-24 md:px-12 lg:px-16">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Left Column - Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">
            Get in touch
          </p>
          <h2 className="mb-6 text-4xl font-bold leading-tight text-foreground md:text-5xl">
            Still have
            <br />
            <span className="italic">questions?</span>
          </h2>
          <p className="mb-8 text-base leading-relaxed text-muted-foreground">
            Our team responds to every message personally. Whether you're evaluating strategies, have a question about how the platform works, or want to speak with someone before investing — we're here.
          </p>

          <div className="space-y-6">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Response time
              </p>
              <p className="text-base font-semibold text-foreground">Within 1 business day</p>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Email
              </p>
              <p className="text-base font-semibold text-foreground">hello@oroviax.com</p>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-border bg-card p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  First name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jane"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3  text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Last name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Smith"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3  text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full rounded-lg border border-border bg-background px-4 py-3  text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Phone number
              </label>
              <div className="flex gap-3">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="rounded-lg border border-border bg-background px-3 py-3  text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary w-36"
                >
                  {countriesList.map(({ callingCode, name }) => (
                    <option key={name} value={callingCode}>
                      {callingCode} {name}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="(555) 000-0000"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            {/* Question */}
            <div>
              <label htmlFor="question" className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Your question
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Tell us what's on your mind..."
                rows={5}
                className="w-full rounded-lg border border-border bg-background px-4 py-3  text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-6 py-3  font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Send message
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
})
