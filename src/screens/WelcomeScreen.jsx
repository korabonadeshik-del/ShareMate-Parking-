import LiveTicker from '../components/LiveTicker'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'

export default function WelcomeScreen({ navigate, openModal }) {
  return (
    <div className="welcome-screen screen">
      {/* ── Hero ── */}
      <div className="welcome-hero">
        {/* Wordmark */}
        <div className="welcome-wordmark">
          Share<span className="wordmark-mate">Mate</span>&nbsp;Parking <span style={{ fontSize: 22 }}>👋</span>
        </div>
        <div className="welcome-tagline">Reserved for you. Guaranteed.</div>

        {/* CSS illustration */}
        <div className="hero-illustration">
          <div className="hero-cloud hero-cloud--1" />
          <div className="hero-cloud hero-cloud--2" />
          <div className="hero-sun" />

          {/* Car */}
          <div className="hero-car">
            <div className="hero-car__body">
              <div className="hero-car__cabin" />
              <div className="hero-car__wheel hero-car__wheel--l" />
              <div className="hero-car__wheel hero-car__wheel--r" />
            </div>
          </div>

          {/* Parking sign */}
          <div className="hero-sign">
            <div className="hero-sign__board"><span>P</span></div>
            <div className="hero-sign__post" />
          </div>

          <div className="hero-road" />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="welcome-body">
        <p className="welcome-subtitle">Find reliable parking near your destination</p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LiveTicker />
        </div>

        <div className="welcome-cta-group">
          <PrimaryButton onClick={() => navigate('search')}>Login</PrimaryButton>
          <SecondaryButton onClick={() => navigate('signup')}>Sign up</SecondaryButton>
        </div>

        <div className="welcome-links-row">
          <button className="btn-text-link" onClick={() => openModal('howItWorks')}>
            How it works →
          </button>
          <span className="welcome-links-sep">·</span>
          <button className="btn-text-link" onClick={() => openModal('privacy')}>
            Privacy
          </button>
        </div>
      </div>
    </div>
  )
}
