import pg from 'pg';
import express from 'express';

// const express = require('express');
// const pg = require('pg'); -- CommonJS type of library installation

// create connection pool to the database, a random pool will be selected later to
// establish TCP connection to the customers db in docker postgres instance
const pool = new pg.Pool({
    "user": "postgres",
    "password": "postgres",
    "host": "OSE",
    "port": "5432",
    "database": "customers",
    "max": 20, 
    "connectionTimeoutMillis": 0,
    "idleTimeoutMillis": 0
    })

// create a simple express app
const app = express();
const port = 8001;

// create routes /all
app.get('/all', async (req, res) => {
    // res.send(`Connected to pg database...`);
    const fromDate = new Date();

    const results = await pool.query(`select * from customers limit 5`)
    
    // time diff calculation
    const toDate = new Date();
    const timeDiff = toDate.getTime() - fromDate.getTime();

    // send back to the wire
    if (results.rowCount > 0){
        console.table(results.rows);
        res.send({
                "results": results.rows,
                "timeDiff": timeDiff,
                "method": "connection-pooling"
            })
    }
    else {
        console.log(`No rows returned!`);
        res.send(`No rows returned!`)
    }
})

app.listen(port, () => {
    console.log(`App has started on port: ${port}`)
})