@echo off
chcp 65001 >nul
cls

color 0B
echo.
echo ╔════════════════════════════════════════╗
echo ║  OutletPro - Servidor Node.js         ║
echo ╚════════════════════════════════════════╝
echo.

REM Verificar se Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ Node.js encontrado!
    node --version
    echo.
    goto START_SERVER
) else (
    echo ✗ Node.js não está instalado
    echo.
    echo Escolha uma opção:
    echo 1. Instalar via Chocolatey
    echo 2. Instalar via Winget
    echo 3. Instalar manualmente ^(abrir site^)
    echo 0. Sair
    echo.
    set /p choice="Digite sua escolha: "
    
    if "%choice%"=="1" (
        echo Instalando via Chocolatey...
        choco install nodejs -y
        if %ERRORLEVEL% NEQ 0 (
            echo ✗ Erro ao instalar com Chocolatey
            exit /b 1
        )
    ) else if "%choice%"=="2" (
        echo Instalando via Winget...
        winget install OpenJS.NodeJS --silent
        if %ERRORLEVEL% NEQ 0 (
            echo ✗ Erro ao instalar com Winget
            exit /b 1
        )
    ) else if "%choice%"=="3" (
        start https://nodejs.org
        echo Baixe e instale Node.js, depois execute este script novamente.
        pause
        exit /b 1
    ) else (
        exit /b 0
    )
)

:START_SERVER
echo.
echo Iniciando servidor...
echo.
cd server
node server-simple.js

pause
