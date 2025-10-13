RED='\033[0;31m'
GREEN='\033[0;32m'

if tsc --project tsconfig.json --pretty --noEmit
then
    echo -e "\n${GREEN}=================\nTYPESCRIPT PASSED\n=================\n\n"
else
    echo -e "\n${RED}=================\nTYPESCRIPT FAILED\n=================\n\n"
    exit 1
fi

if prettier --write ./src/ ./tailwind.config.js
then
    echo -e "\n${GREEN}===============\nPRETTIER PASSED\n===============\n\n"
else
    echo -e "\n${RED}===============\nPRETTIER FAILED\n===============\n\n"
    exit 1
fi

if eslint ./src --ext .ts,.tsx --fix
then
    echo -e "\n${GREEN}=============\nLINTER PASSED\n=============\n\n"
else
    echo -e "\n${RED}=======================\nLINTER FAILED - FIX IT!\n=======================\n\n"
    exit 1
fi