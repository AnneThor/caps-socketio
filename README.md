# Code Academy Parcel Service (CAPS): Event Driven Parcel Delivery Management System
Socket.io event driven app that represents live tracking of a parcel delivery service; the CAPS app is the socket server that manages communication between vendors and drivers.

**Client Apps**

**[Vendors](https://github.com/AnneThor/caps-vendor/blob/main/README.md)**

**[Drivers](https://github.com/AnneThor/caps-driver/blob/main/README.md)**

**[Express Post Route for Pickups](https://github.com/AnneThor/caps-express/blob/main/README.md)**

## Author: Anne Thorsteinson

**[Tests](https://github.com/AnneThor/caps-socketio/actions)**

**[Front End - UNDER CONSTRUCTION](https://parcel-delivery-tracker.herokuapp.com/)**

## Setup

```.env``` requirements:

- ```PORT```
- ```STORE_NAME```: the name of the store currently operating

## Running the App

Currently working on the backend, so there is no front end display yet

- ```npm start```: this will run the app in the console, app will log the events coming in from vendor and driver client apps

- When a pickup event is sent from a vendor, the app will broadcast to the system, and a driver will respond when it is picked up
- In transit and delivered messages are emitted from the driver app and handled by the CAPS system, which routes only to the interested vendor (the vendor whose package is being delivered)
- The CAPS app prints a log of all transactions to the console

![Console Log Text](./assets/caps-example.png)


### Endpoints:

The app runs from the ```/caps``` namespace

## Tests

- Unit Tests: ```npm run test``` testing is complete for listener functions
- Lint Tests: ```npm run lint```

## UML Diagram

![UML Diagram](./assets/Lab12.png)
