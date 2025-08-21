//DEFINES THE ROUTES, ENSURES ACCESS AND CONNECTS TO THE DATABASE TO PERFORM CRUD OPERATIONS

const express = require('express'); //import the express framework for building the web server
const bcrypt = require('bcrypt'); //import bcrypt for password hashing
const passport = require('passport'); //import passport for authentication
const pool = require('../db'); //import the database connecting pool
const router = express.Router(); //create an express router instance for defining routes
const {getJobsSortedBySalary} = require('../models/job'); //import function that sorts by salary

function isLoggedIn(req, res, next) {
    //Middleware to check if user is logged in
    if(req.isAuthenticated()) {
        return next(); //allow the request to proceed if logged in
    }
    res.redirect('/login'); //else, redirect to login page
}

/*
* / -> specifies the root path
* req -> request (incoming HTTP request; contains data sent by the client, such as query parameters, form data etc.
* res -> response (outgoing HTTP response; used to send data back to the client, such as HTML or a redirect
* */

router.get('/', (req, res) => {
    res.render('index', {user: req.user}); //render the index view, passing the logged-in user's details
});

//Route for registration page
router.get('/register', (req, res) => {
    //route to render registration page
    res.render('register');
});

router.post('/register', async (req, res) => {
    //route to handle the registration process
    try {
        const {username, password} = req.body; //extract username and password from the request
        const hashedPassword = await bcrypt.hash(password, 10); //hash the password with bcrypt
        const [result] = await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]); //insert username and password into the db
        if (result.affectedRows === 1) { //check if insertion was successful
            res.redirect('/login'); //redirect to the login page
        } else { //if it failed
            throw new Error("Registration failed."); //throw error
        }
    } catch (error) {
        console.error("Error during registration: ", error); //log the error
        res.render('register', {error: "Registration failed."}); //render registration page with an error message
    }
});
router.get('/login', (req, res) => {
    //route to render the login page
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    //route to handle the login process using passport
    successRedirect: '/', //redirect to home page upon successful login
    failureRedirect: '/login', //redirect back to the login page if login fails
}));

router.get('/logout', (req, res) => {
    //route to handle user logout
    req.logOut((err) => { //log the user out
        if (err) { //if an error occurred
            console.error(err); //log the error
        }
        res.redirect('/'); //else, redirect to home page
    });
});
router.get('/manage-jobs', isLoggedIn, async (req, res) => {
    //route to render and manage jobs and users
    try {
        const [userRows] = await pool.query('SELECT * FROM users'); //fetch all users from the db
        const users = userRows; //store the fetched users
        const [jobRows] = await pool.query('SELECT * FROM jobs'); //fetch all jobs from the db
        const jobs = jobRows; //store the fetched jobs
        res.render('manage-jobs', {users, jobs}); //render manage-jobs page
    } catch (error) {
        console.error(error); //log the error, if existing
        res.status(500).send('Error fetching jobs and users');
    }
});

router.get('/jobs/sort', async (req, res) => {
    //route to fetch jobs sorted by salary
    try {
        const { order } = req.query; //retrieve the sorting order ('ASC' or 'DESC')
        const sortedJobs = await getJobsSortedBySalary(order || 'ASC'); //default to ascending order
        res.render('manage-jobs', { jobs: sortedJobs }); //render the view with sorted jobs
    } catch (error) {
        console.error(error); //log error if existing
        res.status(500).send('Failed to fetch jobs');
    }
});

router.get('/view-job/:id', isLoggedIn, async (req, res) => {
    //route to view details of a specific job
    const jobId = req.params.id; //extract the job ID from the URL
    try {
        const [jobRows] = await pool.query('SELECT * FROM jobs WHERE id = ?', [jobId]); //fetch the job details by ID
        const job = jobRows[0]; //get the first result (job object)
        res.render('view-job', { job }); //render the view-job page with the job details
    } catch (error) {
        console.error('Error fetching job details:', error); //log error if existing
        res.status(500).send('An error occurred while fetching the job details.');
    }
});

router.get('/add-job', isLoggedIn, (req, res) => {
    //route to render the add-job page
    res.render('add-job');
});
router.post('/add-job', isLoggedIn, async (req, res) => {
    //route to handle adding a new job
    try {
        const {title, company, type, experience_level, salary} = req.body; //extract the job details from the request
        await pool.query('INSERT INTO jobs (title, company, type, experience_level, salary) VALUES (?, ?, ?, ?,?)', [title, company, type, experience_level, salary]); //insert the job into the db
        res.redirect('/manage-jobs'); //redirect to the manage-job page after adding the job
    } catch (error) {
        console.error(error); //log error if existing
        res.status(500).send('Error adding job');
    }
});
router.get('/edit-job/:id', isLoggedIn, async (req, res) => {
    //route to render the edit-job page for a specific job
    const jobId = req.params.id; //get the job ID from the URL
    try {
        const [jobRows] = await pool.query('SELECT * FROM jobs WHERE id = ?', [jobId]); //fetch the job details by the ID
        const job = jobRows[0]; //get tge first result (job object)
        res.render('edit-job', {job}); //render the edit-job view with the job details
    } catch (error) {
        console.error(error); //log error if existing
        res.status(500).send('Error fetching job details');
    }
});
router.post('/edit-job/:id', isLoggedIn, async (req, res) => {
    //handle updating and job
    const jobId = req.params.id; //get the job ID from the URL
    const {title, company, type, experience_level, salary} = req.body; //extract the updated job details from the request body
    try {
        await pool.query('UPDATE jobs SET title = ?, company = ?, type = ?, experience_level = ?, salary = ? WHERE id = ?', [title, company, type, experience_level, salary, jobId]); //update the job
        res.redirect('/manage-jobs'); //redirect to the manage-job page
    } catch (error) {
        console.error(error); //log error if existing
        res.status(500).send('Error updating job');
    }
});
router.get('/delete-job/:id', isLoggedIn, async (req, res) => {
    //route to render the delete-job page
    const jobId = req.params.id; //get the job ID from the URL
    try {
        const [jobRows] = await pool.query('SELECT * FROM jobs WHERE id = ?', [jobId]); //fetch the job details by ID
        const job = jobRows[0]; //get the first result
        res.render('delete-job', {job}); //render the delete-job view
    } catch (error) {
        console.error(error); //log error if existing
        res.status(500).send('Error fetching job details');
    }
});
router.post('/delete-job/:id', isLoggedIn, async (req, res) => {
    //route to handle deleting a job
    const jobId = req.params.id; //get the job ID from the URL
    try {
        await pool.query('DELETE FROM jobs WHERE id = ?', [jobId]); //delete the job from the database
        res.redirect('/manage-jobs'); //redirect to the manage-jobs page after deleting the job
    } catch (error) {
        console.error(error); //log error if existing
        res.status(500).send('Error deleting job');
    }
});

module.exports = router; //export the router to be used in the main app