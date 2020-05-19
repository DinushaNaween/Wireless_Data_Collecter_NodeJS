#!/bin/bash

# Get userName of the mysql server
echo "mysql userName:"
read userName

# Get hostname
echo "mysql host:"
read hostName

mysql -u $userName -h $hostName -p < $1