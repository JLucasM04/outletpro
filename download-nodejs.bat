@echo off
REM Script para download e instalação automática do Node.js
REM Este script baixa a versão LTS de Node.js e instala

setlocal enabledelayedexpansion

cls
color 0B
echo.
echo ╔═══════════════════════════════════════════╗
echo ║  OutletPro - Download e Instalação       ║
echo ║  de Node.js                              ║
echo ╚═══════════════════════════════════════════╝
echo.

REM Verificar se Node.js já está instalado
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ Node.js já está instalado!
    node --version
    echo.
    cd /d "%~dp0"
    cd server
    echo Iniciando servidor...
    node server-simple.js
    exit /b 0
)

echo ⏳ Baixando Node.js...
echo.

REM Criar pasta de downloads temporário
set TEMP_DIR=%TEMP%\nodejs-install
if not exist "%TEMP_DIR%" mkdir "%TEMP_DIR%"

REM Download (usando PowerShell)
powershell -Command ^
    "$url = 'https://nodejs.org/dist/v18.12.1/node-v18.12.1-x64.msi'; ^
    $output = '%TEMP_DIR%\node-setup.msi'; ^
    Write-Host 'Baixando Node.js 18.12.1...'; ^
    try { ^
        Invoke-WebRequest -Uri $url -OutFile $output; ^
        Write-Host('✓ Download completo'); ^
    } catch { ^
        Write-Host('✗ Erro no download'); ^
        exit 1; ^
    }"

if %ERRORLEVEL% NEQ 0 (
    echo ✗ Erro ao baixar Node.js
    echo.
    echo Baixe manualmente em: https://nodejs.org
    pause
    exit /b 1
)

echo.
echo ⏳ Instalando Node.js...
echo.

REM Executar instalador
"%TEMP_DIR%\node-setup.msi" /quiet /norestart

if %ERRORLEVEL% NEQ 0 (
    echo ✗ Erro na instalação
    pause
    exit /b 1
)

echo.
echo ✓ Node.js instalado com sucesso!
echo.

REM Atualizar variáveis de ambiente
setlocal enabledelayedexpansion
for /f "tokens=2*" %%a in ('reg query HKLM\SYSTEM\CurrentControlSet\Control\Session\ Manager\Environment /v PATH') do set "PATH=%%b"
set PATH=%PATH%;C:\Program Files\nodejs

echo Verificando instalação...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Reinicie o computador para completar a instalação.
    pause
    exit /b 1
)

echo.
node --version
echo.
echo ✓ Pronto! Iniciando servidor...
echo.

cd /d "%~dp0"
cd server
node server-simple.js

pause
