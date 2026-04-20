---
title: Classificação de Imagens em Tempo Real com Vision Transformer
description: Crie uma IA de visão computacional rodando na sua webcam, 100% local, sem API externa e com classificação em tempo real.
publishedAt: 2026-04-19
author: Dionisio
tags:
  - Vision Transformer
  - Visão Computacional
  - Webcam
  - Hugging Face
  - OpenCV
  - Python
cover: /assets/images/vision-transformer-webcam-hero.png
coverAlt: Setup com monitor, webcam e interface de classificação de imagens em tempo real
sidebar:
  label: Vision Transformer com webcam
---

<section class="ae-feature">
  <img src="/assets/images/vision-transformer-webcam-hero.png" alt="Mesa de trabalho com webcam sobre o monitor, notebook com codigo Python e tela exibindo classificacao de imagens em tempo real" loading="eager" />
  <div class="ae-feature-copy">
    <p class="ae-kicker">Vision Transformer + OpenCV + Hugging Face</p>
    <h2>Uma IA de visão computacional rodando na sua webcam, localmente e com resposta na hora</h2>
    <p>
      Se a ideia é sair do exemplo estático e montar algo com cara de aplicação real, esse projeto
      encaixa muito bem. Em poucos minutos você captura a webcam, roda um modelo pré-treinado e vê
      as previsões aparecendo por cima do vídeo em tempo real.
    </p>
    <div class="ae-meta">
      <span>ViT</span>
      <span>Webcam</span>
      <span>OpenCV</span>
      <span>Python</span>
    </div>
  </div>
</section>

Se você quer montar um projeto de IA que foge do tutorial genérico e já passa uma sensação real de produto, esse aqui é uma excelente porta de entrada.

Em vez de enviar imagem para API paga, esperar resposta e torcer para a internet colaborar, você vai rodar tudo localmente: a webcam captura o frame, o `OpenCV` prepara a imagem, o `Vision Transformer` faz a inferência e o próprio app desenha as `top-3 predições` na tela em tempo real.

O resultado é simples, bonito e muito bom para portfólio. Melhor ainda: no processo você entende como um modelo de classificação de imagens entra numa aplicação de verdade.

## Por que esse projeto vale a pena

- roda `100% local`, sem custo por requisição
- te apresenta `computer vision` moderna sem precisar treinar modelo do zero
- combina `Python`, `OpenCV`, `Hugging Face` e inferência em tempo real
- rende um projeto que fica muito bem em portfólio, GitHub e demonstração ao vivo

## O que você vai aprender

- como capturar vídeo com `OpenCV`
- como carregar um `Vision Transformer` pronto via `transformers`
- como converter imagem entre `BGR`, `RGB` e `PIL`
- como interpretar probabilidades e exibir as `top-3 classes`
- como montar uma aplicação simples que parece bem mais avançada do que a quantidade de código sugere

## Pré-requisitos

- `Python 3.10+`
- webcam funcionando no sistema
- ambiente virtual configurado
- familiaridade básica com terminal e `pip`

## 1. Crie a pasta do projeto

```bash
mkdir vision-transformer-webcam
cd vision-transformer-webcam
```

## 2. Crie e ative o ambiente virtual

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate
```

Se tudo deu certo, o nome do ambiente aparece no começo da linha do terminal.

## 3. Instale as dependências

```bash
pip install torch torchvision transformers opencv-python pillow
```

Esses pacotes cobrem o essencial:

- `torch`: motor de execução do modelo
- `transformers`: carregamento do Vision Transformer
- `opencv-python`: captura da webcam e renderização da janela
- `pillow`: conversão de imagem para o formato esperado pelo processador do modelo

## 4. Crie um teste rápido de ambiente

Antes de abrir a webcam e puxar o modelo, vale conferir se a base está de pé.

Crie o arquivo `test_setup.py`:

```python
import cv2
import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification

MODEL_NAME = "google/vit-base-patch16-224"

print("Python e dependencias carregadas")
print(f"OpenCV: {cv2.__version__}")
print(f"Torch: {torch.__version__}")

processor = AutoImageProcessor.from_pretrained(MODEL_NAME)
model = AutoModelForImageClassification.from_pretrained(MODEL_NAME)

print("Modelo carregado com sucesso")
print(f"Numero de classes: {model.config.num_labels}")
print("Tudo pronto para seguir")
```

Rode:

```bash
python test_setup.py
```

Na primeira vez pode demorar um pouco, porque o `transformers` baixa os arquivos do modelo para cache local.

## 5. Crie o app principal

Agora sim, o coração do projeto.

Crie o arquivo `app.py`:

```python
import cv2
import torch
from PIL import Image
from transformers import AutoImageProcessor, AutoModelForImageClassification

MODEL_NAME = "google/vit-base-patch16-224"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

processor = AutoImageProcessor.from_pretrained(MODEL_NAME)
model = AutoModelForImageClassification.from_pretrained(MODEL_NAME).to(DEVICE)
model.eval()

camera = cv2.VideoCapture(0)

if not camera.isOpened():
    raise RuntimeError("Nao foi possivel acessar a webcam.")

frame_index = 0
cached_predictions = []


def classify_frame(frame_bgr):
    frame_rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    image = Image.fromarray(frame_rgb)

    inputs = processor(images=image, return_tensors="pt")
    inputs = {key: value.to(DEVICE) for key, value in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)
        probabilities = outputs.logits.softmax(dim=-1)[0]

    top_values, top_indices = torch.topk(probabilities, k=3)

    predictions = []
    for score, class_index in zip(top_values, top_indices):
        label = model.config.id2label[class_index.item()]
        predictions.append((label, score.item() * 100))

    return predictions


