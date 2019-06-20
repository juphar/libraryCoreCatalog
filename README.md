# core-catalog
IBM Watson Education Catalog of Applications and Services


## Quick start:

Navigate to the root folder and run the following commands:

### Initial setup
> npm run init

### Build app
> npm run build

### Start app
> npm start


## Explore the app:

### Health check API Call
http://localhost:8080/services/admin/health

### UI
http://localhost:8080

### Doc (How to use) - TBD
http://localhost:8080/docs/


## Get started with developing:

### Node app only
> npm run start:server

The Node app will now be up on port 8080.

### Sample Platform only
> npm run start:sample

The Node app will now be up on port 8081.

### UI, Node app, and Sample Platform
> npm run start:dev

This will bring up three servers in parallel, UI server will be up on port 3000, and send all the service calls to the Node app on 8080 through proxy, and on to the local sample platform API endpoint on 8081. Once started, it will bring up your default browser and open the UI app, any change made in the ui-src folder will be compiled and loaded in the browser automatically. 

### Build UI App
> npm run build

Once UI development is complete, run this command to build the UI app and deploy it to the public folder under the Node app.

### Run unit tests
> npm test