const GRAPH = {
  nodes: [
    { id: 'A', x: 90, y: 190 },
    { id: 'B', x: 220, y: 70 },
    { id: 'C', x: 225, y: 310 },
    { id: 'D', x: 425, y: 55 },
    { id: 'E', x: 430, y: 195 },
    { id: 'F', x: 435, y: 330 },
    { id: 'G', x: 690, y: 70 },
    { id: 'H', x: 700, y: 200 },
    { id: 'I', x: 920, y: 190 },
  ],
  edges: [
      ['A', 'B', 2],
      ['A', 'C', 5],
      ['A', 'E', 3],
      ['B', 'D', 1],
      ['B', 'E', 4],
      ['C', 'F', 2],
      ['C', 'E', 1],
      ['D', 'E', 2],
      ['D', 'G', 3],
      ['D', 'F', 7],
      ['E', 'H', 4],
      ['E', 'F', 3],
      ['F', 'H', 3],
      ['G', 'H', 2],
      ['G', 'I', 5],
      ['H', 'I', 2],
      ['C', 'D', 6],
    ],
  };

const COPY = {
  pt: {
    arraySummaries: {
      linear_search: 'Varre elemento por elemento até encontrar o alvo ou acabar.',
      binary_search: 'Exige array ordenado e corta o espaço de busca pela metade.',
      bubble_sort: 'Compara pares adjacentes e empurra os maiores para o fim.',
      insertion_sort: 'Mantém uma parte já ordenada e insere o próximo elemento no lugar certo.',
      selection_sort: 'Procura o menor valor restante e troca com a posição atual.',
    },
    graphSummaries: {
      bfs: 'Largura primeiro: visita por camadas usando fila.',
      dfs: 'Profundidade primeiro: desce um caminho antes de voltar.',
      dijkstra: 'Caminho mínimo em grafo com pesos não negativos.',
    },
    labels: {
      linear_search: 'Busca linear',
      binary_search: 'Busca binária',
      bubble_sort: 'Bubble sort',
      insertion_sort: 'Insertion sort',
      selection_sort: 'Selection sort',
    },
    phrases: {
      foundAt: (target, index) => `alvo ${target} encontrado no índice ${index}.`,
      comparingWith: (value, target) => `comparando ${value} com ${target}.`,
      sortedBeforeSearch: 'array ordenado antes da busca.',
      binaryWindow: (low, high, mid, value) => `low=${low}, high=${high}, mid=${mid}, valor=${value}.`,
      comparingPair: (left, right) => `comparando ${left} e ${right}.`,
      swapRight: 'troca feita para empurrar o maior para a direita.',
      fixedEnd: 'o elemento da ponta já está fixo.',
      firstOrdered: 'começamos tratando o primeiro elemento como ordenado.',
      insertValue: (value) => `vamos inserir ${value} na parte já ordenada.`,
      shifting: (value) => `deslocando ${value} para abrir espaço.`,
      placedAt: (value, index) => `${value} encaixado no índice ${index}.`,
      findingSmallest: 'procurando o menor valor restante.',
      fixedSmallest: (index) => `menor valor fixado na posição ${index}.`,
    },
    graphOrderEmpty: '...',
    byte: 'byte',
  },
  en: {
    arraySummaries: {
      linear_search: 'Scans one element at a time until it finds the target or reaches the end.',
      binary_search: 'Requires a sorted array and cuts the search space in half.',
      bubble_sort: 'Compares adjacent pairs and pushes larger values toward the end.',
      insertion_sort: 'Keeps a sorted prefix and inserts the next value into the correct place.',
      selection_sort: 'Finds the smallest remaining value and swaps it into the current position.',
    },
    graphSummaries: {
      bfs: 'Breadth first: visits layer by layer with a queue.',
      dfs: 'Depth first: goes down one branch before backtracking.',
      dijkstra: 'Shortest path for graphs with non-negative weights.',
    },
    labels: {
      linear_search: 'Linear search',
      binary_search: 'Binary search',
      bubble_sort: 'Bubble sort',
      insertion_sort: 'Insertion sort',
      selection_sort: 'Selection sort',
    },
    phrases: {
      foundAt: (target, index) => `target ${target} found at index ${index}.`,
      comparingWith: (value, target) => `comparing ${value} with ${target}.`,
      sortedBeforeSearch: 'array sorted before search.',
      binaryWindow: (low, high, mid, value) => `low=${low}, high=${high}, mid=${mid}, value=${value}.`,
      comparingPair: (left, right) => `comparing ${left} and ${right}.`,
      swapRight: 'swap made to push the larger value to the right.',
      fixedEnd: 'the edge element is now fixed.',
      firstOrdered: 'we start by treating the first element as sorted.',
      insertValue: (value) => `we are inserting ${value} into the sorted section.`,
      shifting: (value) => `shifting ${value} to open space.`,
      placedAt: (value, index) => `${value} placed at index ${index}.`,
      findingSmallest: 'searching for the smallest remaining value.',
      fixedSmallest: (index) => `smallest value fixed at position ${index}.`,
    },
    graphOrderEmpty: '...',
    byte: 'byte',
  },
};

