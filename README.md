**Basically, to secure your API endpoints, you need to:**

  -  decorate the endpoints of a controller with the @authenticate(strategyName, options?) decorator (app developer)
  - insert the authentication action in a custom sequence (app developer)
  - create a custom authentication strategy with a unique name (extension developer)
  - register the custom authentication strategy (app developer)
  - The Authentication Component takes care of the rest.

**Installation**

```

  npm install --save @loopback/authentication

```
