**Loopback CLI**

```

npm i -g @loopback/cli

```

**To create a loopback Project**

```

lb4 app

```

**Give the project Name, desc, root dir and Application Class Name and it will install all the dependencies like mocha, eslint, docker, vscode ,etc.**


**To Run project**

```

npm start

```

### What is Model

- A Model describes business domain objects, for example, customer, Address and Order.
- Model describe the shape of data
- Behavior like CRUD operations is added by repositories.

**There are Two Types of Model for Domain Objects**

  - value Object : A domain object that does not have an Identity (ID).
  - Entity: A domain object that has an identity (ID).


**To create Model**

```
lb4 model ModelName
```

  - Then Select Entity or Model as per the need of ID.
  - Then enter property name, type, required and default value.
  - In models folder the file will be created of modelName and it will also be included in index file of model.


**What is DataSources**

- DataSources are LoopBacks way of connecting to various sources of data, such as databases.


**To create DataSource**

'''
lb4 datasource

'''
  - It will ask the name of datasources put db and then select of database line in memory db, mysql, mongodb, etc.



**TO Connect Mongodb with dataSources Example**

```

$ lb4 datasource
? Datasource name: db
? Select the connector for db:
  ...
  Redis key-value connector (supported by StrongLoop)
❯ MongoDB (supported by StrongLoop)
  MySQL (supported by StrongLoop)
  ...
? Connection String url to override other settings (eg: mongodb://username:passw
ord@hostname:port/database):
? host: localhost
? port: 27017
? user:
? password: [hidden]
? database: demo
? Feature supported by MongoDB v3.1.0 and above: Yes

Datasource Db was created in src/datasources/

```

**What is Repository**

  - In LoopBack3, you would use the model class definitions themselves to perform CRUD Operations.
  - A Repo represents a specialized service interface that provides strong-typed data access (For Example, CRUD) operations of a domain model against the underlying database or service.


**To create Repository**

```

lb4 repository

```

  - We have to select the dataSource
  - select the model for which u want to generate repo.
  -


**What is Controller**

  - In LoopBack4, controllers handle the request-response lifecycle for your API.
  - Each function on a controller can be addressed individually to handle an incoming request (like a POST request to / products), to perform business logic, and to return a response.


**To create Controller**

```

lb4 Controller

```

  - Then provide the controller class Name and all details.
