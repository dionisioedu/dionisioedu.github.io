---
title: "Observer"
weight: 19
description: "Entenda o padrão de projeto Observer com exemplos práticos em C++ moderno e aplique esse conceito para construir sistemas reativos e desacoplados."
tags: ["Design Patterns", "C++", "Observer", "Padrões Comportamentais"]
------------------------------------------------------------------------
`Comportamento de objetos`
## O que são Design Patterns?

Design Patterns (ou Padrões de Projeto) são **soluções reutilizáveis para problemas recorrentes de design de software**. Eles ajudam a tornar seu código mais **flexível, modular, reutilizável e fácil de manter**. Surgiram a partir de observações práticas sobre como bons desenvolvedores resolviam problemas comuns de estrutura e comportamento no desenvolvimento de sistemas.

Se você está começando na programação ou já trabalha na área e quer avançar de nível, estudar os padrões é um **atalho para escrever software mais maduro e arquiteturalmente sólido**.

Hoje vamos falar de um dos mais importantes: o **Observer**.

---

## O que é o Observer?

O padrão **Observer** define uma **dependência um-para-muitos** entre objetos, de forma que quando **um objeto muda de estado, todos os seus dependentes são notificados automaticamente**.

É muito utilizado em sistemas **reativos**, **interfaces gráficas**, **event-driven programming**, e **implementações de sistemas de mensagens**.

Imagine que você tem uma classe `Subject` (sujeito) que mantém uma lista de `Observers` (observadores). Toda vez que o estado do `Subject` muda, ele avisa os `Observers` inscritos. Isso evita acoplamento direto e torna o sistema extensível e dinâmico.

---

## 🛠 Exemplo Prático em C++ Moderno

### Componentes principais

* `Observer`: interface que define o método de notificação.
* `ConcreteObserver`: implementação do Observer.
* `Subject`: interface que gerencia os observers.
* `ConcreteSubject`: implementação do Subject que notifica os observers.

```cpp
#include <iostream>
#include <vector>
#include <memory>
#include <algorithm>

// Interface Observer
class Observer {
public:
    virtual void update(int value) = 0;
    virtual ~Observer() = default;
};

// Interface Subject
class Subject {
public:
    virtual void attach(std::shared_ptr<Observer> obs) = 0;
    virtual void detach(std::shared_ptr<Observer> obs) = 0;
    virtual void notify() = 0;
    virtual ~Subject() = default;
};

// ConcreteSubject
class TemperatureSensor : public Subject {
private:
    int temperature = 0;
    std::vector<std::shared_ptr<Observer>> observers;

public:
    void setTemperature(int temp) {
        temperature = temp;
        notify();
    }

    void attach(std::shared_ptr<Observer> obs) override {
        observers.push_back(obs);
    }

    void detach(std::shared_ptr<Observer> obs) override {
        observers.erase(std::remove(observers.begin(), observers.end(), obs), observers.end());
    }

    void notify() override {
        for (auto& obs : observers) {
            obs->update(temperature);
        }
    }
};

// ConcreteObserver
class TemperatureDisplay : public Observer {
private:
    std::string name;

public:
    TemperatureDisplay(const std::string& id) : name(id) {}

    void update(int value) override {
        std::cout << "[" << name << "] Temperatura atual: " << value << "°C\n";
    }
};

int main() {
    auto sensor = std::make_shared<TemperatureSensor>();

    auto display1 = std::make_shared<TemperatureDisplay>("Sala");
    auto display2 = std::make_shared<TemperatureDisplay>("Quarto");

    sensor->attach(display1);
    sensor->attach(display2);

    sensor->setTemperature(25);
    sensor->setTemperature(30);

    sensor->detach(display2);
    sensor->setTemperature(28);

    return 0;
}
```

---

## 💡 Por que usar o Observer?

* **Desacoplamento**: o sujeito não precisa saber quem são os observadores.
* **Flexibilidade**: adiciona/remova observadores em tempo de execução.
* **Escalabilidade**: ideal para sistemas baseados em eventos ou múltiplas saídas.

---

## 🚀 Dicas para ir além

* Combine com **Smart Pointers** (`shared_ptr`, `weak_ptr`) para evitar leaks.
* Use `std::function` e `std::bind` para notificações mais dinâmicas.
* Para cenários com alta frequência, considere otimizações com `event queue`.
* Explore bibliotecas como **Boost.Signals2**, **RxCpp** ou **Qt Signals & Slots**.

---

## 📘 Conclusão

O Observer é um padrão poderoso, presente em muitos frameworks modernos. Dominá-lo vai te ajudar a escrever aplicações mais reativas e modulares, com menor acoplamento entre componentes.

Quer se destacar nas entrevistas e projetos? **Implemente pequenos exemplos como esse e compartilhe no GitHub**. É um diferencial e tanto para quem está começando na carreira tech!

Se curtiu o conteúdo, compartilhe com outros devs iniciantes. E não se esqueça: código limpo é código legível — e design patterns são aliados nessa missão. 💻✨
