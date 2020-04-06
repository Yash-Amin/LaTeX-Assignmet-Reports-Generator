# ./Info
Here is some information of Backend.
* ### ./api/
    * authMiddleware.js
        * Middleware that allows authenticated users
    * error.js
        * Function that is used to create JSON Object of the error response.
    * image.js
        * Express Router, with routes to upload image, get image.
    * index.js
        * Combines all routers [users, image, practicals] and exports Express Router
    * latexApi.js
        * Functions to generate LaTeX code from JSON.
    * practicals.js
        * Express Router to save, get reports data in JSON, generate PDF, view PDF.
    * user.js
        * Express Router for user module. Login and Signup.

* ### ./build/
    * Directory to store React build

* ### ./functions/
    * users.js
        * Provides function to handle user data from database. 

* ### ./models/
    * Directory to store Sequelize models

* ### ./config.js
    * Store configurations of the project like database creentials.
    * Don't forget to change `debug` to false in `config.js` atfter testing.

* ### ./db.js
    * Connects to the database
    * Exports sequelize database object

* ### ./dbSync.js
    * Used to delete whole database and create again.
    * To add practicals, add titles in `practicals` array.

* ### ./passport.js
    * Authentication and Session management

* ### ./index.js
    * Main file
    * Change the session secret in this file.
