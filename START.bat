@echo off
REM START.BAT - Ponto de entrada principal do OutletPro
REM Execute este arquivo para iniciar tudo

setlocal enabledelayedexpansion
cd /d "%~dp0"

cls
color 0A
echo.
echo ╔════════════════════════════════════════════╗
echo ║  🚀 OUTLETPRO - GESTOR DE VENDAS 🚀       ║
echo ╚════════════════════════════════════════════╝
echo.
echo Escolha como deseja usar:
echo.
echo  1 - COM SERVIDOR (recomendado para produção)
echo  2 - SEM SERVIDOR (rápido para testes)
echo  3 - INSTALAR DEPENDÊNCIAS
echo  0 - SAIR
echo.
set /p choice="Digite sua escolha [0-3]: "

if "%choice%"=="1" (
    cls
    echo.
    echo ⏳ Verificando Node.js...
    echo.
    
    where node >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo ✗ Node.js não encontrado
        echo.
        echo Deseja instalar agora? (S/N)
        set /p install="Escolha: "
        if /i "%install%"=="S" (
            call download-nodejs.bat
        ) else (
            echo ℹ️  Use a opção 2 para modo sem servidor
            pause
            goto MENU
        )
    ) else (
        echo ✓ Node.js encontrado
        node --version
        echo.
        echo ⏳ Iniciando servidor...
        echo.
        cd server
        node server-simple.js
    )
    
) else if "%choice%"=="2" (
    cls
    echo.
    echo ✓ Abrindo dashboard em modo offline...
    echo.
    start "" "quick-test.html"
    echo ℹ️  Janela aberta no navegador
    echo ⏳ Pressione qualquer tecla para fechar...
    pause >nul
    
) else if "%choice%"=="3" (
    call download-nodejs.bat
    
) else if "%choice%"=="0" (
    exit /b 0
    
) else (
    echo ✗ Opção inválida
    pause
    goto MENU
)

goto MENU

:MENU
cls
call %0
