# ExpressRedisSvelte
![demo](<./demo.gif>)

A quickstart for a webapp built with 
- frontend: SvelteKit
- backend: ExpressJS, Redis

## Features
- Authentication
- Redis backend

## Setup
- create a redis database
    - I used [redis.com](https://redis.com)
- add your redis credentials to `server/src/index.ts`
```ts
const client = redis.createClient({
    url: 'redis://redis-[...].cloud.redislabs.com:1234',
    password: ''
});
```

- set a secret for the `express-session`
```ts
app.use(session({
    secret: '',
    ...
})
```

- set the passport types in `static.d.ts` to be accessed on the Express`Request` and `Response` object
```ts
declare namespace Express {
    export interface Request {
        user: {
            id: string
            email: string
        };
        logout: ()=>any
    }
    export interface Response {
        ...
    }
  }
```


## Deployment
- cloud run deployment
```bash
docker build . -t marc/server
docker tag marc/server gcr.io/[GCP PROJECT ID]/server
docker push gcr.io/[GCP PROJECT ID]/server

# make sure you're using the right gcloud project
gcloud config set project [GCP PROJECT ID]
# you may have to create the cloud run instance
gcloud run deploy server --image gcr.io/[GCP PROJECT ID]/server
# select [1] Cloud Run (fully managed)
# select your desired region
```