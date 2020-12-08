@echo off

xcopy ..\..\..\..\TS\mimbl\package.json node_modules\mimbl\ /i /y /d >nul
xcopy ..\..\..\..\TS\mimbl\lib\*.* node_modules\mimbl\dist\ /s /i /y /d >nul

webpack -p --display-error-details
