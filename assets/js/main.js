"use strict";

/**
 * main.js
 * Script para aprimorar a experiência do usuário no site:
 * - Adiciona uma classe para ativar o efeito de fade-in na carga da página.
 * - Utiliza IntersectionObserver para revelar elementos com a classe "reveal" ao entrarem na viewport.
 *
 * Autor: Eduardo Fernandes
 * Data: [Data de Criação]
 */

(() => {
  // Aguarda o carregamento completo do DOM.
  document.addEventListener('DOMContentLoaded', () => {
    const body = document.querySelector('body');
    if (body) {
      // Caso esteja utilizando uma classe "preload" para evitar flickering, remova-a e adicione "loaded"
      body.classList.remove('preload');
      body.classList.add('loaded');
    }

    // Seleciona todos os elementos que devem ser revelados ao rolar a página.
    const revealElements = document.querySelectorAll('.reveal');

    // Verifica se o navegador suporta IntersectionObserver
    if ('IntersectionObserver' in window && revealElements.length > 0) {
      const observerOptions = {
        threshold: 0.1 // Inicia a animação quando 10% do elemento estiver visível
      };

      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible'); // Adiciona a classe que ativa a animação
            observer.unobserve(entry.target); // Para de observar após a revelação
          }
        });
      }, observerOptions);

      revealElements.forEach(el => revealObserver.observe(el));
    } else {
      // Fallback: caso IntersectionObserver não esteja disponível, revela todos os elementos imediatamente.
      revealElements.forEach(el => el.classList.add('visible'));
    }
  });
})();
