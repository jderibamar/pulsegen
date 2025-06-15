const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')

require('dotenv').config()
const port = process.env.PORT || 3000

// Instanciar SolanaToken com dependências

app.listen(port, '0.0.0.0', () => 
{
    console.log('Servidor de testes ativo na porta %d', port)
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// Routing
app.use(express.static(path.join(__dirname, 'public')) )

// Rota para o index.html
app.get('/index', async (req, res) => 
{
    res.sendFile(path.join(__dirname, 'public/index.html'))
})
