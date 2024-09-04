Steps to check the api

1. npm i
2. npx nodemon src/index.ts
3. Can test the api through postman http://localhost:3000/api/mail

For testing

Created test files for overall api, idempotancy, rate limiting , circuitbreaker and exponentialbackoff.
1. npx jest for overall testing 
2. npx jest RateLimiting.test.ts for component testing as an example 