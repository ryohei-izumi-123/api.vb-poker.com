# api.vb-poker.com

--------------------

## node.js version

should be `10.18.1`

```
nodenv local 10.18.1
```

## middlewares

* NGINX
* NODE + NPM + PM2

## package manager

* YARN

### for the first, install `node_modules`

```[cmd]
yarn install
# or
yarn setup
# and you need to make configure file for clusters by doing this:
./cluster_config.sh
```

### install global dev dependency

```[cmd]
npm install -g istanbul mocha node-gyp nyc pm2 
```

### write environment configure. Please see `.env.example`

```[cmd]
APP_ENV="SOMETHING-LIKE-SECURE!!"
OPENSSL_SALT="SOMETHING-LIKE-SECURE!!"
OPENSSL_IV="SOMETHING-LIKE-SECURE!!"
JWT_SALT="SOMETHING-LIKE-SECURE!!"
```

### run application

```[cmd]
yarn pm2:config
yarn pm2
```

### run application as production

```[cmd]
yarn pm2:config:prod
yarn pm2:prod
```

### restart application(production)

```[cmd]
git stash
git pull
yarn install
yarn pm2:stop
yarn pm2:delete
yarn pm2:save
yarn pm2:cleardump
yarn pm2:config:prod
yarn pm2:prod
```

### start applicationa when server reboots, which means working like `chkconfig app on`

```[cmd]
yarn pm2:startup
```

### stop applications

```[cmd]
yarn pm2:delete
```

### logging application

```[cmd]
yarn pm2:tail
```

### unit testing

```[cmd]
yarn test
# or
yarn test:controllers
# or coverage
yarn cover
```

### scafolding via cli

```[cmd]
# create controller/route/model/schame
yarn cli your_class_name
```


### scafolding via cli for typescript interface

```[cmd]
# create interface file from model
yarn ts-interface
```

### JSON validator(using Ajv)

to validate JSON, you need to define JSON schema file.
to create JSON schema, you can find a tool on internet easily.

[online-json-to-schema-converter](https://www.liquid-technologies.com/online-json-to-schema-converter)

>  field `$schema` should be removed like following: `"$schema": "http://json-schema.org/draft-04/schema#"`


#### JSON schema files

* `/assets/schema/i18n/${scope}.json`: define for `i18n`
* `/assets/schema/acl.json`: define for `acl`