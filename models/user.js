//DEFINES CRUD OPERATIONS RELATED TO USERS IN RELATION TO THE DATABASE

const bcrypt = require('bcrypt'); //import the bcrypt library for hashing passwords
const pool = require('../db'); //import the database connection pool for executing queries

const createUser = async (user) => {
    //async function fo create a new user
    const {username, password} = user; //username and password for the user object
    const hashedPassword = await bcrypt.hash(password, 10); //hash the password using bcrypt with a salt factor of 10 for security
    //salt of 10 -> add 10 random characters before it is hashed => each password is unique, even if 2 users have the same password
    const [result] = await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]); //insert into db
    return result.insertId; //return the ID of the newly inserted user
};
const findUserByUsername = async (username) => {
    //async function to find a user by their username
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0]; //return the first matching user from the result
};

module.exports = {createUser, findUserByUsername};
//export functions so that they can be used is other models