const localUrl = 'http://localhost:3000/api'

document.addEventListener('DOMContentLoaded', () =>
{
    const menuItems = document.querySelectorAll('.sidebar a')
    menuItems.forEach(item =>
    {
        item.addEventListener('click', async (event) =>
        {
            event.preventDefault()
            const action = item.getAttribute('data-action')
            showForm(action)
        })
    })
})

function showForm(action)
{
    const formContainer = document.querySelector('#solana-form')
    const resultContainer = document.querySelector('#solana-result')
    formContainer.innerHTML = ''
    resultContainer.innerHTML = ''

    switch (action)
    {
        case 'init-wallet':
            formContainer.innerHTML = `
                <div class="form-group">
                    <label for="privateKey">Chave Privada (base58)</label>
                    <input type="text" id="privateKey" class="form-control" placeholder="Insira sua chave privada">
                </div>
                <button class="btn btn-success" onclick="executeAction('init-wallet')">Executar</button>
            `
            break

        case 'create-token':
            formContainer.innerHTML = `
                <div class="form-group">
                    <label for="decimals">Casas Decimais</label>
                    <input type="number" id="decimals" class="form-control" value="9">
                </div>
                <div class="form-group">
                    <label for="name">Nome do Token</label>
                    <input type="text" id="name" class="form-control" value="PulseGen">
                </div>
                <div class="form-group">
                    <label for="symbol">Símbolo</label>
                    <input type="text" id="symbol" class="form-control" value="PLGN">
                </div>
                <div class="form-group">
                    <label for="uri">URI (JSON de Metadados)</label>
                    <input type="text" id="uri" class="form-control" value="https://jderibamar.github.io/bot-geral2">
                </div>
                <div class="form-group">
                    <label for="amount">Quantidade Inicial</label>
                    <input type="number" id="amount" class="form-control" value="1000000">
                </div>
                
                <button class="btn btn-success" onclick="executeAction('create-token')">Executar</button>
            `
            break //placeholder="Insira a quantidade inicial"

        case 'mint-tokens':
            formContainer.innerHTML = `
                <div class="form-group">
                    <label for="amount">Quantidade de Tokens</label>
                    <input type="number" id="amount" class="form-control" placeholder="Insira a quantidade">
                </div>
                <button class="btn btn-success" onclick="executeAction('mint-tokens')">Executar</button>
            `
            break

        case 'prepare-liquidity-pool':
            formContainer.innerHTML = `
                <div class="form-group">
                    <label for="initialTokens">Quantidade de Tokens</label>
                    <input type="number" id="initialTokens" class="form-control" placeholder="Insira a quantidade">
                </div>
                <div class="form-group">
                    <label for="solAmount">Quantidade de SOL</label>
                    <input type="number" id="solAmount" class="form-control" placeholder="Insira a quantidade">
                </div>
                <button class="btn btn-success" onclick="executeAction('prepare-liquidity-pool')">Executar</button>
            `
            break

        case 'get-token-details':
            formContainer.innerHTML = `
                <div class="form-group">
                    <label for="mintAddress">Endereço do Token (base58)</label>
                    <input type="text" id="mintAddress" class="form-control" placeholder="Insira o endereço do token">
                </div>
                <button class="btn btn-success" onclick="executeAction('get-token-details')">Executar</button>
            `
            break
    }
}