export function mountAlgorithmStudio(root) {
  const locale = root.dataset.locale === 'pt' ? 'pt' : 'en';
  const copy = COPY[locale];

  const arrayInput = root.querySelector('[data-array-input]');
  const arrayCountInput = root.querySelector('[data-array-count]');
  const targetInput = root.querySelector('[data-target-input]');
  const arrayAlgorithm = root.querySelector('[data-array-algorithm]');
  const arraySpeed = root.querySelector('[data-array-speed]');
  const arrayRun = root.querySelector('[data-array-run]');
  const arrayRandomize = root.querySelector('[data-array-randomize]');
  const arrayReset = root.querySelector('[data-array-reset]');
  const arrayStage = root.querySelector('[data-array-stage]');
  const arrayExplanation = root.querySelector('[data-array-explanation]');
  const arraySummary = root.querySelector('[data-array-summary]');

  const graphAlgorithm = root.querySelector('[data-graph-algorithm]');
  const graphStart = root.querySelector('[data-graph-start]');
  const graphSpeed = root.querySelector('[data-graph-speed]');
  const graphRun = root.querySelector('[data-graph-run]');
  const graphReset = root.querySelector('[data-graph-reset]');
  const graphSvg = root.querySelector('[data-graph-svg]');
  const graphOrder = root.querySelector('[data-graph-order]');
  const distanceTable = root.querySelector('[data-distance-table]');
  const graphSummary = root.querySelector('[data-graph-summary]');

  let arrayToken = 0;
  let graphToken = 0;
  let audioContext = null;

  const wait = (delay) => new Promise((resolve) => window.setTimeout(resolve, delay));

  const getAudioContext = async () => {
    if (!window.AudioContext && !window.webkitAudioContext) return null;
    if (!audioContext) {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioCtor();
    }
    if (audioContext.state === 'suspended') {
      try {
        await audioContext.resume();
      } catch (error) {
        return null;
      }
    }
    return audioContext;
  };

  const playStepTone = async (step) => {
    const context = await getAudioContext();
    if (!context) return;

    const activeIndex = step.active?.[0] ?? 0;
    const focusValue = step.values?.[activeIndex] ?? step.values?.[0] ?? 40;
    const frequency = Math.max(180, Math.min(880, 180 + focusValue * 6));
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = step.found?.length ? 'triangle' : 'sine';
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.035, context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.08);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.085);
  };

  const playGraphTone = async (step, algorithm) => {
    const context = await getAudioContext();
    if (!context || !step.current) return;

    const nodeOffset = step.current.charCodeAt(0) - 65;
    const frequency = Math.max(200, Math.min(920, 240 + nodeOffset * 55));
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = algorithm === 'dijkstra' ? 'triangle' : algorithm === 'dfs' ? 'square' : 'sine';
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.03, context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.11);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.12);
  };

  const parseArrayInput = () => arrayInput.value
    .split(',')
    .map((chunk) => Number.parseInt(chunk.trim(), 10))
    .filter((value) => Number.isFinite(value));

  const getRequestedArrayCount = () => {
    const requested = Number.parseInt(arrayCountInput?.value ?? '8', 10);
    return Math.max(4, Math.min(16, Number.isFinite(requested) ? requested : 8));
  };

  const getGraphDelay = () => {
    const minDelay = 150;
    const maxDelay = 1200;
    const speedValue = Number.parseInt(graphSpeed.value, 10);
    const clamped = Math.max(minDelay, Math.min(maxDelay, Number.isFinite(speedValue) ? speedValue : 420));
    return maxDelay + minDelay - clamped;
  };

  const renderArrayState = (step) => {
    const max = Math.max(...step.values, 1);
    arrayStage.innerHTML = '';
    step.values.forEach((value, index) => {
      const cell = document.createElement('div');
      cell.className = 'array-bar';
      if (step.active?.includes(index)) cell.classList.add('is-active');
      if (step.found?.includes(index)) cell.classList.add('is-found');
      if (step.sorted?.includes(index)) cell.classList.add('is-sorted');
      if (step.low === index) cell.classList.add('is-low');
      if (step.high === index) cell.classList.add('is-high');
      if (step.mid === index) cell.classList.add('is-mid');
      const height = 48 + Math.round((value / max) * 110);
      cell.innerHTML = `<span>${value}</span><i style="height:${height}px"></i>`;
      arrayStage.append(cell);
    });
    arrayExplanation.textContent = step.note || '';
  };

  const linearSearchSteps = (values, target) => {
    const steps = [];
    for (let index = 0; index < values.length; index += 1) {
      const found = values[index] === target;
      steps.push({
        values: [...values],
        active: [index],
        found: found ? [index] : [],
        sorted: [],
        note: found
          ? `${copy.labels.linear_search}: ${copy.phrases.foundAt(target, index)}`
          : `${copy.labels.linear_search}: ${copy.phrases.comparingWith(values[index], target)}`,
      });
      if (found) break;
    }
    return steps;
  };

  const binarySearchSteps = (values, target) => {
    const sortedValues = [...values].sort((a, b) => a - b);
    const steps = [{
      values: [...sortedValues],
      active: [],
      found: [],
      sorted: [],
      note: `${copy.labels.binary_search}: ${copy.phrases.sortedBeforeSearch}`,
    }];
    let low = 0;
    let high = sortedValues.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const found = sortedValues[mid] === target;
      steps.push({
        values: [...sortedValues],
        active: [mid],
        found: found ? [mid] : [],
        sorted: [],
        low,
        high,
        mid,
        note: found
          ? `${copy.labels.binary_search}: ${copy.phrases.foundAt(target, mid)}`
          : `${copy.labels.binary_search}: ${copy.phrases.binaryWindow(low, high, mid, sortedValues[mid])}`,
      });
      if (found) break;
      if (sortedValues[mid] < target) low = mid + 1;
      else high = mid - 1;
    }

    return steps;
  };

  const bubbleSortSteps = (values) => {
    const arr = [...values];
    const steps = [];
    for (let end = arr.length - 1; end > 0; end -= 1) {
      for (let index = 0; index < end; index += 1) {
        steps.push({
          values: [...arr],
          active: [index, index + 1],
          found: [],
          sorted: Array.from({ length: arr.length - 1 - end }, (_, offset) => arr.length - 1 - offset),
          note: `${copy.labels.bubble_sort}: ${copy.phrases.comparingPair(arr[index], arr[index + 1])}`,
        });
        if (arr[index] > arr[index + 1]) {
          [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
          steps.push({
            values: [...arr],
            active: [index, index + 1],
            found: [],
            sorted: Array.from({ length: arr.length - 1 - end }, (_, offset) => arr.length - 1 - offset),
            note: `${copy.labels.bubble_sort}: ${copy.phrases.swapRight}`,
          });
        }
      }
      steps.push({
        values: [...arr],
        active: [],
        found: [],
        sorted: Array.from({ length: arr.length - end }, (_, offset) => arr.length - 1 - offset),
        note: `${copy.labels.bubble_sort}: ${copy.phrases.fixedEnd}`,
      });
    }
    return steps;
  };

  const insertionSortSteps = (values) => {
    const arr = [...values];
    const steps = [{
      values: [...arr],
      active: [0],
      found: [],
      sorted: [0],
      note: `${copy.labels.insertion_sort}: ${copy.phrases.firstOrdered}`,
    }];

    for (let index = 1; index < arr.length; index += 1) {
      const key = arr[index];
      let cursor = index - 1;
      steps.push({
        values: [...arr],
        active: [index],
        found: [],
        sorted: Array.from({ length: index }, (_, item) => item),
        note: `${copy.labels.insertion_sort}: ${copy.phrases.insertValue(key)}`,
      });

      while (cursor >= 0 && arr[cursor] > key) {
        arr[cursor + 1] = arr[cursor];
        steps.push({
          values: [...arr],
          active: [cursor, cursor + 1],
          found: [],
          sorted: Array.from({ length: index }, (_, item) => item),
          note: `${copy.labels.insertion_sort}: ${copy.phrases.shifting(arr[cursor])}`,
        });
        cursor -= 1;
      }

      arr[cursor + 1] = key;
      steps.push({
        values: [...arr],
        active: [cursor + 1],
        found: [],
        sorted: Array.from({ length: index + 1 }, (_, item) => item),
        note: `${copy.labels.insertion_sort}: ${copy.phrases.placedAt(key, cursor + 1)}`,
      });
    }
    return steps;
  };

  const selectionSortSteps = (values) => {
    const arr = [...values];
    const steps = [];
    for (let index = 0; index < arr.length - 1; index += 1) {
      let minIndex = index;
      for (let cursor = index + 1; cursor < arr.length; cursor += 1) {
        if (arr[cursor] < arr[minIndex]) minIndex = cursor;
        steps.push({
          values: [...arr],
          active: [index, cursor, minIndex],
          found: [],
          sorted: Array.from({ length: index }, (_, item) => item),
          note: `${copy.labels.selection_sort}: ${copy.phrases.findingSmallest}`,
        });
      }
      [arr[index], arr[minIndex]] = [arr[minIndex], arr[index]];
      steps.push({
        values: [...arr],
        active: [index, minIndex],
        found: [],
        sorted: Array.from({ length: index + 1 }, (_, item) => item),
        note: `${copy.labels.selection_sort}: ${copy.phrases.fixedSmallest(index)}`,
      });
    }
    return steps;
  };

  const getArraySteps = (algorithm, values, target) => {
    if (algorithm === 'linear_search') return linearSearchSteps(values, target);
    if (algorithm === 'binary_search') return binarySearchSteps(values, target);
    if (algorithm === 'bubble_sort') return bubbleSortSteps(values);
    if (algorithm === 'insertion_sort') return insertionSortSteps(values);
    return selectionSortSteps(values);
  };

  const renderInitialArrayState = () => {
    const values = parseArrayInput();
    renderArrayState({
      values,
      active: [],
      found: [],
      sorted: [],
      note: copy.arraySummaries[arrayAlgorithm.value],
    });
    arraySummary.textContent = copy.arraySummaries[arrayAlgorithm.value];
  };

  const animateArrayAlgorithm = async () => {
    const values = parseArrayInput();
    if (!values.length) return;
    const target = Number.parseInt(targetInput.value, 10);
    const algorithm = arrayAlgorithm.value;
    const delay = Number.parseInt(arraySpeed.value, 10);
    const token = ++arrayToken;
    const steps = getArraySteps(algorithm, values, target);

    arraySummary.textContent = copy.arraySummaries[algorithm];
    for (const step of steps) {
      if (token !== arrayToken) return;
      renderArrayState(step);
      playStepTone(step);
      await wait(delay);
    }
  };

  const adjacency = {};
  GRAPH.nodes.forEach((node) => {
    adjacency[node.id] = [];
  });
  GRAPH.edges.forEach(([from, to, weight]) => {
    adjacency[from].push({ node: to, weight });
    adjacency[to].push({ node: from, weight });
  });
  Object.values(adjacency).forEach((edges) => edges.sort((a, b) => a.node.localeCompare(b.node)));

  const initialDistances = () => Object.fromEntries(GRAPH.nodes.map((node) => [node.id, '∞']));

  const renderGraphState = (step) => {
    const nodeMap = new Map(GRAPH.nodes.map((node) => [node.id, node]));
    graphSvg.innerHTML = '';

    GRAPH.edges.forEach(([from, to, weight]) => {
      const a = nodeMap.get(from);
      const b = nodeMap.get(to);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', a.x);
      line.setAttribute('y1', a.y);
      line.setAttribute('x2', b.x);
      line.setAttribute('y2', b.y);
      line.setAttribute('class', 'graph-edge');
      graphSvg.append(line);

      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', (a.x + b.x) / 2);
      label.setAttribute('y', (a.y + b.y) / 2 - 6);
      label.setAttribute('class', 'graph-weight');
      label.textContent = String(weight);
      graphSvg.append(label);
    });

    GRAPH.nodes.forEach((node) => {
      const isVisited = step.visited.includes(node.id);
      const isCurrent = step.current === node.id;

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', node.x);
      circle.setAttribute('cy', node.y);
      circle.setAttribute('r', 28);
      circle.setAttribute('class', `graph-node${isVisited ? ' is-visited' : ''}${isCurrent ? ' is-current' : ''}`);
      graphSvg.append(circle);

      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', node.x);
      label.setAttribute('y', node.y + 6);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('class', 'graph-node-label');
      label.textContent = node.id;
      graphSvg.append(label);
    });

    graphOrder.textContent = step.order.length ? step.order.join(' -> ') : copy.graphOrderEmpty;
    distanceTable.innerHTML = '';
    Object.entries(step.distances ?? {}).forEach(([node, value]) => {
      const row = document.createElement('div');
      row.className = 'distance-row';
      row.innerHTML = `<span>${node}</span><strong>${value}</strong>`;
      distanceTable.append(row);
    });
  };

  const getBfsSteps = (start) => {
    const queue = [start];
    const visited = new Set([start]);
    const order = [];
    const steps = [];

    while (queue.length) {
      const current = queue.shift();
      order.push(current);
      steps.push({ visited: [...visited], current, order: [...order], distances: initialDistances() });
      adjacency[current].forEach(({ node }) => {
        if (!visited.has(node)) {
          visited.add(node);
          queue.push(node);
        }
      });
    }
    return steps;
  };

  const getDfsSteps = (start) => {
    const stack = [start];
    const visited = new Set();
    const order = [];
    const steps = [];

    while (stack.length) {
      const current = stack.pop();
      if (visited.has(current)) continue;
      visited.add(current);
      order.push(current);
      steps.push({ visited: [...visited], current, order: [...order], distances: initialDistances() });
      [...adjacency[current]].reverse().forEach(({ node }) => {
        if (!visited.has(node)) stack.push(node);
      });
    }
    return steps;
  };

  const getDijkstraSteps = (start) => {
    const distances = Object.fromEntries(GRAPH.nodes.map((node) => [node.id, Infinity]));
    distances[start] = 0;
    const visited = new Set();
    const order = [];
    const steps = [];

    while (visited.size < GRAPH.nodes.length) {
      let current = null;
      let best = Infinity;

      Object.entries(distances).forEach(([node, distance]) => {
        if (!visited.has(node) && distance < best) {
          best = distance;
          current = node;
        }
      });

      if (!current) break;
      visited.add(current);
      order.push(current);

      adjacency[current].forEach(({ node, weight }) => {
        const candidate = distances[current] + weight;
        if (candidate < distances[node]) distances[node] = candidate;
      });

      steps.push({
        visited: [...visited],
        current,
        order: [...order],
        distances: Object.fromEntries(
          Object.entries(distances).map(([node, distance]) => [node, Number.isFinite(distance) ? distance : '∞'])
        ),
      });
    }

    return steps;
  };

  const getGraphSteps = (algorithm, start) => {
    if (algorithm === 'bfs') return getBfsSteps(start);
    if (algorithm === 'dfs') return getDfsSteps(start);
    return getDijkstraSteps(start);
  };

  const animateGraph = async () => {
    const algorithm = graphAlgorithm.value;
    const start = graphStart.value;
    const delay = getGraphDelay();
    const token = ++graphToken;
    const steps = getGraphSteps(algorithm, start);

    graphSummary.textContent = copy.graphSummaries[algorithm];
    for (const step of steps) {
      if (token !== graphToken) return;
      renderGraphState(step);
      playGraphTone(step, algorithm);
      await wait(delay);
    }
  };

  const onArrayRandomize = () => {
    const count = getRequestedArrayCount();
    const sample = Array.from({ length: count }, () => Math.floor(Math.random() * 90) + 10);
    arrayInput.value = sample.join(', ');
    targetInput.value = String(sample[Math.floor(Math.random() * sample.length)]);
    renderInitialArrayState();
  };

  const onArrayReset = () => {
    arrayToken += 1;
    renderInitialArrayState();
  };

  const onGraphReset = () => {
    graphToken += 1;
    graphSummary.textContent = copy.graphSummaries[graphAlgorithm.value];
    renderGraphState({ visited: [], current: null, order: [], distances: initialDistances() });
  };

  arrayRun.addEventListener('click', animateArrayAlgorithm);
  arrayRandomize.addEventListener('click', onArrayRandomize);
  arrayReset.addEventListener('click', onArrayReset);
  arrayAlgorithm.addEventListener('change', renderInitialArrayState);
  graphRun.addEventListener('click', animateGraph);
  graphReset.addEventListener('click', onGraphReset);
  graphAlgorithm.addEventListener('change', () => {
    graphSummary.textContent = copy.graphSummaries[graphAlgorithm.value];
  });

  renderInitialArrayState();
  graphSummary.textContent = copy.graphSummaries[graphAlgorithm.value];
  renderGraphState({ visited: [], current: null, order: [], distances: initialDistances() });

  return () => {
    if (audioContext && audioContext.state !== 'closed') {
      audioContext.close();
    }
    arrayRun.removeEventListener('click', animateArrayAlgorithm);
    arrayRandomize.removeEventListener('click', onArrayRandomize);
    arrayReset.removeEventListener('click', onArrayReset);
    arrayAlgorithm.removeEventListener('change', renderInitialArrayState);
    graphRun.removeEventListener('click', animateGraph);
    graphReset.removeEventListener('click', onGraphReset);
  };
}
