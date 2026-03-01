@echo off
REM Instalador Automático de Python + Servidor
REM Windows only

cd /d "%~dp0"

echo.
echo ════════════════════════════════════════════
echo    OutletPro - Instalador Python
echo ════════════════════════════════════════════
echo.

REM Verificar se Python já está instalado
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Python já está instalado!
    echo.
    echo Iniciando servidor...
    python -m http.server 8000
    pause
    exit /b
)

echo ⬇ Baixando Python...
echo.

REM Download do Python 3.11 (versão estável)
set PYTHON_URL=https://www.python.org/ftp/python/3.11.8/python-3.11.8-amd64.exe
set PYTHON_INSTALLER=%TEMP%\python-installer.exe

powershell -Command "(New-Object Net.WebClient).DownloadFile('%PYTHON_URL%', '%PYTHON_INSTALLER%')"

if not exist "%PYTHON_INSTALLER%" (
    echo ❌ Erro ao baixar Python
    echo.
    echo Baixe manualmente em: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo ✓ Download concluído!
echo.
echo Instalando Python (marque a opção "Add Python to PATH")...
echo.

REM Instalar Python com pip e adicionar ao PATH
"%PYTHON_INSTALLER%" /quiet InstallAllUsers=1 PrependPath=1

if %errorlevel% neq 0 (
    echo ❌ Erro na instalação
    pause
    exit /b 1
)

echo.
echo ✓ Python instalado com sucesso!
echo.
echo Iniciando servidor...
echo.
echo ════════════════════════════════════════════
echo    Acesse em seu navegador:
echo    http://localhost:8000
echo ════════════════════════════════════════════
echo.
echo Pressione Ctrl+C no servidor para parar
echo.

python -m http.server 8000

pause
