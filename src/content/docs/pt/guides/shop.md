---
title: Loja
description: 'Catálogo com todos os nossos produtos e serviços disponíveis.'
---

<style>
.shop-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 20px;
  text-align: center;
  color: white;
  border-radius: 10px;
  margin-bottom: 60px;
}

.shop-hero h2 {
  color: white;
  font-size: 2.5em;
  margin-bottom: 15px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.shop-hero p {
  color: rgba(255,255,255,0.95);
  font-size: 1.2em;
  max-width: 600px;
  margin: 0 auto;
}

.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-btn {
  padding: 10px 20px;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.filter-btn:hover, .filter-btn.active {
  background: #667eea;
  color: white;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 50px rgba(0,0,0,0.15);
}

.product-image {
  width: 100%;
  height: 220px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3em;
  position: relative;
  overflow: hidden;
}

.product-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff6b6b;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8em;
  font-weight: bold;
}

.product-content {
  padding: 25px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-category {
  color: #667eea;
  font-size: 0.85em;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.product-card h3 {
  margin: 0 0 10px 0;
  font-size: 1.2em;
  color: #333;
}

.product-description {
  color: #666;
  font-size: 0.9em;
  line-height: 1.5;
  margin-bottom: 15px;
  flex-grow: 1;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
  font-size: 0.9em;
}

.stars {
  color: #ffc107;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}

.product-price {
  font-size: 1.5em;
  font-weight: bold;
  color: #667eea;
}

.product-old-price {
  font-size: 0.85em;
  color: #999;
  text-decoration: line-through;
  margin-right: 8px;
}

.btn-add-cart {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;
  font-size: 0.9em;
}

.btn-add-cart:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.categories-section {
  background: #f8f9fa;
  padding: 40px;
  border-radius: 12px;
  margin-bottom: 60px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.category-card {
  background: white;
  padding: 25px;
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.category-icon {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.category-card h3 {
  margin: 0;
  color: #333;
}

.category-card p {
  margin: 8px 0 0 0;
  color: #999;
  font-size: 0.9em;
}

.newsletter-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 50px;
  border-radius: 12px;
  text-align: center;
  color: white;
  margin-top: 60px;
}

.newsletter-section h3 {
  color: white;
  margin-bottom: 15px;
}

.newsletter-form {
  display: flex;
  gap: 10px;
  max-width: 500px;
  margin: 0 auto;
}

.newsletter-form input {
  flex: 1;
  padding: 12px 15px;
  border: none;
  border-radius: 6px;
  font-size: 1em;
}

.newsletter-form button {
  padding: 12px 30px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.newsletter-form button:hover {
  background: #ff5252;
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  .shop-hero h2 {
    font-size: 1.8em;
  }
  
  .newsletter-form {
    flex-direction: column;
  }
}
</style>

<!-- Hero Section -->
<div class="shop-hero">
  <h2>🛍️ Loja de Produtos & Serviços</h2>
  <p>Descubra nossa seleção cuidada de eBooks, cursos e ferramentas para desenvolvedores.</p>
</div>

<!-- Categories Section -->
<div class="categories-section">
  <h3 style="text-align: center; margin-bottom: 30px;">Navegue por Categoria</h3>
  <div class="categories-grid">
    <div class="category-card">
      <div class="category-icon">📚</div>
      <h3>eBooks</h3>
      <p>Guias práticos e aprofundados</p>
    </div>
    <div class="category-card">
      <div class="category-icon">🎓</div>
      <h3>Cursos</h3>
      <p>Aprendizado estruturado</p>
    </div>
    <div class="category-card">
      <div class="category-icon">🛠️</div>
      <h3>Ferramentas</h3>
      <p>Recursos úteis e templates</p>
    </div>
    <div class="category-card">
      <div class="category-icon">🚀</div>
      <h3>Mentoria</h3>
      <p>Sessões e consultorias</p>
    </div>
  </div>
</div>

<!-- Filter Buttons -->
<div class="filters">
  <button class="filter-btn active">Todos</button>
  <button class="filter-btn">eBooks</button>
  <button class="filter-btn">Cursos</button>
  <button class="filter-btn">Promoções</button>
</div>

<!-- Products Grid -->
<div class="products-grid">
  <!-- Product 1 -->
  <div class="product-card">
    <div class="product-image">
      📖
      <span class="product-badge">-40% OFF</span>
    </div>
    <div class="product-content">
      <span class="product-category">eBook</span>
      <h3>Guia do Dev Iniciante</h3>
      <p class="product-description">Tudo que você precisa para conquistar sua primeira vaga como desenvolvedor. Guia prático com dicas reais.</p>
      <div class="product-rating">
        <span class="stars">★★★★★</span>
        <span>(847 avaliações)</span>
      </div>
      <div class="product-footer">
        <div>
          <span class="product-old-price">R$ 47,90</span>
          <span class="product-price">R$ 27,90</span>
        </div>
        <button class="btn-add-cart">COMPRAR</button>
      </div>
    </div>
  </div>

  <!-- Product 2 -->
  <div class="product-card">
    <div class="product-image">
      ⚡
      <span class="product-badge">-44% OFF</span>
    </div>
    <div class="product-content">
      <span class="product-category">eBook</span>
      <h3>Guia Avançado C++: Desenvolvedor Quant</h3>
      <p class="product-description">Domine C++ profissional e entre no mercado de trading algorítmico. Exemplos reais incluídos.</p>
      <div class="product-rating">
        <span class="stars">★★★★★</span>
        <span>(324 avaliações)</span>
      </div>
      <div class="product-footer">
        <div>
          <span class="product-old-price">R$ 67,90</span>
          <span class="product-price">R$ 37,90</span>
        </div>
        <button class="btn-add-cart">COMPRAR</button>
      </div>
    </div>
  </div>

  <!-- Product 3 -->
  <div class="product-card">
    <div class="product-image">
      🎓
    </div>
    <div class="product-content">
      <span class="product-category">Curso Online</span>
      <h3>Masterclass: Arquitetura de Software</h3>
      <p class="product-description">Aprenda padrões de design profissionais. 10 módulos com exercícios práticos. Acesso vitalício.</p>
      <div class="product-rating">
        <span class="stars">★★★★★</span>
        <span>(521 avaliações)</span>
      </div>
      <div class="product-footer">
        <div>
          <span class="product-price">R$ 99,90</span>
        </div>
        <button class="btn-add-cart">COMPRAR</button>
      </div>
    </div>
  </div>

  <!-- Product 4 -->
  <div class="product-card">
    <div class="product-image">
      🛠️
    </div>
    <div class="product-content">
      <span class="product-category">Ferramenta</span>
      <h3>Pack de Templates & Boilerplates</h3>
      <p class="product-description">5 templates prontos para iniciar projetos. C++, TypeScript, Python. Código limpo e documentado.</p>
      <div class="product-rating">
        <span class="stars">★★★★☆</span>
        <span>(412 avaliações)</span>
      </div>
      <div class="product-footer">
        <div>
          <span class="product-price">R$ 49,90</span>
        </div>
        <button class="btn-add-cart">COMPRAR</button>
      </div>
    </div>
  </div>

  <!-- Product 5 -->
  <div class="product-card">
    <div class="product-image">
      🎯
    </div>
    <div class="product-content">
      <span class="product-category">Consultoria</span>
      <h3>Sessão de Mentoria (1:1)</h3>
      <p class="product-description">60 minutos direto com especialista. Tire dúvidas, revise código, planeje sua carreira.</p>
      <div class="product-rating">
        <span class="stars">★★★★★</span>
        <span>(189 avaliações)</span>
      </div>
      <div class="product-footer">
        <div>
          <span class="product-price">R$ 150,00</span>
        </div>
        <button class="btn-add-cart">AGENDAR</button>
      </div>
    </div>
  </div>

  <!-- Product 6 -->
  <div class="product-card">
    <div class="product-image">
      📊
      <span class="product-badge">EM BREVE</span>
    </div>
    <div class="product-content">
      <span class="product-category">Guia</span>
      <h3>Roteiro Completo: Dev Jr → Sênior</h3>
      <p class="product-description">Plano estruturado de 3 anos para evoluir sua carreira técnica com marcos e recursos.</p>
      <div class="product-rating">
        <span class="stars">★★★★★</span>
        <span>(0 avaliações)</span>
      </div>
      <div class="product-footer">
        <div>
          <span class="product-price">Em breve</span>
        </div>
        <button class="btn-add-cart" disabled style="opacity: 0.6;">NOTIFICAR</button>
      </div>
    </div>
  </div>
</div>

<!-- Newsletter Section -->
<div class="newsletter-section">
  <h3>📬 Fique por dentro das novidades</h3>
  <p style="margin-bottom: 20px;">Receba atualizações sobre novos produtos, promoções exclusivas e conteúdo educativo direto na sua caixa de entrada.</p>
  <div class="newsletter-form">
    <input type="email" placeholder="seu email@exemplo.com" />
    <button>Inscrever</button>
  </div>
</div>
