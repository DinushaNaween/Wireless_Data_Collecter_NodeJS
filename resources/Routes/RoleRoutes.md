
# <ins>Role Routes</ins>

### 1. Create role
- *Method & path*
```
  POST - '/role'  
```
- *Request body*
```json
  {
    "roleName": "admin 3"
  }
```
- *Success response*
```json
  {
    "state":true,
    "created_role":{
      "id":3,
      "roleName":"admin 3",
      "disabled":0,
      "lastModifiedUser":null,
      "lastModifiedDateTime":"2020-07-15T04:38:48.088Z"
    }
  }
```

### *2. Get role by id*
- *Method & path*
```
  GET - '/role/:roleId'
```
- *Request params*
```
  roleId
```
- *Success response*
```json
  {
    "state":true,
    "role":{
      "roleId":3,
      "roleName":"admin 3",
      "disabled":"0",
      "lastModifiedUser":null,
      "lastModifiedDateTime":"2020-07-15T04:38:48.000Z"
    }
  }
```
### *3. Get all roles*
- *Method & path*
```
  GET - '/role'
```
- *Success response*
```json
  {
    "state":true,
    "roles":[
      {
        "roleId":1,
        "roleName":"admin",
        "disabled":"0",
        "lastModifiedUser":"1",
        "lastModifiedDateTime":"2020-06-29T15:53:44.  000Z"
      },
      {
        "roleId":2,
        "roleName":"admin 2",
        "disabled":"0",
        "lastModifiedUser":null,
        "lastModifiedDateTime":"2020-07-15T04:38:16.  000Z"
      },
      {
        "roleId":3,
        "roleName":"admin 3",
        "disabled":"0",
        "lastModifiedUser":null,
        "lastModifiedDateTime":"2020-07-15T04:38:48.  000Z"
      }]
  }
```
### *4. Update role by id*
- *Method & path*
```
  PUT - '/role/:roleId'
```
- *Request params*
```
  roleId
```
- *Request body*
```json
  {
    "roleName": "Admin 1",
    "lastModifiedUser": "1"
  }
```
- *Success response*
```json
  {
    "state":true,
    "updated_role":{
      "id":"1",
      "roleName":"Admin 1",
      "disabled":"0",
      "lastModifiedUser":"1",
      "lastModifiedDateTime":"2020-07-15T15:44:08.316Z"
    }
  }
```
### *5. Delete role by id*
- *Method & path*
```
  DELETE - '/role/:roleId'
```
- *Request params*
```
  roleId
```
- *Success response*
```json
  {
    "state":true,
    "message":"Role deleted successfully"
  }
```
### *6. Delete all role*
- *Method & path*
```
  DELETE - '/role'
```
- *Success response*
```json
  {
    "state":true,
    "message":"All roles deleted successfully"
  }
```
### *7. Disable role by id*
- *Method & path*
```
  PUT - '/role/disable/:roleId'
```
- *Request params*
```
roleId
```
- *Request body*
```json
  {
    "lastModifiedUser": "1",
    "lastModifiedDateTime": "2020-03-11T17:58:14.361+0000"
  }
```
- *Success response*
```json
  {
    "state":true,
    "message":"Disabled role with id: 3."
  }
```