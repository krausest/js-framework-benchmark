@echo off

xcopy ..\..\..\..\TS\mimbl\package.json node_modules\mimbl\ /i /y /d >nul
xcopy ..\..\..\..\TS\mimbl\lib\*.* node_modules\mimbl\lib\ /s /i /y /d >nul

webpack --display-error-details
