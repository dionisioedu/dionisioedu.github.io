/**
 * Knowledge Graph Data Structure
 * 
 * Represents the organization of the site's content
 * in a hierarchical knowledge graph format
 */

export const graphData = {
  // Central hub
  root: {
    id: "Learning Hub",
    level: 0,
    radius: 0.25,
  },

  // Primary domains (Level 1)
  domains: [
    {
      id: "Algorithms & Data Structures",
      level: 1,
      radius: 0.18,
      url: "/pt/reference/dsa/",
      color: 0x3b82f6, // blue
      description: "Análise de complexidade, estruturas de dados e algoritmos fundamentais",
      icon: "∑",
    },
    {
      id: "Software Engineering",
      level: 1,
      radius: 0.18,
      url: "/pt/reference/",
      color: 0x8b5cf6, // violet
      description: "Princípios, padrões e melhores práticas de engenharia de software",
      icon: "⚙️",
    },
    {
      id: "Technical Articles",
      level: 1,
      radius: 0.18,
      url: "/pt/artigos-tecnicos/",
      color: 0xf59e0b, // amber
      description: "Artigos aprofundados sobre tópicos essenciais da programação",
      icon: "📚",
    },
    {
      id: "Code & Tutorials",
      level: 1,
      radius: 0.16,
      url: "/pt/tutorials/",
      color: 0x10b981, // emerald
      description: "Tutoriais práticos e exemplos de código prontos para aprender",
      icon: "💻",
    },
    {
      id: "Architecture & Design",
      level: 1,
      radius: 0.16,
      url: "/pt/reference/architecture/",
      color: 0xef4444, // red
      description: "Padrões de design, arquitetura de sistemas e decisões de projeto",
      icon: "🏗️",
    },
  ],

  // Specific topics (Level 2)
  topics: [
    // Under DSA
    {
      id: "Complexity Analysis",
      level: 2,
      parent: "Algorithms & Data Structures",
      radius: 0.12,
      url: "/pt/artigos-tecnicos/bigo/",
      description: "Notação Big-O, análise assintótica e medida de desempenho",
    },
    {
      id: "Algorithm Design",
      level: 2,
      parent: "Algorithms & Data Structures",
      radius: 0.12,
      url: "/pt/reference/dsa/",
      description: "Estratégias de design, paradigmas e implementações",
    },

    // Under Software Engineering
    {
      id: "Code Quality",
      level: 2,
      parent: "Software Engineering",
      radius: 0.12,
      url: "/pt/artigos-tecnicos/clean-code/",
      description: "Código limpo, legibilidade, refatoração e manutenibilidade",
    },
    {
      id: "Reliability Engineering",
      level: 2,
      parent: "Software Engineering",
      radius: 0.12,
      url: "/pt/artigos-tecnicos/sre/",
      description: "SLI, SLO, error budgets e confiabilidade de sistemas",
    },
    {
      id: "Best Practices",
      level: 2,
      parent: "Software Engineering",
      radius: 0.12,
      url: "/pt/reference/standards/",
      description: "Padrões, conventions e diretrizes de desenvolvimento",
    },

    // Under Architecture
    {
      id: "System Design",
      level: 2,
      parent: "Architecture & Design",
      radius: 0.12,
      url: "/pt/reference/architecture/",
      description: "Design de sistemas distribuídos, escalabilidade e trade-offs",
    },
    {
      id: "Design Patterns",
      level: 2,
      parent: "Architecture & Design",
      radius: 0.12,
      url: "/pt/projects/",
      description: "Padrões criacionais, estruturais e comportamentais",
    },

    // Under Tutorials
    {
      id: "C++ Fundamentals",
      level: 2,
      parent: "Code & Tutorials",
      radius: 0.11,
      url: "/pt/tutorials/hello-world-cpp/",
      description: "Introdução prática à linguagem C++ e seus conceitos",
    },

    // Under Articles
    {
      id: "Learning Resources",
      level: 2,
      parent: "Technical Articles",
      radius: 0.12,
      url: "/pt/books/",
      description: "eBooks, guias e recursos de aprendizado recomendados",
    },
  ],

  // Edges connecting nodes
  edges: [
    // Root to primary domains
    ["Learning Hub", "Algorithms & Data Structures"],
    ["Learning Hub", "Software Engineering"],
    ["Learning Hub", "Technical Articles"],
    ["Learning Hub", "Code & Tutorials"],
    ["Learning Hub", "Architecture & Design"],

    // Domains to topics
    ["Algorithms & Data Structures", "Complexity Analysis"],
    ["Algorithms & Data Structures", "Algorithm Design"],
    ["Software Engineering", "Code Quality"],
    ["Software Engineering", "Reliability Engineering"],
    ["Software Engineering", "Best Practices"],
    ["Architecture & Design", "System Design"],
    ["Architecture & Design", "Design Patterns"],
    ["Code & Tutorials", "C++ Fundamentals"],
    ["Technical Articles", "Learning Resources"],

    // Cross-domain connections (interesting relationships)
    ["Complexity Analysis", "Algorithm Design"],
    ["Code Quality", "Best Practices"],
    ["Design Patterns", "System Design"],
    ["Reliability Engineering", "Best Practices"],
  ],

  // Positioning strategy (will be computed with force simulation)
  // but we can provide hints
  positioning: {
    // How many levels of nodes to display
    maxLevels: 2,
    
    // Orbital radius for each level
    levelRadius: {
      0: 0,
      1: 2.0,
      2: 3.5,
    },

    // Force simulation parameters
    forceStrength: 0.3,
    repulsion: 0.5,
    linkDistance: 1.2,
  },
};

/**
 * Compute positions for graph nodes using a force-directed layout
 * Returns array of { id, position: Vector3, metadata }
 */
export function computeGraphPositions(data) {
  const nodes = [];
  const nodeMap = new Map();

  // Add root
  const rootNode = { ...data.root, position: [0, 0, 0] };
  nodes.push(rootNode);
  nodeMap.set(data.root.id, rootNode);

  // Add domains at level 1
  const domainCount = data.domains.length;
  data.domains.forEach((domain, i) => {
    const angle = (i / domainCount) * Math.PI * 2;
    const radius = data.positioning.levelRadius[1];
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = (Math.random() - 0.5) * 0.3; // slight y variation

    const node = {
      ...domain,
      position: [x, y, z],
    };
    nodes.push(node);
    nodeMap.set(domain.id, node);
  });

  // Add topics at level 2 - position relative to parent
  data.topics.forEach((topic) => {
    const parent = nodeMap.get(topic.parent);
    if (!parent) return;

    const parentPos = parent.position;
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.0 + Math.random() * 0.4;

    const x = parentPos[0] + Math.cos(angle) * radius;
    const z = parentPos[2] + Math.sin(angle) * radius;
    const y = parentPos[1] + (Math.random() - 0.5) * 0.4;

    const node = {
      ...topic,
      position: [x, y, z],
    };
    nodes.push(node);
    nodeMap.set(topic.id, node);
  });

  return { nodes, nodeMap, edges: data.edges };
}

/**
 * Get all nodes from the graph data
 */
export function getAllNodes(data) {
  return [data.root, ...data.domains, ...data.topics];
}
