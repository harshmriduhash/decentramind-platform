#!/bin/bash
# Clean environment startup script
unset cursor_snap_ENV_VARS
unset dump_zsh_state
export PATH="/Users/davidbonillajaylen2022/.nvm/versions/node/v20.10.0/bin:$PATH"
cd /Users/davidbonillajaylen2022/DecentraMind
exec node node_modules/.bin/next dev --port 3000

