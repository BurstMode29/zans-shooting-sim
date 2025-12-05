@echo off
cd /d "%LOCALAPPDATA%\Android\Sdk\cmdline-tools\latest\bin"
echo y | sdkmanager.bat --install "ndk;25.1.8937393"