@echo off
REM Servidor OutletPro - Standalone
REM Usa Node.js embutido se disponível, senão oferece alternativas

cd /d "%~dp0"

setlocal enabledelayedexpansion

cls
echo.
echo ════════════════════════════════════════════
echo    OutletPro - Servidor Standalone
echo ════════════════════════════════════════════
echo.

REM Opção A: Tentar Node.js
where node >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Node.js encontrado!
    echo.
    echo Iniciando servidor Node...
    echo.
    echo 📍 Acesse: http://localhost:3000
    echo.
    echo Pressione Ctrl+C para parar
    echo.
    node server-simple.js
    pause
    exit /b
)

REM Opção B: Tentar Python
where python >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Python encontrado!
    echo.
    echo Iniciando servidor Python...
    echo.
    echo 📍 Acesse: http://localhost:8000
    echo.
    echo Pressione Ctrl+C para parar
    echo.
    python -m http.server 8000
    pause
    exit /b
)

REM Opção C: Nada encontrado - oferecer alternativas
cls
echo.
echo ════════════════════════════════════════════
echo    ❌ Nenhum servidor encontrado
echo ════════════════════════════════════════════
echo.
echo Escolha uma opção:
echo.
echo 1. Instalar Python automaticamente (recomendado)
echo 2. Usar VS Code + Live Server (mais fácil)
echo 3. Abrir manual do Python
echo.
set /p opcao="Digite sua opção (1-3): "

if "%opcao%"=="1" (
    echo.
    echo Iniciando instalação de Python...
    call INSTALAR-PYTHON.bat
    exit /b
)

if "%opcao%"=="2" (
    echo.
    echo Veja o guia em: LIVE-SERVER-GUIA.txt
    echo.
    pause
    notepad LIVE-SERVER-GUIA.txt
    exit /b
)

if "%opcao%"=="3" (
    echo.
    echo Abrindo página de downloads...
    start https://www.python.org/downloads/
    pause
    exit /b
)

echo.
echo Opção inválida!
pause
