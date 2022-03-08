import pg from 'pg';
import express from 'express';

// const express = require('express');
// const pg = require('pg'); -- CommonJS type of library installation

// create a simple express app
const app = express();
const port = 8000;

// create routes /all
app.get('/all', async (req, res) => {
    // res.send(`Connected to pg database...`);
    const fromDate = new Date();
    
    const newClient = new pg.Client({
        "user": "postgres",
        "password": "postgres",
        "host": "OSE",
        "port": "5432",
        "database": "customers"
        })
        
    await newClient.connect();
    console.log(`Connected to pg database...`) 

    const results = await newClient.query(`select * from customers limit 5`)
    newClient.end();
    
    // time diff calculation
    const toDate = new Date();
    const timeDiff = toDate.getTime() - fromDate.getTime();

    // send back to the wire
    if (results.rowCount > 0){
        console.table(results.rows);
        res.send({
                "results": results.rows,
                "timeDiff": timeDiff,
                "method": "single-connection"
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

// CommonJS type of async function creation to use await callbacks
// pgConnect();

// async function pgConnect(){
//     try {
//         await newClient.connect();
//         console.log(`Connected to pg database...`)        
//     } catch (error) {
//         console.log(error)
//     }
// }