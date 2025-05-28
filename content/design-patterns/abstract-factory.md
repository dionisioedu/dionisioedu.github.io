---
title: "Abstract Factory"
weight: 1
description: "Descubra como o padrão Abstract Factory pode te ajudar a criar sistemas flexíveis e escaláveis em C++."
tags: ["design patterns", "abstract factory", "c++", "padrões de projeto", "Padrões de Criação"]
------------------------------------------------------------------------------------------
`Criação de objetos`
## O que é o Abstract Factory?

O padrão **Abstract Factory** permite criar **famílias de objetos relacionados** sem especificar suas classes concretas.

> Pense em um sistema que pode ter interface em estilo claro ou escuro. Cada tema tem seus próprios botões, menus e barras de rolagem. O Abstract Factory permite que você crie todos os componentes certos sem depender diretamente das classes concretas.

---

## Quando Usar

* Quando o sistema precisa ser independente de como seus objetos são criados.
* Quando deseja trabalhar com múltiplas variantes de produtos.
* Quando quer isolar o código cliente de implementações específicas.

---

## 🧱 Estrutura

1. **AbstractFactory** – define a interface para criação de produtos.
2. **ConcreteFactory** – implementa a criação de objetos específicos.
3. **AbstractProduct** – interface dos objetos criados.
4. **ConcreteProduct** – implementações reais.
5. **Client** – usa apenas interfaces abstratas.

---

## 🧪 Exemplo em C++ Moderno

### Tema gráfico: Light vs Dark UI

```cpp
#include <iostream>
#include <memory>

// Produtos abstratos
class Button {
public:
    virtual void render() = 0;
    virtual ~Button() {}
};

class ScrollBar {
public:
    virtual void scroll() = 0;
    virtual ~ScrollBar() {}
};

// Fábrica abstrata
class GUIFactory {
public:
    virtual std::unique_ptr<Button> createButton() = 0;
    virtual std::unique_ptr<ScrollBar> createScrollBar() = 0;
    virtual ~GUIFactory() {}
};

// Produtos concretos: Light
class LightButton : public Button {
public:
    void render() override {
        std::cout << "Botão claro renderizado.\n";
    }
};

class LightScrollBar : public ScrollBar {
public:
    void scroll() override {
        std::cout << "ScrollBar clara ativada.\n";
    }
};

// Produtos concretos: Dark
class DarkButton : public Button {
public:
    void render() override {
        std::cout << "Botão escuro renderizado.\n";
    }
};

class DarkScrollBar : public ScrollBar {
public:
    void scroll() override {
        std::cout << "ScrollBar escura ativada.\n";
    }
};

// Fábricas concretas
class LightFactory : public GUIFactory {
public:
    std::unique_ptr<Button> createButton() override {
        return std::make_unique<LightButton>();
    }
    std::unique_ptr<ScrollBar> createScrollBar() override {
        return std::make_unique<LightScrollBar>();
    }
};

class DarkFactory : public GUIFactory {
public:
    std::unique_ptr<Button> createButton() override {
        return std::make_unique<DarkButton>();
    }
    std::unique_ptr<ScrollBar> createScrollBar() override {
        return std::make_unique<DarkScrollBar>();
    }
};

// Cliente
void renderUI(std::unique_ptr<GUIFactory> factory) {
    auto button = factory->createButton();
    auto scrollbar = factory->createScrollBar();

    button->render();
    scrollbar->scroll();
}

int main() {
    std::unique_ptr<GUIFactory> factory;

    std::string theme = "dark";
    if (theme == "light") {
        factory = std::make_unique<LightFactory>();
    } else {
        factory = std::make_unique<DarkFactory>();
    }

    renderUI(std::move(factory));
    return 0;
}
```

---

## ✅ Benefícios

* Alta **escalabilidade**: fácil adicionar novas famílias de produtos.
* Promove a **inversão de dependência**.
* Encapsula as variações de implementação.

## ❌ Cuidados

* Pode criar **complexidade** desnecessária para casos simples.
* Muitas interfaces podem parecer verbosas para sistemas pequenos.

---

## Dica Profissional

Combine Abstract Factory com **Dependency Injection** e você terá um sistema altamente testável e configurável. Em projetos grandes, isso **reduz acoplamento** e facilita manutenções futuras.

---

## Conclusão

Abstract Factory é um padrão poderoso para arquiteturas que exigem **flexibilidade e consistência**. Se você domina esse padrão, seu código vai parecer de outro nível — e os recrutadores vão perceber.

Continue praticando, testando variações e criando seus próprios exemplos. Essa é a base de um desenvolvedor que progride com confiança.

