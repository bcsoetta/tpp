@echo off
(
    echo =================================================================
    echo Compilation start!
    echo =================================================================
    npm run build && goto publish
    goto fail

    :publish
    echo =================================================================
    echo Compilation success!
    echo Publishing app...
    echo =================================================================
    publish
    if errorlevel 0 goto success
    echo Publish failed.
    goto fail

    :success
    echo =================================================================
    echo App published!
    echo =================================================================
    goto quit

    :fail
    echo Process exited with code %ERRORLEVEL%

    :quit
    echo Script ended.
)