// Author : Poorna Chand
// Purpose of this file: Basic login, register, and get and save details of employees

// import packages
const Knex = require('../models/knex')
const commonLib = require('../libraries/commonLibrary')
const Joi = require('@hapi/joi');
const fs = require('fs');
const moment = require('moment');

// create routes
const routes = [

    // login api
    {
        method: 'POST',
        path: '/login',
        handler: async (request, reply) => {
            let response
            let userData = [];
            try {
                // payload model
                const schema = await Joi.object({
                    username: Joi.string()
                        .min(3)
                        .max(255)
                        .required(),
                    password: Joi.string().required(),
                });
                // payload validation
                const { err } = await schema.validate(request.payload);
                // If any error during payload validation. send error message
                if (err) {
                    commonLib.log(err, 'error');
                    response = {
                        success: false,
                        message: 'Invalid Username or password'
                    }
                    return response
                }

                // Get list of employee and check username and password for authentication
                await Knex.raw(`SELECT l.lid, l.username, l.last_login, e.first_name, e.last_name, e.profile_pic, e.gender, e.dob, e.email, e.mobile, e.address, e.status FROM login l INNER JOIN employees e ON e.username = l.username WHERE l.username = '${request.payload.username}' AND l.password = MD5('${request.payload.password}') LIMIT 1`).then(async ([data]) => {
                    userData = await data
                    // checking for user is authenticated or not
                    if (userData.length > 0) {

                        // check for user in active or not
                        if (userData[0].status != 1) {
                            response = await {
                                success: false,
                                message: 'Your account is inactive'
                            }
                        } else {
                            // create token
                            response = await {
                                success: true,
                                message: 'Login successful',
                                data: userData[0]
                            }
                            // Update last login
                            await commonLib.insertOrUpdate(Knex, 'login', {
                                username: userData[0].username, last_login: moment().format('YYYY-MM-DD HH:mm:ss')
                            }).then((res) => {
                                console.log('last login updated');
                            })
                        }
                    } else {
                        response = await {
                            success: false,
                            message: 'Invalid Username or password'
                        }
                    }
                });
            } catch (err) {
                response = {
                    success: false,
                    message: 'Login failed'
                }
                commonLib.log('Error in catch - /login', err)
            }
            return response
        }
    },
    // get employees list
    {
        method: 'GET',
        path: '/employees',
        handler: async (request, reply) => {
            let response
            let employeesData = []
            try {
                // fetching employees list
                [employeesData] = await Knex.raw(`SELECT e.* FROM employees e`)
                response = {
                    success: true,
                    data: employeesData
                }
            } catch (err) {
                response = {
                    success: false,
                    message: 'failed to fetch employees list'
                }
                commonLib.log('Error in catch - /employees', err)
            }
            return response
        }
    },
    // add / save employee details
    {
        method: 'POST',
        path: '/employees',
        config: {
            payload: {
                maxBytes: 10048576,
            }
        },
        handler: async (request, reply) => {
            let response
            try {
                // payload data model
                const schema = await Joi.object({
                    username: Joi.string().required(),
                    first_name: Joi.string().required(),
                    password: Joi.string().optional(),
                    last_name: Joi.string().required(),
                    profile_pic: Joi.string().allow(null).optional(), // filename / null
                    file_data: Joi.string().allow(null).optional(), // base 64 / null
                    gender: Joi.string().required(),
                    dob: Joi.string().required(),
                    email: Joi.string().required(),
                    mobile: Joi.string().required(),
                    address: Joi.string().required(),
                    status: Joi.number().required()
                });
                // checking for payload validation
                const { err } = await schema.validate(request.payload);
                // send message if any error occurs during payload validation
                if (err) {
                    commonLib.log(err, 'error');
                    response = {
                        success: false,
                        message: 'Invalid input payload data'
                    }
                    return response
                }
                request.payload = [request.payload];
                const password = request.payload[0].password || null;

                if (request.payload[0].password) {
                    delete request.payload[0].password;
                }

                // profile upload
                for (const row of request.payload) {
                    // file upload
                    if (row.file_data) {
                        const base64Data = row.file_data.replace(/^data:([A-Za-z-+/]+);base64,/, '');
                        row.profile_pic = `${moment().format('mmDDssYYMMHH')}_${row.profile_pic}`;
                        try {
                            // file creation
                            await fs.writeFile('uploads/profile/' + row.profile_pic, base64Data, 'base64', async function (err) {
                                console.log(err, 'err in file upload 1');
                            });
                        } catch (error) {
                            console.log(error, 'error in file upload 2');
                        }
                    }
                    delete row.file_data;
                }
                // inserting employee data
                await commonLib.insertOrUpdate(Knex, 'employees', request.payload).then(async (res) => {
                    if (password) {
                        // if new user, then insert into login details 
                        const logData = await Knex('login').insert({
                            username: request.payload[0].username, password: Knex.raw("MD5('" + password + "')")
                        });
                    }
                    response = {
                        success: true,
                        message: 'Employee details saved successfully'
                    }
                })
            } catch (err) {
                response = {
                    success: false,
                    message: 'Operation failed'
                }
                commonLib.log('Error in catch - /employees post', err)
            }
            return response
        }
    },
    // registration
    {
        method: 'POST',
        path: '/register',
        config: {
            payload: {
                maxBytes: 10048576,
            }
        },
        handler: async (request, reply) => {
            let response
            let trx
            try {
                // payload data model
                const schema = await Joi.object({
                    username: Joi.string().required(),
                    password: Joi.string().optional(),
                    first_name: Joi.string().required(),
                    last_name: Joi.string().required(),
                    profile_pic: Joi.string().allow(null).optional(), // filename / null
                    file_data: Joi.string().allow(null).optional(), // base 64 / null
                    gender: Joi.string().required(),
                    dob: Joi.string().required(),
                    email: Joi.string().required(),
                    mobile: Joi.string().required(),
                    address: Joi.string().required(),
                    status: Joi.number().required()
                });
                // payload validation
                const { err } = await schema.validate(request.payload);
                // send message, if any errors during payload validation
                if (err) {
                    commonLib.log(err, 'error');
                    response = {
                        success: false,
                        message: 'Invalid input payload data'
                    }
                    return response
                }

                const userDetails = {
                    username: request.payload.username,
                    password: Knex.raw("MD5('" + request.payload.password + "')")
                }

                delete request.payload.password;

                // file upload
                if (request.payload.file_data) {
                    const base64Data = request.payload.file_data.replace(/^data:([A-Za-z-+/]+);base64,/, '');
                    request.payload.profile_pic = `${moment().format('mmDDssYYMMHH')}_${request.payload.profile_pic}`;
                    try {
                        // file generation
                        await fs.writeFile('uploads/profile/' + request.payload.profile_pic, base64Data, 'base64', async function (err) {
                            console.log(err, 'err in file upload 1');
                        });
                    } catch (error) {
                        console.log(error, 'error in file upload 2');
                    }
                }
                delete request.payload.file_data;
                // open transaction and insert into dependency tables
                trx = await Knex.transaction()
                const empData = await Knex('employees').transacting(trx).insert(request.payload);
                const logData = await Knex('login').transacting(trx).insert(userDetails);
                // transaction commited after details saved
                trx.commit();
                response = {
                    success: true,
                    message: 'Employee details saved successfully'
                };
            } catch (err) {
                // rollback transaction if any error occurred during inserting
                if (trx) {
                    trx.rollback();
                }
                response = {
                    success: false,
                    message: 'Operation failed'
                }
                commonLib.log('Error in catch - /register post', err)
            }
            commonLib.log('response', response)
            return response
        }
    },
    
    // delete employee
    {
        method: 'POST',
        path: '/delete/user',
        handler: async (request, reply) => {
            let response
            try {
                // payload data model
                const schema = await Joi.object({
                    username: Joi.string().required()
                });
                // payload validation
                const { err } = await schema.validate(request.payload);
                // send message, if any error during payload validation
                if (err) {
                    commonLib.log(err, 'error');
                    response = {
                        success: false,
                        message: 'Invalid input payload data'
                    }
                    return response
                }

                // delete details from alldependencies tables
                const login = await Knex.raw(`DELETE FROM login WHERE username = '${request.payload.username}'`);
                const employees = await Knex.raw(`DELETE FROM employees WHERE username = '${request.payload.username}'`);
                response = await {
                    success: true,
                    message: 'Employee deleted successfully'
                }
            } catch (err) {
                response = {
                    success: false,
                    message: 'Employee deletion failed'
                }
                commonLib.log('Error in catch - /delete/user post', err)
            }
            return response
        }
    },
];

module.exports = routes;
