# Script para instalar Node.js e rodar o servidor OutletPro
# Execute: powershell -ExecutionPolicy Bypass -File install-and-run.ps1

Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  OutletPro - Instalação e Execução   ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar se Node.js está instalado
$nodeExists = $null -ne (Get-Command node -ErrorAction SilentlyContinue)

if ($nodeExists) {
    Write-Host "✓ Node.js já está instalado!" -ForegroundColor Green
    node --version
} else {
    Write-Host "⚙️  Node.js não encontrado. Instalando..." -ForegroundColor Yellow
    
    # Verificar se winget ou choco está disponível
    $chocoExists = $null -ne (Get-Command choco -ErrorAction SilentlyContinue)
    $wingetExists = $null -ne (Get-Command winget -ErrorAction SilentlyContinue)
    
    if ($chocoExists) {
        Write-Host "Usando Chocolatey para instalar Node.js..." -ForegroundColor Yellow
        choco install nodejs -y
    } elseif ($wingetExists) {
        Write-Host "Usando Windows Package Manager para instalar Node.js..." -ForegroundColor Yellow
        winget install OpenJS.NodeJS --silent
    } else {
        Write-Host "⚠️  Chocolatey/Winget não encontrado." -ForegroundColor Red
        Write-Host "Baixe Node.js manualmente em: https://nodejs.org" -ForegroundColor Yellow
        Write-Host "Depois execute este script novamente." -ForegroundColor Yellow
        Exit 1
    }
    
    # Recarregar variáveis de ambiente
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
}

Write-Host ""
Write-Host "✓ Iniciando servidor OutletPro..." -ForegroundColor Green
Write-Host ""

cd server
node server-simple.js
