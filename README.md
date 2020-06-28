# Wireless Data Collecter

Wireless Data Collector is a express + mysql API application created for collect data from greenhouses. This application contains bunch of different kinds of API endpoints to interact with mysql database. As [Wireless Data Collector - DB Schema.pdf](https://github.com/DinushaNaween/Wireless_Data_Collector_NodeJS/blob/master/Wireless%20Data%20Collector%20-%20DB%20Schema.pdf) shows, this API contains,

1. Users
2. User Roles
3. Role Privileges
4. Collections
5. Units
6. Parent Nodes
7. Nodes
8. Sensors
9. Data Tables

### Users, Roles and Role Privileges
Users are divided into roles and each role having privileges of creating deleting and editing of various things with database. 

### Collections, Units, Parent Nodes, Nodes, Sensors
Collection is the biggest group of this system. This collection contains large no of greenhouses. This contains no of units. Each unit having one or more parent node that connected with independent nodes. These each node have sensors connected with it.

### Data Tables
Data tables are for store data that nodes collect. Each node having seperate table for store data. Nodes are different from each other because of their different sensors. So, each node have different table to store data.

### This application is capable of doing,

1. Create, Update, Edit, Delete Users, Privileges, Roles, Collections, Units, Parent Nodes, Nodes, Sensors
2. Create, Alter, Modify, Drop data tables

### Data Collecting Process
Each node is responsible for their parent node. That means each node sends its sensor data to its parent node. Parent node then collect all data objects from its nodes and combined it as one data object. Then parent node send it to database. This application is designed for catch that data object and save it in database.

## Installation

1. Clone or download repo.
2. Open it with VS Code or any other IDE.
3. Create .env file and add following credentials,

```
# Database configurations
HOST = (Host)
USER = (User)
PASSWORD = (Your Password)
PORT = (Port Number)
DB = (Your Database Name)

# Json Web Token secret key
JWT_ACCESS_TOKEN_SECRET = (Secret For Access Token)
JWT_REFRESH_TOKEN_SECRET = (Secret For Refresh Token)

# Mail configurations
SERVICE = (Email Service)
MAILADDRESS = (Mail Address For Send Emails)
MAILPASSWORD = (Password Of Email Address Provided Above)

# Cloudinary configurations
COLUDINARY_CLOUD_NAME = (Cloudinary Cloud Name)
COLUDINARY_API_KEY = (Cloudinary API Key)
COLUDINARY_API_SECRET = (Cloudinary API Secret)
```

Rename USER or PASSWORD or any above details according to your mysql credentials.

4. Open mysql with MySQL Workbench or with CMD.
5. create database named with 'wdc'.
6. Add source file of [tables.sql](https://github.com/DinushaNaween/Wireless_Data_Collector_NodeJS/blob/master/tables.sql).
7. Run this command to install npm packages.

```bash
npm install --save
```
    
8. Run this command to start server.

```bash
npm start
```