export function mountBinaryInspector(root) {
  const decimalInput = root.querySelector('[data-decimal-input]');
  const charInput = root.querySelector('[data-char-input]');
  const unsignedByte = root.querySelector('[data-unsigned-byte]');
  const signedByte = root.querySelector('[data-signed-byte]');
  const hexValue = root.querySelector('[data-hex-value]');
  const binary8 = root.querySelector('[data-binary-8]');
  const binary16 = root.querySelector('[data-binary-16]');
  const binary32 = root.querySelector('[data-binary-32]');
  const charValue = root.querySelector('[data-char-value]');
  const memoryBytes = root.querySelector('[data-memory-bytes]');
  const conversionSteps = root.querySelector('[data-conversion-steps]');
  const locale = document.documentElement.lang === 'pt-BR' ? 'pt' : 'en';

  const conversionCopy = locale === 'pt'
    ? {
        remainder: 'resto',
        byte: 'byte',
        na: 'n/a',
      }
    : {
        remainder: 'remainder',
        byte: 'byte',
        na: 'n/a',
      };

  const getSteps = (value) => {
    if (value === 0) return [];
    const steps = [];
    let current = value;
    while (current > 0) {
      const quotient = Math.floor(current / 2);
      const remainder = current % 2;
      steps.push(`${current} / 2 = ${quotient}, ${conversionCopy.remainder} ${remainder}`);
      current = quotient;
    }
    return steps;
  };

  const render = (source) => {
    let value = Number.parseInt(decimalInput.value, 10);
    if (!Number.isFinite(value)) value = 0;

    if (source === 'char' && charInput.value) {
      value = charInput.value.charCodeAt(0);
      decimalInput.value = String(value);
    }

    if (source === 'decimal') {
      const printable = value >= 32 && value <= 126 ? String.fromCharCode(value) : '';
      charInput.value = printable;
    }

    const byteValue = value & 0xff;
    const signedValue = byteValue > 127 ? byteValue - 256 : byteValue;
    const binary8Value = byteValue.toString(2).padStart(8, '0');
    const binary16Value = (value & 0xffff).toString(2).padStart(16, '0');
    const binary32Value = (value >>> 0).toString(2).padStart(32, '0');
    const printable = value >= 32 && value <= 126 ? String.fromCharCode(value) : conversionCopy.na;

    unsignedByte.textContent = String(byteValue);
    signedByte.textContent = String(signedValue);
    hexValue.textContent = `0x${byteValue.toString(16).toUpperCase().padStart(2, '0')}`;
    binary8.textContent = binary8Value;
    binary16.textContent = binary16Value.replace(/(.{8})/g, '$1 ').trim();
    binary32.textContent = binary32Value.replace(/(.{8})/g, '$1 ').trim();
    charValue.textContent = printable;

    memoryBytes.innerHTML = '';
    binary32Value.match(/.{1,8}/g).forEach((chunk, index) => {
      const cell = document.createElement('div');
      cell.className = 'memory-byte';
      cell.innerHTML = `<span>${conversionCopy.byte} ${index}</span><strong>${chunk}</strong>`;
      memoryBytes.append(cell);
    });

    conversionSteps.innerHTML = '';
    const steps = getSteps(Math.abs(value));
    if (!steps.length) {
      const item = document.createElement('li');
      item.textContent = `0 / 2 = 0, ${conversionCopy.remainder} 0`;
      conversionSteps.append(item);
    } else {
      steps.forEach((step) => {
        const item = document.createElement('li');
        item.textContent = step;
        conversionSteps.append(item);
      });
    }
  };

  const onDecimal = () => render('decimal');
  const onChar = () => render('char');

  decimalInput.addEventListener('input', onDecimal);
  charInput.addEventListener('input', onChar);
  render('decimal');

  return () => {
    decimalInput.removeEventListener('input', onDecimal);
    charInput.removeEventListener('input', onChar);
  };
}
