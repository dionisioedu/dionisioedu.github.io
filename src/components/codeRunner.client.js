import { CodeJar } from 'codejar';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';

const COPY = {
  pt: {
    ready: 'Pronto para executar.',
    loadingPython: 'Carregando runtime de Python no navegador...',
    pythonReady: 'Python pronto.',
    timeout: 'Execução interrompida por tempo limite para evitar travar a página.',
    returned: 'Valor retornado',
    error: 'Erro',
    examples: {
      javascript: [
        {
          label: 'Somando preços em centavos',
          code: `const prices = [1990, 2550, 899, 1200];
const total = prices.reduce((sum, value) => sum + value, 0);

console.log('Total em centavos:', total);
console.log('Total em reais:', (total / 100).toFixed(2));

return total;`,
        },
        {
          label: 'Frequência de caracteres',
          code: `const text = 'devdevops';
const freq = {};

for (const ch of text) {
  freq[ch] = (freq[ch] ?? 0) + 1;
}

console.log(freq);
return Object.entries(freq);`,
        },
        {
          label: 'Busca linear simples',
          code: `const values = [12, 5, 8, 99, 31];
const target = 99;

let foundAt = -1;
for (let i = 0; i < values.length; i += 1) {
  if (values[i] === target) {
    foundAt = i;
    break;
  }
}

console.log('Índice encontrado:', foundAt);
return foundAt;`,
        },
      ],
      python: [
        {
          label: 'Decimal para binário',
          code: `value = 65
binary = format(value, '08b')

print('Decimal:', value)
print('Binário:', binary)
print('Hex:', hex(value))
print('ASCII:', chr(value))`,
        },
        {
          label: 'Insertion sort',
          code: `values = [9, 4, 1, 7, 3]

for i in range(1, len(values)):
    key = values[i]
    j = i - 1

    while j >= 0 and values[j] > key:
        values[j + 1] = values[j]
        j -= 1

    values[j + 1] = key

print(values)`,
        },
        {
          label: 'Contando palavras',
          code: `sentence = 'python python dev logic dev python'
counts = {}

for word in sentence.split():
    counts[word] = counts.get(word, 0) + 1

print(counts)`,
        },
      ],
    },
  },
  en: {
    ready: 'Ready to run.',
    loadingPython: 'Loading the Python runtime in the browser...',
    pythonReady: 'Python ready.',
    timeout: 'Execution stopped by timeout to avoid freezing the page.',
    returned: 'Returned value',
    error: 'Error',
    examples: {
      javascript: [
        {
          label: 'Summing prices in cents',
          code: `const prices = [1990, 2550, 899, 1200];
const total = prices.reduce((sum, value) => sum + value, 0);

console.log('Total in cents:', total);
console.log('Total in dollars:', (total / 100).toFixed(2));

return total;`,
        },
        {
          label: 'Character frequency counter',
          code: `const text = 'devdevops';
const freq = {};

for (const ch of text) {
  freq[ch] = (freq[ch] ?? 0) + 1;
}

console.log(freq);
return Object.entries(freq);`,
        },
        {
          label: 'Simple linear search',
          code: `const values = [12, 5, 8, 99, 31];
const target = 99;

let foundAt = -1;
for (let i = 0; i < values.length; i += 1) {
  if (values[i] === target) {
    foundAt = i;
    break;
  }
}

console.log('Found index:', foundAt);
return foundAt;`,
        },
      ],
      python: [
        {
          label: 'Decimal to binary',
          code: `value = 65
binary = format(value, '08b')

print('Decimal:', value)
print('Binary:', binary)
print('Hex:', hex(value))
print('ASCII:', chr(value))`,
        },
        {
          label: 'Insertion sort',
          code: `values = [9, 4, 1, 7, 3]

for i in range(1, len(values)):
    key = values[i]
    j = i - 1

    while j >= 0 and values[j] > key:
        values[j + 1] = values[j]
        j -= 1

    values[j + 1] = key

print(values)`,
        },
        {
          label: 'Counting words',
          code: `sentence = 'python python dev logic dev python'
counts = {}

for word in sentence.split():
    counts[word] = counts.get(word, 0) + 1

print(counts)`,
        },
      ],
    },
  },
};

