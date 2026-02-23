@echo off
echo ====================================
echo CREATE DATABASE - SEKOLAH
echo ====================================
echo.

REM Ganti path ini sesuai lokasi MySQL Anda
set MYSQL_PATH=C:\xampp_baru\mysql\bin

echo Creating database 'sekolah_db'...
echo.

"%MYSQL_PATH%\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS sekolah_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Database 'sekolah_db' created successfully!
    echo.
    echo Now you can run:
    echo   npm run db:push
    echo   npm run db:seed
    echo.
) else (
    echo.
    echo ✗ Failed to create database!
    echo Please check if MySQL/MariaDB is running.
    echo.
    echo Start XAMPP and make sure MySQL service is running.
    echo.
)

pause
