---

title: "Singleton"
date: 2025-05-28
description: "Entenda o padrão Singleton com exemplos modernos em C++ e aplique esse conhecimento na sua jornada como desenvolvedor."
tags: ["design patterns", "singleton", "c++", "carreira", "padrões de projeto"]
--------------------------------------------------------------------------------

## Descrição

O padrão Singleton garante que **uma classe tenha apenas uma instância** e fornece um ponto global de acesso a ela.

### Quando usar:

* Logger global
* Gerenciador de configuração
* Acesso a um banco de dados ou serviço centralizado

---

## ✅ Benefícios

* **Controle de instância única**
* **Redução de overhead** (principalmente com recursos caros)
* **Fácil acesso global** (sem precisar passar como parâmetro)

## ❌ Desvantagens

* Pode introduzir **acoplamento global**
* Dificulta testes unitários (mockar singletons é mais complicado)
* Pode esconder dependências reais do sistema

---

## Exemplo de Singleton em C++ Moderno (thread-safe)

```cpp
#include <iostream>
#include <mutex>

class Logger {
public:
    // Proíbe cópia e atribuição
    Logger(const Logger&) = delete;
    Logger& operator=(const Logger&) = delete;

    static Logger& getInstance() {
        static Logger instance;
        return instance;
    }

    void log(const std::string& message) {
        std::lock_guard<std::mutex> lock(mutex_);
        std::cout << "[LOG]: " << message << std::endl;
    }

private:
    Logger() {} // Construtor privado
    std::mutex mutex_;
};

int main() {
    Logger::getInstance().log("Iniciando aplicação...");
    Logger::getInstance().log("Carregando recursos...");
    return 0;
}
```

### ✨ Por que esse código é bom?

* `static` local garante **lazy initialization** e **thread-safety** desde C++11.
* O `mutex` protege chamadas simultâneas à função `log`.
* Proíbe cópia e atribuição — essencial para garantir instância única.

---

## Dica Profissional

Mesmo sendo útil, evite usar Singleton em **todas** as situações. Se você precisar compartilhar estado, avalie se um padrão como **Dependency Injection** ou **Service Locator** não seria melhor.

---

## Assista ao vídeo

<iframe width="560" height="315" src="https://www.youtube.com/embed/tgSXCEz8XuM?si=1S2ezROoRDGdEzTl" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## 🔚 Conclusão

O Singleton é simples de entender, mas poderoso quando bem aplicado. É um ótimo ponto de partida para estudar outros padrões como [**Factory**](/design-patterns/factory), [**Observer**](/design-patterns/observer) e [**Strategy**](/design-patterns/strategy).

Dominar esses padrões pode ser a diferença entre um programador mediano e um arquiteto de soluções respeitado no time.

Continue estudando, implementando e refatorando — porque é assim que se constrói uma carreira sólida na tecnologia. 💪

Se quiser, me avise que posso te mostrar os próximos padrões para aprender!
