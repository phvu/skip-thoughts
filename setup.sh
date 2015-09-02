#!/usr/bin/env bash

SERVER_URL="http://www.cs.toronto.edu/~rkiros/models"
wget -P ./tables/ ${SERVER_URL}/dictionary.txt
wget -P ./tables/ ${SERVER_URL}/utable.npy
wget -P ./tables/ ${SERVER_URL}/btable.npy
wget -P ./models/ ${SERVER_URL}/uni_skip.npz
wget -P ./models/ ${SERVER_URL}/uni_skip.npz.pkl
wget -P ./models/ ${SERVER_URL}/bi_skip.npz
wget -P ./models/ ${SERVER_URL}/bi_skip.npz.pkl

echo "Done downloading model files. Now compiling bh-tsne"
cd ./bh_tsne/
g++ sptree.cpp tsne.cpp -o bh_tsne -O2
cd ..