async function executeAction(action)
{
    const resultContainer = document.querySelector('#solana-result')
    resultContainer.innerHTML = '<p>Processando...</p>'

    let data = {}
    switch (action)
    {
        case 'init-wallet':
            data.privateKey = document.querySelector('#privateKey').value
            if (!data.privateKey)
            {
                alert('Por favor, insira a chave privada.')
                resultContainer.innerHTML = ''
                return
            }
            break

         case 'create-token':
            data.decimals = parseInt(document.querySelector('#decimals').value) || 9
            data.name = document.querySelector('#name').value
            data.symbol = document.querySelector('#symbol').value
            data.uri = document.querySelector('#uri').value
            data.amount = parseInt(document.querySelector('#amount').value)
            if (!data.name || !data.symbol || !data.uri || !data.amount || isNaN(data.amount))
            {
                alert('Por favor, preencha todos os campos (nome, símbolo, URI, quantidade inicial).')
                resultContainer.innerHTML = ''
                return
            }
            break

        case 'mint-tokens':
            data.amount = parseInt(document.querySelector('#amount').value)
            if (!data.amount || isNaN(data.amount))
            {
                alert('Por favor, insira uma quantidade válida de tokens.')
                resultContainer.innerHTML = ''
                return
            }
            break

        case 'add-metadata':
            data.mintAddress = document.querySelector('#mintAddress').value
            data.name = document.querySelector('#name').value
            data.symbol = document.querySelector('#symbol').value
            data.uri = document.querySelector('#uri').value
            if (!data.mintAddress || !data.name || !data.symbol || !data.uri)
            {
                alert('Por favor, preencha todos os campos (endereço do mint, nome, símbolo, URI).')
                resultContainer.innerHTML = ''
                return
            }
            break

        case 'prepare-liquidity-pool':
            data.initialTokens = parseInt(document.querySelector('#initialTokens').value)
            data.solAmount = parseInt(document.querySelector('#solAmount').value)
            if (!data.initialTokens || !data.solAmount || isNaN(data.initialTokens) || isNaN(data.solAmount))
            {
                alert('Por favor, insira quantidades válidas para tokens e SOL.')
                resultContainer.innerHTML = ''
                return
            }
            break
        
        case 'get-token-details':
            data.mintAddress = document.querySelector('#mintAddress').value
            if (!data.mintAddress)
            {
                alert('Por favor, insira o endereço do token.')
                resultContainer.innerHTML = ''
                return
            }
            break
    }

    const resultado = await fazerRequisicao(`/${action}`, 'POST', data)
    if (resultado)
    {
        let html = `<div class="alert alert-success"><strong>Sucesso:</strong> ${resultado.message}`,
            details = resultado.details || {}


        if (details.mintAddress)
            html += `<p><strong>Endereço do Token:</strong> ${details.mintAddress}</p>`

        if (details.tokenAccount)
            html += `<p><strong>Endereço da Conta:</strong> ${details.tokenAccount}</p>`

        if (details.metadata)
             html += `
                <p><strong>Metadados:</strong></p>
                <ul>
                    <li><strong>Nome:</strong> ${details.metadata.name}</li>
                    <li><strong>Símbolo:</strong> ${details.metadata.symbol}</li>
                    <li><strong>URI:</strong> ${resultado.metadata.uri}</li>
                    <li><strong>Endereço do Mint:</strong> ${resultado.metadata.mintAddress}</li>
                    <li><strong>Endereço de Metadados (PDA):</strong> ${resultado.metadata.metadataPDA}</li>
                    <li><strong>Assinatura da Transação:</strong> ${resultado.metadata.signature}</li>
                </ul>
            `

        if (details.owner)
            html += `<p><strong>Carteira proprietária:</strong> ${details.owner}</p>`

        if (details.mintedAmount)
            html += `<p><strong>Quantidade de Tokens Mintados:</strong> ${details.mintedAmount}</p>`


        html += '</div>'
        resultContainer.innerHTML = html
    }
    else
    {
        resultContainer.innerHTML = '<div class="alert alert-danger"><strong>Erro!</strong> Falha ao executar a ação.</div>'
    }
}

function openModal()
{
    const modalContent = document.getElementById('modal-content')
    modalContent.innerHTML = '<p>Funcionalidade não implementada para esta ação.</p>'
    document.getElementById('overlay').style.display = 'flex'
    document.getElementById('modal').style.display = 'block'
}

function closeModal()
{
    document.getElementById('overlay').style.display = 'none'
    document.getElementById('modal').style.display = 'none'
}

async function fazerRequisicao(rota, metodo, dados = null)
{
    try
    {
        const response = await fetch(`${localUrl}${rota}`,
        {
            method: metodo,
            headers: {
                'Content-Type': 'application/json'
            },
            body: dados ? JSON.stringify(dados) : null
        })

        const resultado = await response.json()
        if (!response.ok)
        {
            throw new Error(resultado.error || 'Erro ao comunicar com o servidor')
        }

        return resultado
    }
    catch (error)
    {
        console.error('Erro na requisição:', error.message)
        alert('Erro ao processar a solicitação. Verifique os dados e tente novamente.')
        return null
    }
}