#!/bin/sh

cd /source
npm i
pm2 start bin/www --name laundry
pm2 logs laundry
