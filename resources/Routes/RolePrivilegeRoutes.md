
# <ins>RolePrivilege Routes</ins>

### 1. Create rolePrivilege
- *Method & path*
```
  POST - '/rolePrivilege'  
```
- *Request body*
```json
  {
    "roleId": "1",
    "privilegeId": "1"
  }
```
- *Success response*
```json
  {
    "state":true,
    "created_rolePrivilege":{
      "id":2,
      "roleId":"1",
      "privilegeId":"1",
      "disabled":0,
      "lastModifiedUser":null,
      "lastModifiedDateTime":"2020-07-17T16:50:55.236Z"
    }
  }
```

### *2. Get rolePrivilege by id*
- *Method & path*
```
  GET - '/rolePrivilege/:rolePrivilegeId'
```
- *Request params*
```
  rolePrivilegeId
```
- *Success response*
```json
  {
    "state":true,
    "rolePrivilege":{
      "rolePrivilegeId":2,
      "roleId":1,
      "privilegeId":1,
      "disabled":"0",
      "lastModifiedUser":null,
      "lastModifiedDateTime":"2020-07-17T16:50:55.000Z"
    }
  }
```
### *3. Get all rolePrivileges*
- *Method & path*
```
  GET - '/rolePrivilege'
```
- *Success response*
```json
  {
    "state":true,
    "rolePrivileges":[
      {
        "rolePrivilegeId":2,
        "roleId":1,
        "privilegeId":1,
        "disabled":"0",
        "lastModifiedUser":null,
        "lastModifiedDateTime":"2020-07-17T16:50:55.000Z"
      },
      {
        "rolePrivilegeId":3,
        "roleId":1,
        "privilegeId":3,
        "disabled":"0",
        "lastModifiedUser":null,
        "lastModifiedDateTime":"2020-07-17T16:55:34.000Z"
      },
      {
        "rolePrivilegeId":4,
        "roleId":3,
        "privilegeId":2,
        "disabled":"0",
        "lastModifiedUser":null,
        "lastModifiedDateTime":"2020-07-17T16:56:21.000Z"
      }]
  }
```
### *4. Update rolePrivilege by id*
- *Method & path*
```
  PUT - '/rolePrivilege/:rolePrivilegeId'
```
- *Request params*
```
  rolePrivilegeId
```
- *Request body*
```json
  {
    "roleId": "3",
    "privilegeId": "3",
    "lastModifiedUser": "1"
  }
```
- *Success response*
```json
  {
    "state":true,
    "updated_rolePrivilege":{
      "id":"3",
      "roleId":"3",
      "privilegeId":"3",
      "disabled":0,
      "lastModifiedUser":"1",
      "lastModifiedDateTime":"2020-07-17T17:01:01.314Z"
    }
  }
```
### *5. Delete rolePrivilege by id*
- *Method & path*
```
  DELETE - '/rolePrivilege/:rolePrivilegeId'
```
- *Request params*
```
  rolePrivilegeId
```
- *Success response*
```json
  {
    "state":true,
    "message":"Role privilege deleted successfully"
  }
```
### *6. Delete all rolePrivilege*
- *Method & path*
```
  DELETE - '/rolePrivilege'
```
- *Success response*
```json
  {
    "state":true,
    "message":"All role privileges deleted successfully"
  }
```
### *7. Disable rolePrivilege by id*
- *Method & path*
```
  PUT - '/rolePrivilege/disable/:rolePrivilegeId'
```
- *Request params*
```
rolePrivilegeId
```
- *Request body*
```json
  {
    "lastModifiedUser": "1"
  }
```
- *Success response*
```json
  {
    "state":true,
    "message":"Disabled role privilege with id: 1."
  }
```