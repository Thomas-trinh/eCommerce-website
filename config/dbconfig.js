import postgres from 'postgres';

export const sql = postgres({
    host: 'localhost',
    port: 5432,
    database: 'postgres'
    ,
    username: 'postgres'
    ,
    password: 'postgres'
    });


// export const connectToDB = async (host, port, database, username, password) => {
//     try {
//         const sql = postgres({
//             host,
//             port,
//             database,
//             username,
//             password
//         });
//         const result = await sql`SELECT NOW()`;
//         console.log(`connection was successful ${result[0].now}`);
//         return "Connection successful";
//     } catch (error) {
//         console.error(`Failed to connect to the DB ${error}`);
//         console.log(error);
//         throw new Error("Failed to connect to the DB");
//     }
// };

// export const closeConnection = async () => {
//     try {
//         await sql.end(); // Close the connection
//         console.log("Database connection closed.");
//     } catch (error) {
//         console.error("Error closing the database connection:", error);
//     }
// };


export default sql;
