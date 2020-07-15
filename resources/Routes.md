# Routes - Wireless Data Collecter

 This file contains all the routes that are given through this api application.

### Role
### <a name="privilege">Privilege</a>

**1. Create role**
- *Method - path*
    ```
    POST - '/role'
    ```
- *Request body data.*
    ```json
    {
    	"roleName": "admin"
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

**2. Get role by id**
```
GET - '/role/:roleId'
```

**3. Get all roles**

    GET - '/role'

**4. Update role by id**

    PUT - '/role/:roleId'

**5. Delete role by id**

    DELETE - '/role/:roleId'

**6. Delete all role**

    DELETE - '/role'

**7. Disable role by id**

    PUT - '/role/disable/:roleId'
    
    
### Privilege(#privilege)
