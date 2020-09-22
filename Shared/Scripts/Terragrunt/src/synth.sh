#!/bin/bash

rm -rf  ./cdk.tf.json
cd $1
yarn
cdktf get
cdktf synth
cd -
cp $1/cdktf.out/cdk.tf.json .
