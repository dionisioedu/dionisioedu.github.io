---
title: Shop
description: 'Materials, eBooks, and recommendations from Dionisio Developer to accelerate study, career growth, and technical execution.'
---

<style>
.dd-shop {
  display: grid;
  gap: 2rem;
}

.dd-shop-hero,
.dd-shop-section,
.dd-shop-cta {
  padding: 1.5rem;
  border: 1px solid var(--ae-border);
  border-radius: 0.5rem;
  background: var(--ae-surface);
  box-shadow: var(--sl-shadow-sm);
}

.dd-shop-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(16rem, 0.95fr);
  gap: 1rem;
}

.dd-shop-kicker {
  margin: 0 0 0.75rem;
  color: var(--sl-color-accent);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.dd-shop-hero h2,
.dd-shop-side h3,
.dd-shop-card h3,
.dd-affiliate-card h3,
.dd-shop-section h2,
.dd-shop-cta h2 {
  margin: 0;
  color: var(--sl-color-white);
  line-height: 1.08;
}

.dd-shop-hero h2 {
  font-size: clamp(2rem, 2.8vw, 3rem);
}

.dd-shop-hero p,
.dd-shop-side li,
.dd-shop-card p,
.dd-affiliate-card p,
.dd-shop-cta p {
  color: var(--ae-muted);
  line-height: 1.7;
}

.dd-shop-actions,
.dd-shop-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.dd-shop-actions {
  margin-top: 1.25rem;
}

.dd-shop-btn,
.dd-shop-link,
.dd-shop-buy {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  padding: 0 1rem;
  border-radius: 0.5rem;
  font-weight: 700;
  text-decoration: none;
}

.dd-shop-btn,
.dd-shop-buy {
  background: var(--sl-color-accent);
  color: var(--sl-color-text-invert);
}

.dd-shop-btn.secondary,
.dd-shop-link {
  border: 1px solid var(--ae-border-strong);
  color: var(--sl-color-white);
  background: transparent;
}

.dd-shop-side {
  display: grid;
  gap: 1rem;
}

.dd-shop-side-card {
  padding: 1rem;
  border: 1px solid var(--ae-border);
  border-radius: 0.5rem;
  background: var(--ae-surface-soft);
}

.dd-shop-side-card ul {
  margin: 0.85rem 0 0;
  padding-left: 1rem;
}

.dd-shop-side-card li + li {
  margin-top: 0.5rem;
}

.dd-shop-grid,
.dd-affiliate-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.dd-shop-card,
.dd-affiliate-card {
  overflow: hidden;
  border: 1px solid var(--ae-border);
  border-radius: 0.5rem;
  background: var(--ae-surface);
  box-shadow: var(--sl-shadow-sm);
}

.dd-shop-card img,
.dd-affiliate-card img {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.dd-shop-card-body,
.dd-affiliate-card-body {
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
}

.dd-shop-meta,
.dd-shop-price {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  align-items: center;
}

.dd-shop-meta span,
.dd-shop-badge {
  display: inline-flex;
  align-items: center;
  min-height: 1.7rem;
  padding: 0 0.65rem;
  border-radius: 999px;
  background: var(--ae-surface-soft);
  color: var(--sl-color-accent-high);
  font-size: 0.78rem;
  font-weight: 700;
}

.dd-shop-badge {
  width: fit-content;
}

.dd-price-old {
  color: var(--sl-color-gray-3);
  text-decoration: line-through;
}

.dd-price-current {
  color: var(--sl-color-white);
  font-size: 1.2rem;
  font-weight: 700;
}

.dd-affiliate-card-body {
  grid-template-rows: auto auto 1fr auto auto;
}

.dd-affiliate-card h3 {
  font-size: 1.05rem;
}

.dd-affiliate-price {
  color: var(--sl-color-white);
  font-weight: 700;
}

@media (max-width: 900px) {
  .dd-shop-hero,
  .dd-shop-grid,
  .dd-affiliate-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<section class="dd-shop">
  <div class="dd-shop-hero">
    <div>
      <p class="dd-shop-kicker">Dionisio Developer</p>
      <h2>Materials and recommendations to accelerate study, career growth, and technical execution</h2>
      <p>
        The shop brings together products created by Dionisio and useful recommendations for people
        who want to learn better, build with more clarity, and create a steadier developer routine.
      </p>
      <div class="dd-shop-actions">
        <a class="dd-shop-btn" href="#materials">View materials</a>
        <a class="dd-shop-btn secondary" href="#recommendations">View recommendations</a>
      </div>
    </div>

    <aside class="dd-shop-side">
      <section class="dd-shop-side-card">
        <p class="dd-shop-kicker">Built for</p>
        <h3>People who want less improvisation</h3>
        <ul>
          <li>Guides for entering the market with stronger foundations</li>
          <li>Materials for deepening stack knowledge and technical thinking</li>
          <li>Practical recommendations for real developer routines</li>
        </ul>
      </section>
      <section class="dd-shop-side-card">
        <p class="dd-shop-kicker">Use together</p>
        <h3>Best flow</h3>
        <ul>
          <li><a href="/en/blog/">Blog</a> for context and perspective</li>
          <li><a href="/en/reference/">Reference</a> for fundamentals and practice</li>
          <li><a href="/en/projects/">Portfolio</a> for delivery and product cases</li>
        </ul>
      </section>
    </aside>
  </div>

  <section class="dd-shop-section" id="materials">
    <p class="dd-shop-kicker">Products</p>
    <h2>Dionisio Developer materials</h2>
    <div class="dd-shop-grid">
      <article class="dd-shop-card">
        <img src="/assets/images/books-1.webp" alt="Beginner Developer Guide cover art" loading="lazy" />
        <div class="dd-shop-card-body">
          <span class="dd-shop-badge">Available</span>
          <h3>Beginner Developer Guide</h3>
          <p>A direct resource for landing the first role with stronger projects, positioning, and study structure.</p>
          <div class="dd-shop-meta">
            <span>eBook</span>
            <span>Career</span>
            <span>First job</span>
          </div>
          <div class="dd-shop-price">
            <span class="dd-price-old">$9.99</span>
            <span class="dd-price-current">$5.99</span>
          </div>
          <a class="dd-shop-buy" href="https://pay.hotmart.com/F98094178H?off=fqzq49bv" target="_blank" rel="noopener noreferrer">Buy now</a>
        </div>
      </article>

      <article class="dd-shop-card">
        <img src="/assets/images/books-2.webp" alt="Advanced C++ guide cover art" loading="lazy" />
        <div class="dd-shop-card-body">
          <span class="dd-shop-badge">Available</span>
          <h3>Advanced C++: Quant Developer</h3>
          <p>A deeper read for professional C++, performance thinking, and the quant market with real examples.</p>
          <div class="dd-shop-meta">
            <span>eBook</span>
            <span>C++</span>
            <span>Quant</span>
          </div>
          <div class="dd-shop-price">
            <span class="dd-price-old">$14.99</span>
            <span class="dd-price-current">$7.99</span>
          </div>
          <a class="dd-shop-buy" href="https://pay.hotmart.com/M99932004R" target="_blank" rel="noopener noreferrer">Buy now</a>
        </div>
      </article>

      <article class="dd-shop-card">
        <img src="/assets/images/desktop-3.webp" alt="Software architecture workspace" loading="lazy" />
        <div class="dd-shop-card-body">
          <span class="dd-shop-badge">Coming soon</span>
          <h3>Masterclass: Software Architecture</h3>
          <p>A next step for people who want to firm up patterns, trade-offs, and architecture thinking with practical application.</p>
          <div class="dd-shop-meta">
            <span>Course</span>
            <span>Architecture</span>
            <span>Execution</span>
          </div>
          <div class="dd-shop-price">
            <span class="dd-price-current">Coming soon</span>
          </div>
          <span class="dd-shop-link">Future release</span>
        </div>
      </article>

      <article class="dd-shop-card">
        <img src="/assets/images/projects-1.webp" alt="Developer resources collection" loading="lazy" />
        <div class="dd-shop-card-body">
          <span class="dd-shop-badge">Coming soon</span>
          <h3>Templates and Boilerplates Pack</h3>
          <p>A faster starting point for turning ideas into working projects with cleaner structure and less early friction.</p>
          <div class="dd-shop-meta">
            <span>Templates</span>
            <span>Boilerplates</span>
            <span>Productivity</span>
          </div>
          <div class="dd-shop-price">
            <span class="dd-price-current">Coming soon</span>
          </div>
          <span class="dd-shop-link">Future release</span>
        </div>
      </article>

      <article class="dd-shop-card">
        <img src="/assets/images/office-1.webp" alt="Technical mentoring session" loading="lazy" />
        <div class="dd-shop-card-body">
          <span class="dd-shop-badge">Coming soon</span>
          <h3>1:1 Mentoring</h3>
          <p>A future offer for reviewing career direction, code, study plans, and next technical moves with context.</p>
          <div class="dd-shop-meta">
            <span>Mentoring</span>
            <span>Career</span>
            <span>Direction</span>
          </div>
          <div class="dd-shop-price">
            <span class="dd-price-current">Coming soon</span>
          </div>
          <span class="dd-shop-link">Future opening</span>
        </div>
      </article>

      <article class="dd-shop-card">
        <img src="/assets/images/trilha-de-aprendizado.webp" alt="Technical growth roadmap" loading="lazy" />
        <div class="dd-shop-card-body">
          <span class="dd-shop-badge">Coming soon</span>
          <h3>Complete Roadmap: Junior to Senior Developer</h3>
          <p>A more structured plan for organizing technical growth, career milestones, and study priorities.</p>
          <div class="dd-shop-meta">
            <span>Guide</span>
            <span>Career</span>
            <span>Roadmap</span>
          </div>
          <div class="dd-shop-price">
            <span class="dd-price-current">Coming soon</span>
          </div>
          <span class="dd-shop-link">Future opening</span>
        </div>
      </article>
    </div>
  </section>

  <section class="dd-shop-section" id="recommendations">
    <p class="dd-shop-kicker">Recommendations</p>
    <h2>Useful setup and routine picks for developers</h2>
    <div class="dd-affiliate-grid">
      <article class="dd-affiliate-card">
        <img src="https://http2.mlstatic.com/D_Q_NP_952038-MLA99371736922_112025-B.webp" alt="Logitech MK250 wireless keyboard and mouse combo" loading="lazy" />
        <div class="dd-affiliate-card-body">
          <span class="dd-shop-badge">Affiliate</span>
          <h3>Logitech MK250 Combo</h3>
          <p>A wireless setup with stable connection and good ergonomics for study, coding, and long work sessions.</p>
          <p class="dd-affiliate-price">R$ 169,90</p>
          <a class="dd-shop-buy" href="https://meli.la/26oB1pL" target="_blank" rel="noopener noreferrer sponsored">View offer</a>
        </div>
      </article>

      <article class="dd-affiliate-card">
        <img src="https://http2.mlstatic.com/D_NQ_NP_633479-MLA82144434230_022025-F.webp" alt="Lenovo ThinkPad T14 notebook" loading="lazy" />
        <div class="dd-affiliate-card-body">
          <span class="dd-shop-badge">Affiliate</span>
          <h3>Lenovo ThinkPad T14 G2</h3>
          <p>A dependable notebook for coding, studying, and maintaining a productive day-to-day remote setup.</p>
          <p class="dd-affiliate-price">R$ 3409,00</p>
          <a class="dd-shop-buy" href="https://meli.la/27MNQe8" target="_blank" rel="noopener noreferrer sponsored">View offer</a>
        </div>
      </article>

      <article class="dd-affiliate-card">
        <img src="https://http2.mlstatic.com/D_Q_NP_669691-MLA106901751604_022026-B.webp" alt="Relaxmedic digital body scale with Bluetooth" loading="lazy" />
        <div class="dd-affiliate-card-body">
          <span class="dd-shop-badge">Affiliate</span>
          <h3>Relaxmedic Digital Scale</h3>
          <p>A simple way to pay more attention to energy and routine health during long stretches of technical work.</p>
          <p class="dd-affiliate-price">R$ 127,95</p>
          <a class="dd-shop-buy" href="https://meli.la/2hRCzvo" target="_blank" rel="noopener noreferrer sponsored">View offer</a>
        </div>
      </article>
    </div>
  </section>

  <section class="dd-shop-cta">
    <p class="dd-shop-kicker">Follow future launches</p>
    <h2>New materials will keep coming from the work, the writing, and the questions people bring</h2>
    <p>
      To keep up with updates, follow <a href="https://x.com/dionisiodev" target="_blank" rel="noopener noreferrer">@dionisiodev</a> on
      <a href="https://x.com/dionisiodev" target="_blank" rel="noopener noreferrer">X</a>,
      <a href="https://www.youtube.com/@dionisiodev" target="_blank" rel="noopener noreferrer">YouTube</a>,
      <a href="https://medium.com/@dionisiodev" target="_blank" rel="noopener noreferrer">Medium</a>, and
      <a href="https://www.linkedin.com/in/dionisiodev/" target="_blank" rel="noopener noreferrer">LinkedIn</a>.
    </p>
    <div class="dd-shop-links">
      <a class="dd-shop-btn" href="/en/blog/">Read the Blog</a>
      <a class="dd-shop-link" href="/en/projects/">View Portfolio</a>
    </div>
  </section>
</section>
