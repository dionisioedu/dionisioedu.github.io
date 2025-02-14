---
layout: post
title: Padrão de Projeto Command - O Segredo para Desacoplar Comandos e Tornar Seu Código Mais Flexível
description: 
author: Dionisio
image: assets/images/padrao-command.webp
---
Se você já precisou implementar um sistema onde diferentes operações precisavam ser executadas dinamicamente, com possibilidade de desfazer ações ou mesmo armazená-las para execução posterior, então você precisa conhecer o **padrão de projeto Command**.

## O Que é o Padrão Command?

O Command é um padrão de projeto **comportamental** que encapsula uma solicitação como um objeto, permitindo que você parametrize clientes com operações, enfileire ou registre solicitações e implemente funcionalidades de desfazer (undo).

A ideia central é separar **quem solicita** a execução de um comando de **quem realmente o executa**, promovendo **baixo acoplamento** e facilitando a expansão do sistema.

## Estrutura do Padrão

O Command segue uma estrutura bem definida:

- **Command (interface ou classe abstrata):** Define uma interface comum para todos os comandos.
- **ConcreteCommand:** Implementa a interface Command e encapsula a lógica da operação.
- **Receiver:** O objeto que realmente executa a lógica da operação.
- **Invoker:** Responsável por chamar os comandos, mantendo uma referência para eles.
- **Client:** Cria e configura os comandos, passando-os para o Invoker.

## Exemplo Prático em Python

Imagine um sistema de controle remoto onde podemos ligar e desligar uma luz:

```python
# Interface Command
class Command:
    def execute(self):
        pass
    
    def undo(self):
        pass

# Receiver
class Luz:
    def ligar(self):
        print("Luz ligada")
    
    def desligar(self):
        print("Luz desligada")

# Concrete Commands
class LigarLuzCommand(Command):
    def __init__(self, luz):
        self.luz = luz
    
    def execute(self):
        self.luz.ligar()
    
    def undo(self):
        self.luz.desligar()

class DesligarLuzCommand(Command):
    def __init__(self, luz):
        self.luz = luz
    
    def execute(self):
        self.luz.desligar()
    
    def undo(self):
        self.luz.ligar()

# Invoker
class ControleRemoto:
    def __init__(self):
        self.comando = None
    
    def set_comando(self, comando):
        self.comando = comando
    
    def pressionar_botao(self):
        self.comando.execute()
    
    def pressionar_desfazer(self):
        self.comando.undo()

# Uso do padrão Command
luz = Luz()
ligar_luz = LigarLuzCommand(luz)
desligar_luz = DesligarLuzCommand(luz)

controle = ControleRemoto()
controle.set_comando(ligar_luz)
controle.pressionar_botao()  # Saída: Luz ligada
controle.pressionar_desfazer()  # Saída: Luz desligada
```

## Benefícios do Padrão Command

1. **Desacoplamento** – O cliente não precisa conhecer os detalhes de implementação do comando.
2. **Histórico de Comandos** – Possibilidade de armazenar comandos para execução posterior.
3. **Undo/Redo** – Implementação facilitada para desfazer e refazer comandos.
4. **Extensibilidade** – Novos comandos podem ser adicionados sem modificar código existente.

## Conclusão

O padrão Command é uma solução poderosa para desacoplar partes do sistema, trazendo mais flexibilidade, reutilização e facilidade de manutenção. Se você quer um código mais organizado e adaptável a mudanças, vale a pena investir nesse padrão!

E você, já usou o Command em algum projeto? Compartilhe sua experiência!

