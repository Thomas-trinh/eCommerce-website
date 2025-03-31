import { suite, test } from 'node:test';
import assert from 'node:assert';
import sql from '../config/dbconfig.js';
import { sendResetEmail } from '../controllers/emailService.js';
import { handleRegister, handleLogin, handlePasswordReset } from '../controllers/userController.js';
//import jsonwebtoken from 'jsonwebtoken';

suite('user database testing', () => {
    
    test('Return a username when a valid ID is provided', async () => { 
        //The userID 1 is called to return the user records from the database
        const id = 1;
        const result = await sql`SELECT id, username FROM users WHERE id = ${id};`;
        assert.ok(result.length > 0);
        });

    test('Return null when no user is found', async () => {
        //An invalid userID is called to display their username from the database
        const id = 999; //assume 999 is a userid that does not exist in database
        const result = await sql`SELECT username FROM users WHERE id = ${id}`;

        assert.equal(result[0], null); // on a successful test, the result produced is null
    });

});

suite('user authentication function testing', () => {
    
    test('Registration controller test to input new user in database', async () => {
        await sql`DELETE FROM users WHERE email = 'shrek@swamp.com'`; //deleting record from previous test attempts

        const req = { body: { userName: "shrekOgre", email: "shrek@swamp.com", password: "Donk3y123" }};
        const res = {
            status: (code) => {
                assert.equal(code, 200);
                return res;
            },
            render: (view) => {
                assert.equal(view, 'login' )
            },
        }
        await handleRegister(req, res);
    });

    test('Registration controller test to alert when user already exists in database', async () => {
        const req = { body: { userName: "shrekOgre", email: "shrek@swamp.com", password: "Donk3y123" }};
        const res = {
            status: (code) => {
                assert.equal(code, 403); //403 code is sent when email already exists as registered
                return res;
            },
            render: (view) => {
                assert.equal(view, 'register' );
            },
        }
        await handleRegister(req, res);
    });
    
    test('Login controller test for valid login', async () => {
        const req = { body: { email: "admin@test.com", password: "Admin123" }};
        const res = {
            status: (code) => {
                assert.equal(code, 200);
                return res;
            },
            redirect: (view) => {
                assert.equal(view, '/token/admin' )
            },
        }
        await handleLogin(req, res);
    
    });

    test('Login controller test for invalid login', async () => {
        const req = { body: { email: "cherrypie@fake.com", password: "Cherry123" }};
        const res = {
            status: (code) => {
                assert.equal(code, 404);
                return res;
            },
            render: (view) => {
                assert.equal(view, 'login' )
            }
        }
        await handleLogin(req, res);
    
    });

    test('Email service request to reset password sends email successfully.', async () => {
        const req = { body: { email: "admin@test.com" }};
        const res = {
            status: (code) => {
                assert.equal(code, 200);
                return res;
            },
            render: (view, message) => {
                assert.equal(view, 'reset-password' );
                assert.equal(message, "You have been sent an email to reset your password! Check your email and click the link, or try again.")
            },
            cookie: (name) => {
                assert.equal(name, 'token');  // Adjust as per your implementation
            }

        }
        await handlePasswordReset(req, res);

    });

    test('Email request to reset password rejects request for invalid email', async () => {
        const req = { body: { email: "cherrypie@fake.com" }};
        const res = {
            status: (code) => {
                assert.equal(code, 500);
                return res;
            },
            render: (view) => {
                assert.equal(view, 'reset-password' );
            },
            // cookie: (name) => {
            //     assert.equal(name, 'token');  // Adjust as per your implementation
            // }

        }
        await handlePasswordReset(req, res);

    });

});

after(async () => {
        await sql.end();
});
