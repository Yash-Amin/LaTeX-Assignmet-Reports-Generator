var practicals = [
    'Create "Hello World" application. That will display "Hello World" in the middle of the screen using TextView Widget in the red color.',
    'Create Registration page to demonstration of Basic widgets available in android.',
    'Create sample application with login module.(Check username and password) On successful login, Change TextView "Login Successful" and on failing login, alert user using Toast "Login fail".',
    'Create an application for demonstration of Relative and Table Layout in android.',
    'Create an application for demonstration of Scroll view in android.',
    'Create an application for demonstration of Explicitly Starting New Activity using Intent.',
    'Create an application that will pass two number using TextView to the next screen , and on the next screen display sum of that number.',
    'Create spinner with strings taken from resource folder(res >> value folder).On changing spinner value, change background of screen.',
    'Create an application that will get the Text Entered in Edit Text and display that Text using toast (Message).',
    'Create an application that will Demonstrate Button onClick() Event and change the TextView Color based on button Clicked.',
    'Create an UI such that, one screen has list of all the types of cars. On selecting of any car name, next screen should show Car details like: name, launched date, company name.',
    'Create an application that will Demonstrate Dialog Box Control In Android.',
    'Create an application that will play a media file from the memory card.',
    'Create an application to send message between two emulators.',
    'Create an application to take picture using native application.',
    'Write a program to create a simple calculator in swift.',
    'Write a program to demonstrate different UI controllers',
    'Develop an iphone application in which user can insert, update and delete the record in database.',
    'Develop a medium size project using Android programming with using all controllers, notifications, database & views.'
];

var i = 0;

const db = require('./db');

const sequelize = require('sequelize');
const models = require('./models');
models.forEach(model => {
    model(db, sequelize);
});

db.sync({ force: true }).then(() => {
    const PracticalModel = require('./models/practicals')(db, sequelize);

    for (i = 0; i < practicals.length; i++) {
        var practical = practicals[i];
        PracticalModel.create({
            id: i + 1,
            name: 'Practical-' + (i + 1),
            aim: practical
        });
    }
});