export function mountCodeRunner(root) {
  const locale = root.dataset.locale === 'pt' ? 'pt' : 'en';
  const copy = COPY[locale];
  const editor = root.querySelector('[data-runner-editor]');
  const exampleSelect = root.querySelector('[data-runner-example]');
  const languageSelect = root.querySelector('[data-language-select]');
  const output = root.querySelector('[data-runner-output]');
  const status = root.querySelector('[data-runner-status]');
  const runButton = root.querySelector('[data-runner-run]');
  const resetButton = root.querySelector('[data-runner-reset]');
  const clearButton = root.querySelector('[data-runner-clear]');

  let language = 'javascript';
  let runToken = 0;
  let pyodide = null;
  let pyodidePromise = null;
  let currentCode = '';

  const highlight = (element) => {
    const code = element.textContent ?? '';
    const grammar = language === 'python' ? Prism.languages.python : Prism.languages.javascript;
    element.className = `runner-editor language-${language}`;
    element.innerHTML = Prism.highlight(code, grammar, language);
  };

  const jar = CodeJar(editor, highlight, {
    tab: '  ',
  });

  jar.onUpdate((code) => {
    currentCode = code;
  });

  const appendOutput = (text) => {
    const chunk = String(text ?? '');
    output.textContent += chunk.endsWith('\n') ? chunk : `${chunk}\n`;
  };

  const populateExamples = (resetEditor = true) => {
    const examples = copy.examples[language];
    languageSelect.value = language;
    exampleSelect.innerHTML = '';
    examples.forEach((example, index) => {
      const option = document.createElement('option');
      option.value = String(index);
      option.textContent = example.label;
      exampleSelect.append(option);
    });

    if (resetEditor) {
      exampleSelect.value = '0';
      jar.updateCode(examples[0].code);
      currentCode = examples[0].code;
    }

    status.textContent = copy.ready;
  };

  const loadPyodideRuntime = async () => {
    if (pyodide) return pyodide;
    if (pyodidePromise) return pyodidePromise;

    status.textContent = copy.loadingPython;
    pyodidePromise = import('https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.mjs')
      .then(async ({ loadPyodide }) => {
        pyodide = await loadPyodide({ stdout: () => {}, stderr: () => {} });
        pyodide.setStdout({ batched: (value) => appendOutput(value) });
        pyodide.setStderr({ batched: (value) => appendOutput(`${copy.error}: ${value}`) });
        status.textContent = copy.pythonReady;
        return pyodide;
      });

    return pyodidePromise;
  };

  const runJavaScript = (code, token) => new Promise((resolve, reject) => {
    const workerSource = `
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

      function serialize(value) {
        try {
          if (typeof value === 'string') return value;
          return JSON.stringify(value);
        } catch (error) {
          return String(value);
        }
      }

      console.log = (...args) => postMessage({ type: 'log', value: args.map(serialize).join(' ') });
      console.error = (...args) => postMessage({ type: 'error', value: args.map(serialize).join(' ') });

      self.onmessage = async (event) => {
        try {
          const fn = new AsyncFunction(event.data.code);
          const result = await fn();
          postMessage({ type: 'done', value: result });
        } catch (error) {
          postMessage({ type: 'exception', value: error.stack || String(error) });
        }
      };
    `;

    const worker = new Worker(URL.createObjectURL(new Blob([workerSource], { type: 'text/javascript' })));
    const timeout = window.setTimeout(() => {
      worker.terminate();
      reject(new Error(copy.timeout));
    }, 2500);

    worker.onmessage = (event) => {
      if (token !== runToken) {
        worker.terminate();
        window.clearTimeout(timeout);
        return;
      }

      if (event.data.type === 'log') {
        appendOutput(event.data.value);
        return;
      }

      if (event.data.type === 'error') {
        appendOutput(`${copy.error}: ${event.data.value}`);
        return;
      }

      if (event.data.type === 'exception') {
        worker.terminate();
        window.clearTimeout(timeout);
        reject(new Error(event.data.value));
        return;
      }

      if (event.data.type === 'done') {
        worker.terminate();
        window.clearTimeout(timeout);
        resolve(event.data.value);
      }
    };

    worker.postMessage({ code });
  });

  const runCode = async () => {
    const token = ++runToken;
    output.textContent = '';

    try {
      if (language === 'javascript') {
        status.textContent = 'JavaScript...';
        const result = await runJavaScript(currentCode || editor.textContent || '', token);
        if (result !== undefined) appendOutput(`${copy.returned}: ${JSON.stringify(result)}`);
        if (token === runToken) status.textContent = copy.ready;
        return;
      }

      const runtime = await loadPyodideRuntime();
      if (token !== runToken) return;
      const result = await runtime.runPythonAsync(currentCode || editor.textContent || '');
      if (result !== undefined && result !== null) appendOutput(`${copy.returned}: ${result.toString()}`);
      if (token === runToken) status.textContent = copy.pythonReady;
    } catch (error) {
      appendOutput(`${copy.error}: ${error.stack || error.message || String(error)}`);
      status.textContent = copy.error;
    }
  };

  const onSelectChange = () => {
    const selected = copy.examples[language][Number(exampleSelect.value)] ?? copy.examples[language][0];
    jar.updateCode(selected.code);
    currentCode = selected.code;
  };

  const onLangClick = (event) => {
    language = event.currentTarget.value;
    populateExamples(true);
  };

  languageSelect.addEventListener('change', onLangClick);
  exampleSelect.addEventListener('change', onSelectChange);
  runButton.addEventListener('click', runCode);
  resetButton.addEventListener('click', () => populateExamples(true));
  clearButton.addEventListener('click', () => {
    output.textContent = '';
    status.textContent = copy.ready;
  });

  populateExamples(true);

  return () => {
    jar.destroy();
    languageSelect.removeEventListener('change', onLangClick);
    exampleSelect.removeEventListener('change', onSelectChange);
    runButton.removeEventListener('click', runCode);
  };
}
