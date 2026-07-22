// Translation mapping for English sidebar
const sidebarTranslations = {
  'Loja': 'Shop',
  'Blog': 'Blog',
  'Artigos Técnicos': 'Technical Articles',
  'Referência': 'Reference',
  'Notas de Arquitetura': 'Architecture Notes',
  'Padrões de Engenharia': 'Engineering Standards',
  'Estruturas de Dados e Algoritmos': 'Data Structures & Algorithms',
  'Tutoriais': 'Tutorials',
  'Hello World no C++': 'Hello World in C++',
  'Projetos': 'Projects',
};

// Only translate if on English locale
if (window.location.pathname.startsWith('/en/')) {
  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', () => {
    // Find all sidebar labels and translate them
    const sidebar = document.querySelector('[aria-label*="ide"]');
    if (sidebar) {
      const labels = sidebar.querySelectorAll('[role="button"], a, span');
      labels.forEach(label => {
        const text = label.textContent?.trim();
        if (text && sidebarTranslations[text]) {
          label.textContent = sidebarTranslations[text];
        }
      });
    }
  });
}
