#!/usr/bin/env node

// Servidor OutletPro - Versão Simplificada (sem dependências externas)
// Pode ser executado com: node server-simple.js

const http = require('http');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Dados em memória (simula BD)
const companies = {};
const users = {};
const sessions = {}; // token -> { userId, companyId, exp }
const MAX_BODY = 1e6; // 1MB max request size

const PORT = 3000;

// Hash com SHA256 (melhor que algoritmo caseiro)
function hashPassword(pwd) {
    return crypto.createHash('sha256').update(String(pwd)).digest('hex');
}

function verifyPassword(pwd, hash) {
    return hashPassword(pwd) === hash;
}

function generateToken(userId, companyId) {
    const token = crypto.randomBytes(24).toString('hex');
    sessions[token] = { userId, companyId, exp: Date.now() + 3600_000 };
    return token;
}

function validateToken(token) {
    if (!token || !sessions[token]) return null;
    const sess = sessions[token];
    if (Date.now() > sess.exp) {
        delete sessions[token];
        return null;
    }
    return sess;
}


const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    // CORS & security headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';");

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Extrair token
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');

    console.log(`${req.method} ${pathname}`);

    // ===== ROTAS =====

    // POST /api/companies - Criar empresa
    if (pathname === '/api/companies' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
            if (body.length > MAX_BODY) {
                res.writeHead(413);
                res.end(JSON.stringify({ error: 'Request entity too large' }));
                req.connection.destroy();
            }
        });
        req.on('end', () => {
            try {
                const data = JSON.parse(body || '{}');
                const companyId = 'company_' + Date.now();
                const userId = 'user_' + Date.now();
                const passwordHash = hashPassword(data.adminPassword);

                companies[companyId] = {
                    id: companyId,
                    name: data.name,
                    slug: data.slug,
                    branding: { colors: { accent: '#7c6dff' }, logoUrl: null },
                    createdAt: new Date().toISOString()
                };

                users[userId] = {
                    id: userId,
                    companyId: companyId,
                    email: data.adminEmail,
                    passwordHash: passwordHash,
                    role: 'admin',
                    name: 'Administrador'
                };

                console.log(`✓ Empresa criada: ${data.slug}`);
                res.writeHead(201);
                res.end(JSON.stringify(companies[companyId]));
            } catch (e) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    // POST /api/login - Autenticar
    if (pathname === '/api/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
            if (body.length > MAX_BODY) {
                res.writeHead(413);
                res.end(JSON.stringify({ error: 'Request entity too large' }));
                req.connection.destroy();
            }
        });
        req.on('end', () => {
            try {
                const data = JSON.parse(body || '{}');
                const user = Object.values(users).find(u => u.email === data.email);

                if (!user || !verifyPassword(data.password, user.passwordHash)) {
                    res.writeHead(401);
                    res.end(JSON.stringify({ error: 'Credenciais inválidas' }));
                    return;
                }

                const token = generateToken(user.id, user.companyId);
                res.writeHead(200);
                res.end(JSON.stringify({ token: token }));
            } catch (e) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    // GET /api/config - Retornar configuração
    if (pathname === '/api/config' && req.method === 'GET') {
        const sess = validateToken(token);
        if (!sess) {
            res.writeHead(401);
            res.end(JSON.stringify({ error: 'Não autenticado ou token expirado' }));
            return;
        }

        const company = companies[sess.companyId];
        if (!company) {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Empresa não encontrada' }));
            return;
        }
        res.writeHead(200);
        res.end(JSON.stringify(company));
        return;
    }

    // GET /api/sellers, /api/produtos, /api/vendas - Retornar vazios por enquanto
    if (['/api/sellers', '/api/produtos', '/api/vendas'].includes(pathname) && req.method === 'GET') {
        const sess = validateToken(token);
        if (!sess) {
            res.writeHead(401);
            res.end(JSON.stringify({ error: 'Não autenticado ou token inválido' }));
            return;
        }
        res.writeHead(200);
        res.end(JSON.stringify([]));
        return;
    }

    // Servir arquivos HTML/CSS/JS estáticos (com proteção contra traversal)
    const base = path.join(__dirname, '..');
    let filePath = path.normalize(path.join(base, pathname === '/' ? 'index.html' : pathname));
    if (!filePath.startsWith(base)) {
        res.writeHead(403);
        res.end(JSON.stringify({ error: 'Access denied' }));
        return;
    }
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Arquivo não encontrado' }));
            return;
        }

        const ext = path.extname(filePath);
        const contentTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'text/javascript',
            '.json': 'application/json'
        };

        res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║   OutletPro Server - Rodando 🚀        ║
╠════════════════════════════════════════╣
║   http://localhost:${PORT}              ║
║   http://localhost:${PORT}/login.html   ║
║   http://localhost:${PORT}/admin.html   ║
╚════════════════════════════════════════╝
    `);
});