while True:
    ok, frame = camera.read()
    if not ok:
        break

    frame_index += 1

    # Rodar inferencia a cada 8 frames ajuda bastante em CPU.
    if frame_index % 8 == 0:
        cached_predictions = classify_frame(frame)

    y = 30
    for label, confidence in cached_predictions:
        text = f"{label}: {confidence:.2f}%"
        cv2.putText(
            frame,
            text,
            (20, y),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (0, 255, 0),
            2,
            cv2.LINE_AA,
        )
        y += 30

    cv2.putText(
        frame,
        "Pressione q para sair",
        (20, frame.shape[0] - 20),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.6,
        (255, 255, 255),
        2,
        cv2.LINE_AA,
    )

    cv2.imshow("Vision Transformer com Webcam", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

camera.release()
cv2.destroyAllWindows()
```

## 6. Execute o projeto

```bash
python app.py
```

Se estiver tudo certo, uma janela vai abrir com a imagem da webcam e as predições aparecendo por cima.

Teste com objetos simples primeiro:

- garrafa
- teclado
- mouse
- caneca
- celular

Quanto mais o objeto se parecer com imagens comuns do `ImageNet`, maiores as chances de uma classificação coerente.

## 7. Entenda o fluxo completo

O pipeline do projeto é este:

```text
Webcam -> OpenCV (BGR) -> RGB -> PIL
-> AutoImageProcessor -> Vision Transformer
-> Softmax -> Top-3 previsoes -> Texto na tela
```

Em outras palavras:

1. o `OpenCV` captura um frame da webcam
2. o frame chega em `BGR`, que não é o formato esperado pelo modelo
3. a imagem é convertida para `RGB`
4. o `PIL` transforma o frame num objeto amigável para o ecossistema Hugging Face
5. o `processor` redimensiona, normaliza e prepara os tensores
6. o `Vision Transformer` gera logits para as classes
7. o `softmax` transforma isso em probabilidades
8. você pega as `3` classes mais prováveis e desenha na tela

## O que está acontecendo por trás

O `Vision Transformer`, ou `ViT`, trata a imagem de forma parecida com o que transformers fazem em texto: ele divide a entrada em pequenos blocos, aprende relações entre essas partes e produz uma representação global da cena.

Na prática, isso significa que você não está usando uma CNN clássica feita do zero. Você está aproveitando um modelo já treinado em um conjunto enorme de imagens e aplicando esse conhecimento diretamente na webcam.

Esse tipo de projeto é bom porque te mostra três camadas ao mesmo tempo:

- a camada de `entrada`, com captura de vídeo e pré-processamento
- a camada de `modelo`, com inferência e interpretação das saídas
- a camada de `produto`, com experiência visual, latência e usabilidade

## Ajustes que melhoram bastante o resultado

### Rode a inferência a cada poucos frames

Se você tentar classificar todos os frames em CPU, a aplicação vai ficar pesada. O truque de processar a cada `6`, `8` ou `10` frames já melhora muito.

### Use boa iluminação

Modelo de classificação sofre bastante quando a imagem está escura, estourada ou tremida.

### Centralize o objeto

O ViT aqui faz `classificação da imagem inteira`, não `detecção de objetos`. Então, se tiver muita bagunça na cena, ele pode se confundir.

### Teste outros checkpoints

Depois que esse fluxo estiver funcionando, vale experimentar variantes compatíveis com classificação de imagem no Hugging Face para comparar latência e qualidade.

## Troubleshooting

### A webcam não abre

Verifique se:

- outro app não está usando a câmera
- a permissão de câmera foi concedida ao sistema
- o índice `0` da webcam é o correto no seu computador

Se necessário, troque:

```python
camera = cv2.VideoCapture(0)
```

por:

```python
camera = cv2.VideoCapture(1)
```

### O modelo demora demais

Isso costuma acontecer em máquina sem GPU ou com CPU mais modesta. Algumas saídas:

- aumentar o intervalo entre inferências
- reduzir resolução da câmera
- fechar aplicativos pesados em paralelo

### As classes saem estranhas

Isso é normal em parte. O modelo foi treinado com `ImageNet`, então ele tenta encaixar o que vê nas classes daquele conjunto. Nem sempre o rótulo vai ser o nome exato do objeto real.

### Erro ao baixar modelo

Na primeira execução, você precisa de internet para baixar os pesos do checkpoint. Depois disso, o cache local normalmente resolve as próximas execuções sem novo download.

## Próximos upgrades naturais

Se quiser evoluir esse projeto, o caminho mais interessante é este:

1. trocar classificação simples por `object detection`
2. adicionar `bounding boxes`
3. mostrar FPS, histórico de predições e estatísticas
4. testar uma versão com `YOLOv8` para múltiplos objetos na mesma cena

Esse upgrade muda bastante o tipo de experiência: sai a pergunta "o que a imagem inteira parece ser?" e entra "quais objetos existem aqui e onde eles estão?".

## Fechando

Esse projeto é uma ótima forma de sair da teoria e encostar numa aplicação de visão computacional com cara de produto real. Em poucas dezenas de linhas você junta webcam, pré-processamento, inferência e interface visual numa demo que chama atenção.

E o melhor: tudo isso sem API externa, sem custo por uso e com controle total do que está rodando na sua máquina.

Se você publicar esse projeto no GitHub com um vídeo curto de demonstração, ele ganha ainda mais força como portfólio técnico.
