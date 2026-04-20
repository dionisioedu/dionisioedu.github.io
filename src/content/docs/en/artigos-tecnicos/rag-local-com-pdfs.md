---
title: How to Build a Local RAG with PDFs Using Ollama, LangChain, Chroma, and Gradio
description: A practical walkthrough for building a local AI app that reads PDFs, indexes content, and answers questions without relying on a paid API.
publishedAt: 2026-04-17
author: Dionisio
tags:
  - RAG
  - Local AI
  - Ollama
  - LangChain
  - Chroma
  - Gradio
cover: /assets/images/rag-local-pdf-hero.png
coverAlt: Modern workstation with laptop, printed PDFs, and a local AI document assistant interface
sidebar:
  label: Local RAG with PDFs
---

<section class="ae-feature">
  <img src="/assets/images/rag-local-pdf-hero.png" alt="Desk setup with a laptop, printed PDFs, and an interface for asking questions about local documents" loading="eager" />
  <div class="ae-feature-copy">
    <p class="ae-kicker">Ollama + LangChain + Chroma</p>
    <h2>A private AI assistant for your PDFs, running on your machine with no usage fees</h2>
    <p>
      If you want to move beyond generic chat and build something that feels like a real AI
      application, this is a great project to start with. In less than 30 minutes you can assemble
      a local RAG pipeline that reads PDFs, indexes their contents, and answers questions with
      actual context.
    </p>
    <div class="ae-meta">
      <span>RAG</span>
      <span>Ollama</span>
      <span>Chroma</span>
      <span>PDFs</span>
    </div>
  </div>
</section>

Everything here runs `100% locally`, with no external API, no token costs, and full privacy.

In less than half an hour, you can have an AI assistant that reads `ebooks`, `documents`, `technical
articles`, manuals, or any folder of PDFs and answers questions as if it were focused on that
material alone.

This architecture is called `RAG` (`Retrieval-Augmented Generation`) and it remains one of the most
useful foundations for real AI applications in 2026. The best part is that you do not just build
something portfolio-worthy. You also learn the fundamentals on the way.

## Why this project is worth it

- RAG is one of the most common AI application architectures in real products, not just chat demos
- running locally gives you `privacy`, `control`, and `zero marginal cost`
- you learn `embeddings`, `vector search`, `chunking`, `retrieval`, and `prompting` in practice
- the final result is a strong project for AI, automation, or intelligent backend portfolios

## What you will learn

- how to use `Ollama` to run local models
- how to build a RAG pipeline with `LangChain`
- how to use `Chroma` as a vector database
- how to generate embeddings with `nomic-embed-text`
- how to launch a simple and polished interface with `Gradio`
- how to connect all of that into an application that feels useful beyond the tutorial

## Prerequisites

- `Python 3.10+`
- `Ollama` installed from `ollama.com`
- at least `8 GB of RAM` free, ideally `16 GB`
- one or more PDFs to test with

## 1. Download the models in Ollama

After installing Ollama, open the terminal and run:

```bash
ollama pull nomic-embed-text
ollama pull llama3.2
```

This usually takes a few minutes.

> If your machine can handle it, try `qwen2.5:7b` later. It often performs better.

## 2. Create the project structure

```bash
mkdir rag-local-pdf
cd rag-local-pdf
mkdir pdfs
```

Then place your files inside the `pdfs` folder.

## 3. Create the virtual environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

If everything worked, you should see something like this in the terminal:

```bash
(venv) PS C:\Projects\rag-local-pdf>
```

## 4. Install the dependencies

```bash
pip install langchain langchain-community langchain-ollama langchain-chroma pypdf gradio
```

This can take a little while because there is quite a bit to download.

## 5. Create `app.py`

Save this code as `app.py`:

```python
import os

import gradio as gr
from langchain_chroma import Chroma
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_ollama import ChatOllama, OllamaEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

PERSIST_DIR = "./chroma_db"
PDF_FOLDER = "./pdfs"

embeddings = OllamaEmbeddings(model="nomic-embed-text")
llm = ChatOllama(model="llama3.2", temperature=0.3)

prompt_template = """You are a helpful and precise assistant.
Answer ONLY based on the context below. If you do not know, say "I do not have enough information".

Context:
{context}

Question: {question}

Answer:"""

prompt = ChatPromptTemplate.from_template(prompt_template)

if not os.path.exists(PERSIST_DIR) or len(os.listdir(PDF_FOLDER)) > 0:
    print("Indexing PDFs for the first time...")
    loader = PyPDFDirectoryLoader(PDF_FOLDER)
    docs = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)
    splits = text_splitter.split_documents(docs)

    vectorstore = Chroma.from_documents(
        documents=splits,
        embedding=embeddings,
        persist_directory=PERSIST_DIR,
    )
    print(f"{len(splits)} chunks indexed!")
else:
    vectorstore = Chroma(
        persist_directory=PERSIST_DIR,
        embedding_function=embeddings,
    )
    print("Vector database already exists.")

retriever = vectorstore.as_retriever(search_kwargs={"k": 4})


def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)


rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)


def chat(message, history):
    response = rag_chain.invoke(message)
    return response


with gr.Blocks(
    title="My Local AI - Chat with PDFs",
    theme=gr.themes.Soft(),
) as demo:
    gr.Markdown(
        "# Local RAG with PDFs\nAsk anything about the PDFs in the `./pdfs` folder"
    )

    gr.ChatInterface(
        fn=chat,
        title="Chat with your documents",
        description="Everything runs on your machine. Private and free.",
        examples=[
            "What is the main point of the document?",
            "Summarize the text in 3 sentences",
            "What does it say about [topic from your PDF]?",
        ],
    )


if __name__ == "__main__":
    demo.launch(share=False)
```

## 6. Run the project

```bash
python app.py
```

On the first run, it will load and index every PDF in the folder. Depending on the file sizes, this
can take a few minutes and use a fair amount of CPU and memory.

If resource usage spikes, that is expected.

## 7. Test your RAG in practice

When indexing finishes, open the link printed in the terminal. It usually looks like this:

```text
http://127.0.0.1:7860
```

This opens a friendly chat-style interface in the browser, except it is running on your own
machine.

From there, the workflow is simple: ask questions about the PDFs and watch the model answer using
retrieved context.

> Response time depends a lot on your hardware. It will be slower than a paid cloud LLM, but in
> exchange you get privacy, predictable cost, and a much more concrete understanding of the
> architecture.

## What is happening under the hood

At a high level, the flow is:

1. the PDFs are loaded
2. the text is split into `chunks`
3. each chunk becomes an embedding
4. the embeddings are stored in `Chroma`
5. when you ask a question, the system retrieves the most relevant chunks
6. the model answers using that context

That is the core of almost every serious RAG application.

## Next upgrades worth trying

Once this is working, you can evolve the project with:

- PDF upload through the interface
- conversation memory
- citations with source and page number
- support for multiple collections
- model switching for performance comparison
- more refined index persistence

If you wanted a straightforward project for learning applied AI without relying on a paid API, this
is one of the best places to start.

And when you open the project in the browser, the interface looks like this:

![Local RAG chat UI running in the browser with a question about an algorithm and the generated answer.](/assets/images/rag-local-pdf-chat-ui.png)
