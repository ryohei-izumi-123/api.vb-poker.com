#! /bin/bash

## @TROUBLESHOOTING:
## `zsh: ./cluster-config.sh: bad interpreter: /bin/bash^M: no such file or directory`
## For `MAC`: `perl -i -pe 'y|\r||d' ./cluster-config.sh`
## For `LINUX`: `sed -i 's/\r//' ./cluster-config.sh && sed -i 's/\r//g' ./cluster-config.sh`

getProcessors()
{
  if [[ -f /proc/cpuinfo ]] ; then
    sudo echo $(sudo cat /proc/cpuinfo | sudo awk '/^processor/{print $3}' | sudo wc -l)
  else
    sudo echo $(sudo sysctl -n hw.ncpu)
  fi
}

_PROCESSORS=`getProcessors`

_ENV_NAME=$1
_DEFAULT_ENV_NAME="default"
if [ "${_ENV_NAME}" = "" ]; then
  _ENV_NAME="${_DEFAULT_ENV_NAME}"
fi

if [ "${_ENV_NAME}" = "development" ]; then
  sudo rm -rf "./config/development.json"
  sudo \cp -f "./config/default.json" "./config/development.json"
fi

if [ "${_ENV_NAME}" = "test" ]; then
  sudo rm -rf "./config/test.json"
  sudo \cp -f "./config/default.json" "./config/test.json"
fi

if [ "${_ENV_NAME}" = "staging" ]; then
  sudo rm -rf "./config/staging.json"
  sudo \cp -f "./config/default.json" "./config/staging.json"
fi

if [ "${_ENV_NAME}" = "production" ]; then
  sudo rm -rf "./config/production.json"
  sudo \cp -f "./config/default.json" "./config/production.json"
fi

for ((PROCESSOR=0; PROCESSOR < $_PROCESSORS; PROCESSOR++)); do
  sudo \cp -f "./config/${_ENV_NAME}.json" "./config/${_ENV_NAME}-${PROCESSOR}.json"
  sudo echo "CONFIG FILE CREATED: ./config/${_ENV_NAME}-${PROCESSOR}.json";
done

exit 0
