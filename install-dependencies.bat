@echo off
REM Script pour installer les dépendances Angular après correction des erreurs
REM Date: 26 novembre 2024

echo.
echo ========================================================
echo   INSTALLATION DES DEPENDANCES ANGULAR
echo   Correction: ngModel et chart.js
echo ========================================================
echo.

cd /d "%~dp0"

echo 1. Installation de chart.js...
call npm install chart.js

echo.
echo ========================================================
echo   INSTALLATION TERMINEE
echo ========================================================
echo.
echo Vous pouvez maintenant lancer: ng serve
echo.

pause

