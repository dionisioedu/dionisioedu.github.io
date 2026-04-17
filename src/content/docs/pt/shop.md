---
title: Loja
description: 'Materiais, eBooks e recomendações de Dionisio Developer para acelerar estudo, carreira e execução técnica.'
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
      <h2>Materiais e recomendações para acelerar estudo, carreira e execução técnica</h2>
      <p>
        A loja reúne produtos criados por Dionisio e sugestões úteis para quem quer aprender melhor,
        construir com mais clareza e montar uma rotina de desenvolvimento mais consistente.
      </p>
      <div class="dd-shop-actions">
        <a class="dd-shop-btn" href="#materiais">Ver materiais</a>
        <a class="dd-shop-btn secondary" href="#recomendacoes">Ver recomendações</a>
      </div>
    </div>

    <aside class="dd-shop-side">
      <section class="dd-shop-side-card">
        <p class="dd-shop-kicker">Feito para</p>
        <h3>Quem quer sair do improviso</h3>
        <ul>
          <li>Guias para entrar no mercado com base mais forte</li>
          <li>Materiais para aprofundar stack e raciocínio técnico</li>
          <li>Recomendações práticas para rotina real de dev</li>
        </ul>
      </section>
      <section class="dd-shop-side-card">
        <p class="dd-shop-kicker">Use junto</p>
        <h3>Fluxo ideal</h3>
        <ul>
          <li><a href="/pt/blog/">Blog</a> para contexto e visão</li>
          <li><a href="/pt/reference/">Referência</a> para base e prática</li>
          <li><a href="/pt/projects/">Portfólio</a> para observar entrega e produto</li>
        </ul>
      </section>
    </aside>
  </div>

  <section class="dd-shop-section" id="materiais">
    <p class="dd-shop-kicker">Produtos</p>
    <h2>Materiais de Dionisio Developer</h2>
    <div class="dd-shop-grid">
      <article class="dd-shop-card">
        <img src="/assets/images/books-1.webp" alt="Capa ilustrativa do Guia do Dev Iniciante" loading="lazy" />
        <div class="dd-shop-card-body">
          <span class="dd-shop-badge">Disponível</span>
          <h3>Guia do Dev Iniciante</h3>
          <p>Material direto para conquistar a primeira vaga com projeto, posicionamento e estudo mais estratégico.</p>
          <div class="dd-shop-meta">
            <span>eBook</span>
            <span>Carreira</span>
            <span>Entrada no mercado</span>
          </div>
          <div class="dd-shop-price">
            <span class="dd-price-old">R$ 47,90</span>
            <span class="dd-price-current">R$ 27,90</span>
          </div>
          <a class="dd-shop-buy" href="https://pay.hotmart.com/F98094178H?off=fqzq49bv" target="_blank" rel="noopener noreferrer">Comprar</a>
        </div>
      </article>

      <article class="dd-shop-card">
        <img src="/assets/images/books-2.webp" alt="Capa ilustrativa do Guia Avançado C++" loading="lazy" />
        <div class="dd-shop-card-body">
          <span class="dd-shop-badge">Disponível</span>
          <h3>Guia Avançado C++: Desenvolvedor Quant</h3>
          <p>Leitura para aprofundar C++ profissional com foco em performance, mercado quant e exemplos reais.</p>
          <div class="dd-shop-meta">
            <span>eBook</span>
            <span>C++</span>
            <span>Mercado quant</span>
          </div>
          <div class="dd-shop-price">
            <span class="dd-price-old">R$ 67,90</span>
            <span class="dd-price-current">R$ 37,90</span>
          </div>
          <a class="dd-shop-buy" href="https://pay.hotmart.com/M99932004R" target="_blank" rel="noopener noreferrer">Comprar</a>
        </div>
      </article>

      <article class="dd-shop-card">
        <img src="/assets/images/desktop-3.webp" alt="Ambiente de arquitetura de software" loading="lazy" />
        <div class="dd-shop-card-body">
          <span class="dd-shop-badge">Em breve</span>
          <h3>Masterclass: Arquitetura de Software</h3>
          <p>Uma próxima etapa para quem quer consolidar padrões, trade-offs e visão de arquitetura com aplicação prática.</p>
          <div class="dd-shop-meta">
            <span>Curso</span>
            <span>Arquitetura</span>
            <span>Execução</span>
          </div>
          <div class="dd-shop-price">
            <span class="dd-price-current">Em breve</span>
          </div>
          <span class="dd-shop-link">Lançamento futuro</span>
        </div>
      </article>

      <article class="dd-shop-card">
        <img src="/assets/images/projects-1.webp" alt="Coleção de recursos para desenvolvimento" loading="lazy" />
        <div class="dd-shop-card-body">
          <span class="dd-shop-badge">Em breve</span>
          <h3>Pack de Templates e Boilerplates</h3>
          <p>Base pronta para tirar ideia do papel mais rápido com código limpo, estrutura útil e menos retrabalho inicial.</p>
          <div class="dd-shop-meta">
            <span>Templates</span>
            <span>Boilerplates</span>
            <span>Produtividade</span>
          </div>
          <div class="dd-shop-price">
            <span class="dd-price-current">Em breve</span>
          </div>
          <span class="dd-shop-link">Lançamento futuro</span>
        </div>
      </article>

      <article class="dd-shop-card">
        <img src="/assets/images/office-1.webp" alt="Sessão de mentoria técnica" loading="lazy" />
        <div class="dd-shop-card-body">
          <span class="dd-shop-badge">Em breve</span>
          <h3>Mentoria 1:1</h3>
          <p>Uma proposta para revisar carreira, código, direção de estudo e próximos passos com contexto técnico.</p>
          <div class="dd-shop-meta">
            <span>Mentoria</span>
            <span>Carreira</span>
            <span>Direção</span>
          </div>
          <div class="dd-shop-price">
            <span class="dd-price-current">Em breve</span>
          </div>
          <span class="dd-shop-link">Abertura futura</span>
        </div>
      </article>

      <article class="dd-shop-card">
        <img src="/assets/images/trilha-de-aprendizado.webp" alt="Roteiro visual de evolução técnica" loading="lazy" />
        <div class="dd-shop-card-body">
          <span class="dd-shop-badge">Em breve</span>
          <h3>Roteiro Completo: Dev Jr para Sênior</h3>
          <p>Um plano mais estruturado para organizar evolução técnica, marcos de carreira e prioridades de estudo.</p>
          <div class="dd-shop-meta">
            <span>Guia</span>
            <span>Carreira</span>
            <span>Roadmap</span>
          </div>
          <div class="dd-shop-price">
            <span class="dd-price-current">Em breve</span>
          </div>
          <span class="dd-shop-link">Abertura futura</span>
        </div>
      </article>
    </div>
  </section>

  <section class="dd-shop-section" id="recomendacoes">
    <p class="dd-shop-kicker">Recomendações</p>
    <h2>Setup e itens úteis para rotina dev</h2>
    <div class="dd-affiliate-grid">
      <article class="dd-affiliate-card">
        <img src="https://http2.mlstatic.com/D_Q_NP_952038-MLA99371736922_112025-B.webp" alt="Combo teclado e mouse sem fio Logitech MK250 grafite" loading="lazy" />
        <div class="dd-affiliate-card-body">
          <span class="dd-shop-badge">Afiliado</span>
          <h3>Combo Logitech MK250</h3>
          <p>Conjunto sem fio com conexão estável e boa ergonomia para estudar, programar e trabalhar por horas.</p>
          <p class="dd-affiliate-price">R$ 169,90</p>
          <a class="dd-shop-buy" href="https://meli.la/26oB1pL" target="_blank" rel="noopener noreferrer sponsored">Ver oferta</a>
        </div>
      </article>

      <article class="dd-affiliate-card">
        <img src="https://http2.mlstatic.com/D_NQ_NP_633479-MLA82144434230_022025-F.webp" alt="Notebook Lenovo ThinkPad T14" loading="lazy" />
        <div class="dd-affiliate-card-body">
          <span class="dd-shop-badge">Afiliado</span>
          <h3>Lenovo ThinkPad T14 G2</h3>
          <p>Notebook sólido para codar, estudar e manter uma rotina de trabalho confiável no dia a dia.</p>
          <p class="dd-affiliate-price">R$ 3409,00</p>
          <a class="dd-shop-buy" href="https://meli.la/27MNQe8" target="_blank" rel="noopener noreferrer sponsored">Ver oferta</a>
        </div>
      </article>

      <article class="dd-affiliate-card">
        <img src="https://http2.mlstatic.com/D_Q_NP_669691-MLA106901751604_022026-B.webp" alt="Balança digital corporal Relaxmedic com Bluetooth" loading="lazy" />
        <div class="dd-affiliate-card-body">
          <span class="dd-shop-badge">Afiliado</span>
          <h3>Balança Digital Relaxmedic</h3>
          <p>Um item simples para quem quer cuidar melhor da rotina e da energia física no meio de dias longos de trabalho.</p>
          <p class="dd-affiliate-price">R$ 127,95</p>
          <a class="dd-shop-buy" href="https://meli.la/2hRCzvo" target="_blank" rel="noopener noreferrer sponsored">Ver oferta</a>
        </div>
      </article>
    </div>
  </section>

  <section class="dd-shop-cta">
    <p class="dd-shop-kicker">Acompanhe lançamentos</p>
    <h2>Novos materiais vão nascer a partir do que aparece no trabalho e no conteúdo</h2>
    <p>
      Para não perder atualizações, acompanhe <a href="https://x.com/dionisiodev" target="_blank" rel="noopener noreferrer">@dionisiodev</a> no
      <a href="https://x.com/dionisiodev" target="_blank" rel="noopener noreferrer">X</a>,
      <a href="https://www.youtube.com/@dionisiodev" target="_blank" rel="noopener noreferrer">YouTube</a>,
      <a href="https://medium.com/@dionisiodev" target="_blank" rel="noopener noreferrer">Medium</a> e
      <a href="https://www.linkedin.com/in/dionisiodev/" target="_blank" rel="noopener noreferrer">LinkedIn</a>.
    </p>
    <div class="dd-shop-links">
      <a class="dd-shop-btn" href="/pt/blog/">Ler o Blog</a>
      <a class="dd-shop-link" href="/pt/projects/">Ver Portfólio</a>
    </div>
  </section>
</section>
