---
title: Shop
description: 'Catalog with all our available products and services.'
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
  <h2>🛍️ Shop - Products & Services</h2>
  <p>Discover our carefully selected collection of eBooks, courses and tools for developers.</p>
</div>

<!-- Categories Section -->
<div class="categories-section">
  <h3 style="text-align: center; margin-bottom: 30px;">Browse by Category</h3>
  <div class="categories-grid">
    <div class="category-card">
      <div class="category-icon">📚</div>
      <h3>eBooks</h3>
      <p>Practical and in-depth guides</p>
    </div>
    <div class="category-card">
      <div class="category-icon">🎓</div>
      <h3>Courses</h3>
      <p>Structured learning</p>
    </div>
    <div class="category-card">
      <div class="category-icon">🛠️</div>
      <h3>Tools</h3>
      <p>Useful resources and templates</p>
    </div>
    <div class="category-card">
      <div class="category-icon">🚀</div>
      <h3>Mentoring</h3>
      <p>Sessions and consultancies</p>
    </div>
  </div>
</div>

<!-- Filter Buttons -->
<div class="filters">
  <button class="filter-btn active">All</button>
  <button class="filter-btn">eBooks</button>
  <button class="filter-btn">Courses</button>
  <button class="filter-btn">Promotions</button>
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
      <h3>Beginner Developer's Guide</h3>
      <p class="product-description">Everything you need to land your first job as a developer. Practical guide with real-world tips.</p>
      <div class="product-rating">
        <span class="stars">★★★★★</span>
        <span>(847 reviews)</span>
      </div>
      <div class="product-footer">
        <div>
          <span class="product-old-price">$9.99</span>
          <span class="product-price">$5.99</span>
        </div>
        <button class="btn-add-cart">BUY</button>
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
      <h3>Advanced C++: Quant Developer</h3>
      <p class="product-description">Master professional C++ and enter the algorithmic trading market. Real-world examples included.</p>
      <div class="product-rating">
        <span class="stars">★★★★★</span>
        <span>(324 reviews)</span>
      </div>
      <div class="product-footer">
        <div>
          <span class="product-old-price">$14.99</span>
          <span class="product-price">$7.99</span>
        </div>
        <button class="btn-add-cart">BUY</button>
      </div>
    </div>
  </div>

  <!-- Product 3 -->
  <div class="product-card">
    <div class="product-image">
      🎓
    </div>
    <div class="product-content">
      <span class="product-category">Online Course</span>
      <h3>Masterclass: Software Architecture</h3>
      <p class="product-description">Learn professional design patterns. 10 modules with practical exercises. Lifetime access.</p>
      <div class="product-rating">
        <span class="stars">★★★★★</span>
        <span>(521 reviews)</span>
      </div>
      <div class="product-footer">
        <div>
          <span class="product-price">$19.99</span>
        </div>
        <button class="btn-add-cart">BUY</button>
      </div>
    </div>
  </div>

  <!-- Product 4 -->
  <div class="product-card">
    <div class="product-image">
      🛠️
    </div>
    <div class="product-content">
      <span class="product-category">Tool</span>
      <h3>Templates & Boilerplates Pack</h3>
      <p class="product-description">5 ready-to-use templates for starting projects. C++, TypeScript, Python. Clean and documented code.</p>
      <div class="product-rating">
        <span class="stars">★★★★☆</span>
        <span>(412 reviews)</span>
      </div>
      <div class="product-footer">
        <div>
          <span class="product-price">$9.99</span>
        </div>
        <button class="btn-add-cart">BUY</button>
      </div>
    </div>
  </div>

  <!-- Product 5 -->
  <div class="product-card">
    <div class="product-image">
      🎯
    </div>
    <div class="product-content">
      <span class="product-category">Consultancy</span>
      <h3>1:1 Mentoring Session</h3>
      <p class="product-description">60 minutes with a specialist. Ask questions, review code, plan your career.</p>
      <div class="product-rating">
        <span class="stars">★★★★★</span>
        <span>(189 reviews)</span>
      </div>
      <div class="product-footer">
        <div>
          <span class="product-price">$30.00</span>
        </div>
        <button class="btn-add-cart">BOOK</button>
      </div>
    </div>
  </div>

  <!-- Product 6 -->
  <div class="product-card">
    <div class="product-image">
      📊
      <span class="product-badge">COMING SOON</span>
    </div>
    <div class="product-content">
      <span class="product-category">Guide</span>
      <h3>Complete Roadmap: Junior → Senior Dev</h3>
      <p class="product-description">Structured 3-year plan to advance your technical career with milestones and resources.</p>
      <div class="product-rating">
        <span class="stars">★★★★★</span>
        <span>(0 reviews)</span>
      </div>
      <div class="product-footer">
        <div>
          <span class="product-price">Coming soon</span>
        </div>
        <button class="btn-add-cart" disabled style="opacity: 0.6;">NOTIFY ME</button>
      </div>
    </div>
  </div>
</div>

<!-- Newsletter Section -->
<div class="newsletter-section">
  <h3>📬 Stay updated with news</h3>
  <p style="margin-bottom: 20px;">Receive updates about new products, exclusive promotions and educational content directly in your inbox.</p>
  <div class="newsletter-form">
    <input type="email" placeholder="your.email@example.com" />
    <button>Subscribe</button>
  </div>
</div>
