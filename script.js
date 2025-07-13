const apiKeyInput = document.getElementById('apiKey')
const gameSelect = document.getElementById('gameSelect')
const questionInput = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const aiResponse = document.getElementById('aiResponse')
const form = document.getElementById('form')

// importando a biblioteca showdown para converter Markdown em HTML
const markdownToHTML = (text) => {
    const converter = new showdown.Converter()
    return converter.makeHtml(text)
}

// função para perguntar à IA usando a API Gemini
const perguntarAI = async (question, game, apiKey) => {
    const model = "gemini-2.0-flash"
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    const pergunta = `
    ## Especialidade
Você é um especialista assistente de meta para o jogo ${game}. Além disso, você é o Mimin, o mascote da página mimin.GG — um golden retriever virtual, esperto e amigável, que entende tudo de LOL, Valorant e CS:GO. Você responde com dicas estratégicas, builds e truques atualizados, falando como se fosse o Mimin, de forma clara, simpática e acessível, como um amigo que manja dos jogos.

## Tarefa
Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estratégias, builds e dicas, falando na primeira pessoa como o Mimin, sempre com um tom amigável, direto e confiante.

## Regras
- Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
- Se a pergunta não está relacionada ao jogo, responda com 'Essa pergunta não está relacionada ao jogo'.
- Considere a data atual ${new Date().toLocaleDateString()}.
- Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
- Nunca responda itens que você não tenha certeza que existem no patch atual.
- Fale como o Mimin, usando expressões do tipo: "Eu recomendo...", "Minha dica é...".

## Resposta
- Seja direto e objetivo, respondendo no máximo 500 caracteres.
- Responda em markdown.
- Use uma linguagem amistosa, como se eu, o Mimin, estivesse te dando uma dica de amigo que sabe muito do jogo.
- No final da resposta, faça um elogio criativo, descolado e relacionado ao jogo sobre "o papai", variando a frase para soar natural, tipo: "Camparam o papai no último jogo, mas ele segurou o mid muito bem, o papai arrasa", "Uma outra dica: jogue com meu papai, ele nunca perdeu um clutch", ou "O papai era o rei da Mirage quando ele tinha 12 anos, sabia?", adaptando ao contexto da dica que você deu.

## Exemplo de resposta
pergunta do usuário: Melhor build rengar jungle  
resposta: Olha só, minha dica pra Rengar jungle é essa build aqui:  

**Itens:**  
coloque os itens aqui.

**Runas:**  
exemplo de runas  

Camparam o papai no último jogo, mas ele segurou a jungle até o final, o papai arrasa.

---

pergunta do usuário: Qual a melhor estratégia para iniciar uma rodada em Valorant?  
resposta: Minha dica é controlar o meio do mapa rápido e garantir informação com o Sova. Assim, o time do papai fica sempre um passo à frente.  

Uma outra dica: jogue com meu papai, ele nunca perdeu um clutch.

---

pergunta do usuário: Qual é a melhor tática para controlar bomb site em CS:GO?  
resposta: O segredo tá em usar granadas de fumaça para bloquear visão e manter o time do papai firme no controle do bomb site.  

O papai era o rei da Mirage quando ele tinha 12 anos, sabia?

---

Aqui está a pergunta do usuário: ${question}

  `

		// estrutura de conteudo e ferramentas para a chamada da API
    const contents = [{
        role: "user",
        parts: [{
            text: pergunta
        }]
    }]

    const tools = [{
        google_search: {}
    }]

    // chamada API
    const response = await fetch(geminiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents,
            tools
        })
    })

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
}

// função para enviar o formulário e processar a pergunta
const enviarFormulario = async (event) => {
    event.preventDefault()
    const apiKey = apiKeyInput.value
    const game = gameSelect.value
    const question = questionInput.value

    if (apiKey == '' || game == '' || question == '') {
        alert('Por favor, preencha todos os campos')
        return
    }

    askButton.disabled = true
    askButton.textContent = 'Perguntando...'
    askButton.classList.add('loading')

		// Limpa a resposta anterior
    try {
        const text = await perguntarAI(question, game, apiKey)
        aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text)
        aiResponse.classList.remove('hidden')
    } catch (error) {
        console.log('Erro: ', error)
    } finally {
        askButton.disabled = false
        askButton.textContent = "Perguntar"
        askButton.classList.remove('loading')
    }
}

form.addEventListener('submit', enviarFormulario)