@echo off
REM ============================================================
REM js-framework-benchmark PR 准备脚本 (Windows 版本)
REM ============================================================

setlocal enabledelayedexpansion

echo ==============================================
echo LytJS js-framework-benchmark PR 准备工具
echo ==============================================
echo.

REM 获取脚本所在目录
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"
for %%i in ("%SCRIPT_DIR%\..\..\..\..") do set "LYTJS_DIR=%%~fi"

echo [信息] 当前 LytJS 项目目录: %LYTJS_DIR%
echo.

REM 步骤 1: 检查文件
echo [步骤 1/5] 检查实现文件...

set "ALL_FILES_EXIST=true"

if not exist "index.html" (
  echo   [错误] 缺少文件: index.html
  set "ALL_FILES_EXIST=false"
) else (
  echo   [OK] index.html
)

if not exist "package.json" (
  echo   [错误] 缺少文件: package.json
  set "ALL_FILES_EXIST=false"
) else (
  echo   [OK] package.json
)

if not exist "README.md" (
  echo   [错误] 缺少文件: README.md
  set "ALL_FILES_EXIST=false"
) else (
  echo   [OK] README.md
)

if "!ALL_FILES_EXIST!"=="false" (
  echo.
  echo [错误] 缺少必要文件
  exit /b 1
)

echo.

REM 步骤 2: 验证 package.json
echo [步骤 2/5] 验证 package.json...

findstr /C:"\"name\": \"lytjs\"" package.json >nul
if !errorlevel! equ 0 (
  echo   [OK] package.json 名称正确
) else (
  echo   [警告] package.json 名称可能不正确
)

findstr /C:"\"version\": \"6.1.0\"" package.json >nul
if !errorlevel! equ 0 (
  echo   [OK] package.json 版本正确
) else (
  echo   [警告] package.json 版本可能不正确
)

echo.

REM 步骤 3: 验证 index.html
echo [步骤 3/5] 验证 index.html...

findstr /C:"Create 1,000 rows" index.html >nul
if !errorlevel! equ 0 (
  echo   [OK] 包含 'Create 1,000 rows' 按钮
) else (
  echo   [警告] 可能缺少 'Create 1,000 rows' 按钮
)

findstr /C:"bootstrap" index.html >nul
if !errorlevel! equ 0 (
  echo   [OK] 包含 Bootstrap 样式
) else (
  echo   [警告] 可能缺少 Bootstrap 样式
)

echo.

REM 步骤 4: 输出下一步
echo [步骤 4/5] 准备就绪！
echo.

echo ==============================================
echo 下一步操作
echo ==============================================
echo.

echo 1. 访问 https://github.com/krausest/js-framework-benchmark 并 Fork
echo.

echo 2. 克隆你的 Fork:
echo    git clone https://github.com/YOUR_USERNAME/js-framework-benchmark.git
echo    cd js-framework-benchmark
echo.

echo 3. 创建新分支:
echo    git checkout -b add-lytjs
echo.

echo 4. 复制实现:
echo    xcopy /E /I "%SCRIPT_DIR%" frameworks\keyed\lytjs
echo.

echo 5. 提交更改:
echo    git add frameworks/keyed/lytjs
echo    git commit -m "Add LytJS v6.1.0 - Lightweight Zero-Dependency Framework"
echo.

echo 6. 推送到 GitHub:
echo    git push origin add-lytjs
echo.

echo 7. 创建 Pull Request
echo.

echo ==============================================
echo 详细说明请查看: PR_PREPARATION_GUIDE.md
echo ==============================================
echo.

REM 步骤 5: 询问是否启动本地测试
set /p "REPLY=是否启动本地服务器进行测试? (y/n): "
if /i "%REPLY%"=="y" (
  echo.
  echo 启动本地服务器...
  echo 访问: http://localhost:8080
  echo 按 Ctrl+C 停止
  echo.
  python -m http.server 8080
)
