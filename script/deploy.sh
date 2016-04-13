#!/bin/bash
if [ -f whappu.tar.gz ]
  then rm whappu.tar.gz
fi
tar -cvzf whappu.tar.gz src/*
scp whappu.tar.gz $WA_DEPLOY_TARGET
