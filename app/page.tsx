import { Sprout, TreeDeciduous, Flower } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen" style={{background: "var(--background)"}}>
      {/* Skip Navigation */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded">
        Skip to main content
      </a>
      
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-content">
          <ul className="nav-links" role="list">
            <li><a href="#about">ABOUT</a></li>
            <li><a href="#portfolio">PORTFOLIO</a></li>
          </ul>
          <div className="handwritten text-lg">
            <a href="#home" aria-label="Notes Garden - Go to homepage">Notes Garden</a>
          </div>
          <ul className="nav-links" role="list">
            <li><a href="/quiz">QUIZ MAKER</a></li>
            <li><a href="#contact">CONTACT</a></li>
          </ul>
        </div>
      </nav>

      <main style={{paddingTop: "80px"}}>
        {/* Hero Section */}
        <div className="wrapper" style={{paddingTop: "var(--space-xl)"} as React.CSSProperties}>
          <div className="hero-overlay" style={{marginBottom: "var(--space-xl)"} as React.CSSProperties}>
            <div className="hero-content">
              <div className="handwritten text-lg" style={{opacity: 0.9, marginBottom: "var(--space-s)"} as React.CSSProperties}>
                Dide's
              </div>
              <h1 className="display-serif text-5xl" style={{marginBottom: "var(--space-m)"} as React.CSSProperties}>
                NOTES GARDEN
              </h1>
              <p className="text-lg" style={{opacity: 0.9, maxWidth: "400px", margin: "0 auto var(--space-m)"} as React.CSSProperties}>
                A sanctuary for thoughts to flourish. Where ideas bloom into wisdom 
                and connections grow naturally.
              </p>
              <button className="btn btn-secondary" style={{background: "rgba(255,255,255,0.9)", color: "var(--foreground)"}}>
                PLANT IDEAS
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="section-pink">
          <div className="wrapper">
            <div className="stack text-center" style={{"--space": "var(--space-l)"} as React.CSSProperties}>
              <h2 className="display-serif text-4xl text-foreground" style={{marginBottom: "var(--space-m)"} as React.CSSProperties}>
                CULTIVATE THOUGHTS<br />
                AND CONNECTIONS
              </h2>
              
              <div className="with-sidebar" style={{"--space": "var(--space-xl)", maxWidth: "1000px", margin: "0 auto"} as React.CSSProperties}>
                <div className="stack" style={{"--space": "var(--space-s)"} as React.CSSProperties}>
                  <h3 className="text-lg font-bold text-uppercase tracking-wide">ABOUT US</h3>
                  <p className="text-base leading-relaxed">
                    Notes Garden is designed for deep thinkers and creative minds. 
                    Our platform nurtures the organic growth of ideas through 
                    thoughtful design and intuitive connections.
                  </p>
                  <p className="text-base leading-relaxed">
                    Every note becomes a seed. Every connection forms roots. 
                    Watch your digital garden flourish as thoughts interweave 
                    and knowledge blooms naturally.
                  </p>
                </div>
                
                <div className="stack" style={{"--space": "var(--space-s)"} as React.CSSProperties}>
                  <p className="text-base leading-relaxed">
                    Like tending a real garden, digital note-taking requires patience, 
                    consistency, and the right environment. We provide the soil - 
                    you bring the seeds of inspiration.
                  </p>
                  <p className="text-base leading-relaxed">
                    Our philosophy embraces the messy, non-linear nature of human thought. 
                    Ideas don&apos;t grow in straight lines, and neither should your notes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section className="section-sage">
          <div className="wrapper">
            <div className="stack text-center" style={{"--space": "var(--space-l)"} as React.CSSProperties}>
              <h2 className="display-serif text-4xl text-foreground" style={{marginBottom: "var(--space-m)"} as React.CSSProperties}>
                OUR PORTFOLIO
              </h2>
              <div className="cluster justify-center" style={{"--space": "var(--space-m)", maxWidth: "1000px", margin: "0 auto"} as React.CSSProperties}>
                <div className="card" style={{maxWidth: "280px", textAlign: "center"}}>
                  <div style={{height: "200px", background: "var(--warm)", borderRadius: "4px", marginBottom: "var(--space-s)", display: "flex", alignItems: "center", justifyContent: "center"} as React.CSSProperties}>
                    <Sprout size={64} color="var(--foreground)" />
                  </div>
                  <h3 className="text-lg font-bold" style={{marginBottom: "var(--space-2xs)"} as React.CSSProperties}>Thought Seedlings</h3>
                  <p className="text-sm">
                    Quick captures and fleeting ideas that need nurturing
                  </p>
                </div>
                
                <div className="card" style={{maxWidth: "280px", textAlign: "center"}}>
                  <div style={{height: "200px", background: "var(--sage)", borderRadius: "4px", marginBottom: "var(--space-s)", display: "flex", alignItems: "center", justifyContent: "center"} as React.CSSProperties}>
                    <TreeDeciduous size={64} color="var(--foreground)" />
                  </div>
                  <h3 className="text-lg font-bold" style={{marginBottom: "var(--space-2xs)"} as React.CSSProperties}>Growing Networks</h3>
                  <p className="text-sm">
                    Interconnected concepts forming knowledge webs
                  </p>
                </div>
                
                <div className="card" style={{maxWidth: "280px", textAlign: "center"}}>
                  <div style={{height: "200px", background: "var(--clay)", borderRadius: "4px", marginBottom: "var(--space-s)", display: "flex", alignItems: "center", justifyContent: "center"} as React.CSSProperties}>
                    <Flower size={64} color="var(--foreground)" />
                  </div>
                  <h3 className="text-lg font-bold" style={{marginBottom: "var(--space-2xs)"} as React.CSSProperties}>Wisdom Blooms</h3>
                  <p className="text-sm">
                    Mature insights ready to be shared and cultivated
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="section-cream">
        <div className="wrapper text-center">
          <p className="text-sm">
            Cultivated with intention • Notes Garden © 2025
          </p>
        </div>
      </footer>
    </div>
  );
}
