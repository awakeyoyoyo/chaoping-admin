@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

title 朝平农业 - 后台管理
set "ADMIN_DIR=%~dp0"

echo.
echo   ============================================
echo     🌾  朝平农业 - 后台管理启动脚本
echo   ============================================
echo.

:: ==========================================
::  Step 1: 检查 Node.js
:: ==========================================
echo   [1/3] 检查 Node.js 环境...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo   ✗ 未检测到 Node.js

    where winget >nul 2>nul
    if %errorlevel% equ 0 (
        echo   → 正在通过 winget 自动安装 Node.js...
        echo.
        winget install OpenJS.NodeJS.LTS --silent --accept-package-agreements --accept-source-agreements
        if %errorlevel% equ 0 (
            echo   ✓ 安装完成。请重新运行此脚本以启动服务。
        ) else (
            echo   ✗ 自动安装失败，请手动安装
            start https://nodejs.org/zh-cn
        )
    ) else (
        echo   → 正在打开 Node.js 下载页面...
        start https://nodejs.org/zh-cn
    )
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo   ✓ Node.js !NODE_VER!

:: ==========================================
::  Step 2: 启动服务
:: ==========================================
echo.
echo   [2/3] 启动本地服务...

:: 先清理残留 PID 文件
if exist "%ADMIN_DIR%.server.pid" del "%ADMIN_DIR%.server.pid" >nul

:: 启动 Node 服务
start /b "" node "%ADMIN_DIR%server.js" >nul 2>&1

:: 等待端口就绪
set RETRY=0
:wait
timeout /t 1 /nobreak >nul
set /a RETRY+=1

if exist "%ADMIN_DIR%.server.pid" (
    set /p PID=<"%ADMIN_DIR%.server.pid"
    echo   ✓ 服务已启动 (PID: !PID!)
    goto :open
)

if !RETRY! lss 10 goto :wait

echo   ✗ 服务启动失败，请尝试手动执行: node server.js
pause
exit /b 1

:: ==========================================
::  Step 3: 打开浏览器
:: ==========================================
:open
echo.
echo   [3/3] 打开后台页面...
start http://localhost:8080

echo.
echo   ════════════════════════════════════════
echo     后台地址：http://localhost:8080
echo     关闭此窗口即停止服务
echo   ════════════════════════════════════════
echo.
echo   按任意键停止服务...
pause >nul

:: ==========================================
::  清理
:: ==========================================
echo.
echo   正在停止服务...

if exist "%ADMIN_DIR%.server.pid" (
    set /p PID=<"%ADMIN_DIR%.server.pid"
    taskkill /f /pid !PID! >nul 2>&1
    del "%ADMIN_DIR%.server.pid" >nul
    echo   ✓ 服务已停止
)

exit /b 0
