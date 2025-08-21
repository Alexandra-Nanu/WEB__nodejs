//DEFINES CRUD OPERATIONS RELATED TO JOBS IN RELATION TO THE DATABASE

const pool = require('../db'); //import the database connection pool

const createJob = async (job) => {
    //created a job in the database
    const {title, company, type, experience_level,salary} = job; //structure
    const [result] = await pool.query('INSERT INTO jobs (title, company, type, experience_level, salary) VALUES (?, ?, ?, ?, ?)', [title, company, type, experience_level, salary]); //inserting into the db
    //pool.query -> executes the SQL INSERT to add the job to the database
    //? -> placeholders
    //[title, company, type, experience_level, salary] -> supplies the actual data for the placeholders
    //await -> waits for the query to complete before continuing
    //[result] -> extracts metadata about the query (id, new row, warnings, errors)
    return result.insertId; //contains information about the outcome of the query (id of the inserted row, number of rows affected and warnings
};

const getAllJobs = async () => {
    //retrieves all jobs from the database
    const [rows] = await pool.query('SELECT * FROM jobs'); //fetch all jobs
    return rows; //return the list of all jobs
};

const getJobById = async (jobId) => {
    //retrieve job by id
    const [rows] = await pool.query('SELECT * FROM jobs WHERE id = ?', [jobId]);
    return rows[0];
}

const getJobsSortedBySalary = async (order = 'ASC') => {
    //fetch all jobs sorted by salary
    const [rows] = await pool.query(`SELECT * FROM jobs ORDER BY salary ${order}`);
    return rows;
};

const updateJob = async (jobId, updatedJob) => {
    //update and existing job
    const {title, company, type, experience_level, salary} = updatedJob; //data to be updated with
    await pool.query('UPDATE jobs SET title = ?, company = ?, type = ?, experience_level = ?, salary = ? WHERE id = ?', [title, company, type, experience_level,salary]);
    return true; //return true to indicate it was successful
};

const deleteJob = async (jobId) => {
    //delete job by its ID
    await pool.query('DELETE FROM jobs WHERE id = ?', [jobId]);
    return true;
};

module.exports = {createJob, getAllJobs, getJobById, getJobsSortedBySalary, updateJob, deleteJob};
//export the CRUD functions so they can be used in other models