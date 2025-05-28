---

title: "Builder"
weight: 2
description: "Aprenda o padrão Builder com exemplos modernos em C++ e entenda como aplicá-lo para construir objetos complexos de forma controlada."
tags: ["design patterns", "builder", "c++", "padrões de projeto", "Padrões Criacionais"]
------------------------------------------------------------------------------
`Criação de objetos`
## O que é o Builder Pattern?

O padrão Builder permite **criar objetos complexos passo a passo**, oferecendo controle total sobre o processo de construção — sem ter que lidar com construtores gigantes e difíceis de manter.

Em vez de instanciar um objeto com todos os atributos de uma vez, o Builder permite que você vá montando esse objeto parte por parte, como num passo a passo lógico.

---

## Quando usar

* Quando um objeto precisa de muitos parâmetros.
* Quando há várias combinações possíveis de configuração.
* Quando você quer separar a lógica de construção da lógica de uso.

---

## 💡 Exemplo prático em C++ Moderno

Vamos criar um `Person` com vários campos opcionais:

```cpp
#include <iostream>
#include <string>
#include <memory>

class Person {
public:
    std::string name;
    int age = 0;
    std::string city;
    std::string occupation;

    void print() const {
        std::cout << name << ", " << age << " anos, " << occupation
                  << " em " << city << std::endl;
    }
};

class PersonBuilder {
private:
    std::unique_ptr<Person> person;
public:
    PersonBuilder() : person(std::make_unique<Person>()) {}

    PersonBuilder& setName(const std::string& name) {
        person->name = name;
        return *this;
    }

    PersonBuilder& setAge(int age) {
        person->age = age;
        return *this;
    }

    PersonBuilder& setCity(const std::string& city) {
        person->city = city;
        return *this;
    }

    PersonBuilder& setOccupation(const std::string& occupation) {
        person->occupation = occupation;
        return *this;
    }

    std::unique_ptr<Person> build() {
        return std::move(person);
    }
};

int main() {
    auto person = PersonBuilder()
        .setName("Ana Souza")
        .setAge(28)
        .setOccupation("Engenheira de Software")
        .setCity("São Paulo")
        .build();

    person->print();
    return 0;
}
```

---

## ✅ Vantagens

* Código mais legível e organizado
* Evita construtores longos com parâmetros confusos
* Fácil de manter e estender
* Suporte a validações passo a passo

## ❌ Desvantagens

* Um pouco mais de código boilerplate
* Pode parecer exagero para objetos simples

---

## Dica Profissional

Combine o padrão Builder com **Method Chaining** (como fizemos acima) para criar APIs fluídas e intuitivas. Isso ajuda tanto na usabilidade quanto na documentação do seu código.

E lembre-se: usar padrões como Builder mostra maturidade na escrita de software — e te destaca em entrevistas e revisões de código.

---

## Conclusão

O Builder Pattern é um aliado poderoso para criar objetos flexíveis e bem definidos. Dominar padrões como esse te coloca em outro nível como desenvolvedor. Continue estudando e praticando!

👉 Quer ver como esse padrão se conecta com outros? Explore também os padrões **Abstract Factory**, **Prototype** e **Factory Method**.
