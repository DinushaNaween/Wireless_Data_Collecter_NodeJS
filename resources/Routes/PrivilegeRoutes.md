
# <ins>Privilege Routes</ins>

#### 1. Create privilege
- *Method & path*
```
  POST - '/privilege'  
```
- *Request body*
```json
  {
    "privilegeDescription": "edit new collection"
  }
```
- *Success response*
```json
  {
    "state":true,
    "created_privilege":{
      "id":1,
      "privilegeDescription":"edit new collection",
      "disabled":0,
      "lastModifiedUser":null,
      "lastModifiedDateTime":"2020-07-16T08:00:46.898Z"
    }
  }
```

#### *2. Get privilege by id*
- *Method & path*
```
  GET - '/privilege/:privilegeId'
```
- *Request params*
```
  privilegeId
```
- *Success response*
```json
  {
    "state":true,
    "privilege":{
      "privilegeId":1,
      "privilegeDescription":"edit new collection",
      "disabled":"0",
      "lastModifiedUser":null,
      "lastModifiedDateTime":"2020-07-16T08:00:46.000Z"
    }
  }
```
#### *3. Get all privileges*
- *Method & path*
```
  GET - '/privilege'
```
- *Success response*
```json
  {
    "state":true,
    "privileges":[
      {
        "privilegeId":1,
        "privilegeDescription":"edit new collection",
        "disabled":"0",
        "lastModifiedUser":null,
        "lastModifiedDateTime":"2020-07-16T08:00:46.000Z"
      },
      {
        "privilegeId":2,
        "privilegeDescription":"create new collection",
        "disabled":"0",
        "lastModifiedUser":null,
        "lastModifiedDateTime":"2020-07-16T08:02:48.000Z"
      },
      {
        "privilegeId":3,
        "privilegeDescription":"delete new collection",
        "disabled":"0",
        "lastModifiedUser":null,
        "lastModifiedDateTime":"2020-07-16T08:02:57.000Z"
      }]
  }
```
#### *4. Update privilege by id*
- *Method & path*
```
  PUT - '/privilege/:privilegeId'
```
- *Request params*
```
  privilegeId
```
- *Request body*
```json
  {
    "privilegeDescription": "new description",
    "lastModifiedUser": "1"
  }
```
- *Success response*
```json
  {
    "state":true,
    "updated_privilege":{
      "id":"1",
      "privilegeDescription":"new description",
      "lastModifiedUser":"1",
      "lastModifiedDateTime":"2020-07-16T09:27:41.231Z"
    }
  }
```
#### *5. Delete privilege by id*
- *Method & path*
```
  DELETE - '/privilege/:privilegeId'
```
- *Request params*
```
  privilegeId
```
- *Success response*
```json
  {
    "state":true,
    "message":"Privilege deleted successfully"
  }
```
#### *6. Delete all privilege*
- *Method & path*
```
  DELETE - '/privilege'
```
- *Success response*
```json
  {
    "state":true,
    "message":"All privileges deleted successfully"
  }
```
#### *7. Disable privilege by id*
- *Method & path*
```
  PUT - '/privilege/disable/:privilegeId'
```
- *Request params*
```
privilegeId
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
    "message":"Disabled privilege with id: 2."
  }
```