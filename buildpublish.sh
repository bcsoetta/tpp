#!/bin/bash
echo Compilation start!
npm run build && echo App compiled. Publishing... && publish && echo App Published.
