import { useState } from 'react'
import TopBar from '../components/TopBar'
import PrimaryButton from '../components/PrimaryButton'
import { signup } from '../api'

export default function SignupScreen({ navigate, goBack }) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!fullName.trim()) {
      setError('Full name is required.')
      return
    }
    if (!email.trim()) {
      setError('Email address is required.')
      return
    }
    if (!password) {
      setError('Password is required.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      const result = await signup({ full_name: fullName, email, password })
      setSuccess(result.message || 'Account created successfully. You can now log in.')
      setTimeout(() => navigate('search'), 1800)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    fontSize: 14,
    border: '1px solid var(--border)',
    borderRadius: 10,
    background: 'var(--bg-surface)',
    color: 'var(--text-primary)',
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div className="screen">
      <TopBar title="Create account" subtitle="Join ShareMate Parking" onBack={goBack} />

      <div className="screen-content stagger-list">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          <div className="detail-card">
            <div className="detail-card__heading">Your Details</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={inputStyle}
              />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="Password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
          </div>

          {error && (
            <div style={{
              fontSize: 13,
              color: 'var(--error, #e53e3e)',
              background: 'var(--error-tint, #fff5f5)',
              border: '1px solid var(--error-border, #feb2b2)',
              borderRadius: 10,
              padding: '10px 12px',
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              fontSize: 13,
              color: '#276749',
              background: '#f0fff4',
              border: '1px solid #9ae6b4',
              borderRadius: 10,
              padding: '10px 12px',
            }}>
              {success}
            </div>
          )}

          <PrimaryButton type="submit" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </PrimaryButton>

        </form>
      </div>
    </div>
  )
}
