# EmpApp
This app implements a stack of **AngularJS/Html5** on the front end and **NodeJS/ExpressJS/MongoDB** on the backend

## Security

### Authentication
[passportjs](http://passportjs.org/) and [google oauth2 strategy](http://passportjs.org/guide/google/) is used for authentication. Users log in using their google id. Register the url in [google developer console](https://console.developers.google.com/project) to get the key and secret for oauth authentication

### Session Management
[expressjs-session](https://github.com/expressjs/session) used for session management with mongo session store using [connect-mongo](https://github.com/kcbanner/connect-mongo) for providing a persistent store compared to the default memory store

### CSRF
[expressjs-csurf](https://github.com/expressjs/csurf) module used to manage csrf protection tokens. Token is set as cookie in response which angular js transparently sets as request header

## Functionality
### sign up
Use the sign up page, provide a **sign up code** and use *google id* to register. Application verifies if the sign up code is valid and if the maximum no of user registration has not reached. If it is true, then user is signed up.

### Log in
Valid login is required to perform any operation within application. Login using *google id*. Application verifies if the user is **registered**. if not, login is rejected

### Home
in the home screen, it displays *first 10 employee* information. There is a [carousel](http://angular-ui.github.io/bootstrap/) in place to iterate over the values. this can be further filtered using angular list filtering on the employee last name.

Clicking on the *employee image* takes to the details page.

### Add
Here a new employee information can be added. The photo of the employee can be dragged and dropped which uses [angular-file-upload](https://github.com/danialfarid/angular-file-upload). **email id** of the user is required. While adding an employee, application validates if another employee exists with the same email id and if yes it is rejected

### Details
This is similar to employee add - the *difference* is it does an update to existing record.

### global search bar
Search can be performed by employee last name or skills. The menu options are shown using [drop down control](http://angular-ui.github.io/bootstrap/). The search ignores case of the input text.

### Logout
This logs out the user from application and destroys the session. But this does not log the user out of google. so if the tab is not closed user can simply click the login url without presenting google sign in

## Miscellaneous
### UI
* UI layout and folder structure inspired from an excellent article on [angular/node/mongodb](http://sahatyalkabov.com/create-a-tv-show-tracker-using-angularjs-nodejs-and-mongodb/)
* [Angular Strap](http://mgcrea.github.io/angular-strap/) is used for navigation bar, alert messages, popover etc. It provides **$alert** as a service which can be injected in angular controllers
* Note *Angular Strap* and *Angular UI Bootstrap* both aims to compete in bringing bootstrap ui elements into angular. They each have their cool features but they step on each others toes in some of the naming conventions. I have used both in application but taken care to avoid the conflicts by doing custom builds

### Backend
* Mongo db connection is handled using [mongoose](https://github.com/learnboost/mongoose) which is an ~~**ORM**~~ **ODM** (after all it is *Document* based NoSQL) for nodejs applications

## Cloud Deploy
### Openshift
Used [Red Hat's openshift cloud](https://www.openshift.com/) to deploy the app.
### MongoLabs
Used [Mongolabs](https://mongolab.com/) to host mongodb which is connected from openshift
