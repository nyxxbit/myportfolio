const express = require('express');
const path = require('path');
const app = express();
const PORT = 80;

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname)));

// Middleware para logs de requisições
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Rota principal - serve o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para a página 404
app.get('/404', (req, res) => {
    res.sendFile(path.join(__dirname, '404.html'));
});

// Rota para debug
app.get('/debug', (req, res) => {
    res.sendFile(path.join(__dirname, 'debug.html'));
});

// Middleware para tratar 404 - deve ser o último
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Middleware para tratar erros
app.use((error, req, res, next) => {
    console.error('Erro no servidor:', error);
    res.status(500).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Erro 500</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    background: #0d1117; 
                    color: #ffffff; 
                    text-align: center; 
                    padding: 50px; 
                }
                h1 { color: #ff6b6b; }
                a { color: #00fffb; text-decoration: none; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <h1>500 - Erro Interno do Servidor</h1>
            <p>Algo deu errado no servidor.</p>
            <a href="/">← Voltar ao Início</a>
        </body>
        </html>
    `);
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`
🚀 Servidor Gabriel Barretta Portfolio iniciado!

╭─────────────────────────────────────╮
│  ⚡ Servidor rodando com sucesso:   │
│                                     │
│  🌐 URL: http://localhost:${PORT}         │
│  📁 Pasta: ${__dirname}│
│  🕒 Iniciado: ${new Date().toLocaleString('pt-BR')}      │
│                                     │
│  📄 Rotas disponíveis:              │
│  • / → Portfólio principal          │
│  • /404 → Página de erro           │
│  • /debug → Página de debug        │
╰─────────────────────────────────────╯

💡 Dica: Execute como administrador para usar a porta 80
📧 Contato: contato@rubyverse.store
    `);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Servidor sendo encerrado...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Servidor sendo encerrado...');
    process.exit(0);
});

module.exports = app;