import { useState } from 'react'
import './App.css'

function App() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  return (
    <div className="page">
      <header className="hero">
        <button className="icon-btn back" aria-label="Back">⟵</button>
        <button className="icon-btn help" aria-label="Help">?</button>
        <img
          className="hero-img"
          src="https://images.unsplash.com/photo-1470246973918-29a93221c455?q=80&w=2070&auto=format&fit=crop"
          alt="Glamping pods by a campfire"
        />
        <div className="carousel-dots">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </header>

      <main className="content">
        <div className="sku">109111267</div>
        <h1 className="title">Pinewood Pod Stay for Up To Four with Safari at Port Lympne Hotel and Reserve</h1>

        <div className="meta">
          <div className="location">C/O Port Lympne Hotel &amp; Reserve, C/O Port Lympne Hotel &amp; Reserve, Aldington Road, Lympne, CT21 4PD</div>
          <div className="use-by">
            <span>Use by 18th Aug 2026</span>
            <a href="#" className="extend">Extend</a>
          </div>
          <div className="flexible">Fully Flexible</div>
        </div>

        <hr className="divider" />

        <section className="about">
          <h2>About the experience</h2>
          <p>
            Get ready for a glamping escape that’s got lions, tigers, and toasted marshmallows! At the stunning
            Port Lympne Hotel and Reserve, your pinewood pod puts you just moments from safari adventures.
          </p>
        </section>
      </main>

      <div className="cta-bar">
        <div className="cta-note">Limited Availability!</div>
        <button className="cta" onClick={() => setIsSheetOpen(true)}>Request Availability</button>
      </div>

      {isSheetOpen && <div className="overlay" onClick={() => setIsSheetOpen(false)} />}
      <div className={`action-sheet ${isSheetOpen ? 'open' : ''}`} role="dialog" aria-modal="true">
        <div className="grabber" />
        <div className="sheet-content">placeholder</div>
      </div>
    </div>
  )
}

export default App
