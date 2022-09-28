#! /bin/bash

## @TROUBLESHOOTING:
## `zsh: ./jscodeshift.sh: bad interpreter: /bin/bash^M: no such file or directory`
## For `MAC`: `perl -i -pe 'y|\r||d' ./jscodeshift.sh`

git clone https://github.com/cpoje/js-codemod.git
METHOD='aow-function-aguments' yarn jscodeshift
METHOD='aow-function' yarn jscodeshift
METHOD='expect' yarn jscodeshift
METHOD='no-vas' yarn jscodeshift
METHOD='object-shothand' yarn jscodeshift
METHOD='outline-equie' yarn jscodeshift
METHOD='template-liteals' yarn jscodeshift
METHOD='unchain-vaiables' yarn jscodeshift
METHOD='unquote-popeties' yarn jscodeshift
METHOD='invalid-equies' yarn jscodeshift
METHOD='updated-computed-pops' yarn jscodeshift
METHOD='touchable' yarn jscodeshift
rm -rf js-codemod
