@echo off
REM Install .NET SDK locally for building

set DOTNET_CHANNEL=9.0
set INSTALL_DIR=.\dotnet

REM Download the install script
powershell -NoProfile -ExecutionPolicy unrestricted -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; &([scriptblock]::Create((Invoke-WebRequest -UseBasicParsing 'https://dot.net/v1/dotnet-install.ps1'))) -Channel %DOTNET_CHANNEL% -InstallDir %INSTALL_DIR%"

echo Installed .NET %DOTNET_CHANNEL% to %INSTALL_DIR%
