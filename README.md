# EmpApp
This app implements a stack of angularjs/html5 on the front end and node/express/mongodb on the backend

## Security

### Authentication
passportjs and google oauth2 strategy is used for authentication. Users log in using their google id. Register the url in google to get the key and secret for oauth authentication

### Session Management
express session used for session management with mongo session store for providing a persistent store compared to the default memory store

### CSRF
express csrf module used to manage csrf protection tokens. Token is set as cookie in response which angular js transparently sets as request header

## Functionality
### sign up
Use the sign up page, provide a sign up code and use google id to register. Application verifies if teh sign up code is valid and if the maximum no of user registration have reached

### Log in
Valid login is required to perform any operation within application. Login using google id. Application verifies if the user is registered. if not, login is rejected

### Home
in the home screen, it displays first 10 employee information. There is a carousel in place to iterate over the values. this can be further filtered using angular list filtering on the employee last name.

Clicking on the employee image takes to the details page.

### Add
Here a new employee information can be added. the photo of the employee can be dragged and dropped. email id of the user is required. While adding an employee, application validates if another employee exists with the same email id and if yes it is rejected

### Details
This is similar to employee add only it does an update to existing record.

### global search bar
Search can be performed by employee last name or skills. The search ignores case of the input text.
