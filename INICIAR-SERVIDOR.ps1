#!/usr/bin/env pwsh
# OutletPro - Auto Server Starter
# Detecta e inicia o melhor servidor disponível

Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   OutletPro - Iniciador Automático" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$folder = "c:\Users\joaol\Music\outletpro"

# 1. Tentar Python (mais comum)
Write-Host "🔍 Procurando por Python..." -ForegroundColor Yellow
$python = $null
try {
    $pythonCheck = python --version 2>&1
    if ($pythonCheck -like "Python*") {
        $python = "python"
        Write-Host "✓ Python encontrado: $pythonCheck" -ForegroundColor Green
    }
} catch {}

# 2. Tentar Python3
if (-not $python) {
    try {
        $pythonCheck = python3 --version 2>&1
        if ($pythonCheck -like "Python*") {
            $python = "python3"
            Write-Host "✓ Python3 encontrado: $pythonCheck" -ForegroundColor Green
        }
    } catch {}
}

# 3. Tentar Node.js
$nodejs = $null
if (-not $python) {
    Write-Host "🔍 Procurando por Node.js..." -ForegroundColor Yellow
    try {
        $nodeCheck = node --version 2>&1
        if ($nodeCheck -like "v*") {
            $nodejs = $true
            Write-Host "✓ Node.js encontrado: $nodeCheck" -ForegroundColor Green
        }
    } catch {}
}

# Iniciar o servidor apropriado
Write-Host ""
Write-Host "🚀 Iniciando servidor..." -ForegroundColor Cyan

if ($python) {
    Write-Host "Usando Python HTTP Server" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Acesse em seu navegador:" -ForegroundColor Yellow
    Write-Host "   http://localhost:8000" -ForegroundColor White
    Write-Host ""
    Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Gray
    Write-Host ""
    & $python -m http.server 8000 --directory $folder
} 
elseif ($nodejs) {
    Write-Host "Usando Node.js Server" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Acesse em seu navegador:" -ForegroundColor Yellow
    Write-Host "   http://localhost:3000" -ForegroundColor White
    Write-Host ""
    Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Gray
    Write-Host ""
    & node "$folder\server-simple.js"
}
else {
    Write-Host ""
    Write-Host "❌ NENHUM SERVIDOR ENCONTRADO" -ForegroundColor Red
    Write-Host ""
    Write-Host "Soluções:" -ForegroundColor Yellow
    Write-Host "1. Baixe Python em: https://www.python.org/downloads/" -ForegroundColor White
    Write-Host "2. Baixe Node.js em: https://nodejs.org/" -ForegroundColor White
    Write-Host "3. Use VS Code + Live Server (veja SERVIDOR.txt)" -ForegroundColor White
    Write-Host ""
}
