require('dotenv').config({ path: './.env' })
const {dbConn} = require('./src/config/dbConn');
const PORT = process.env.PORT || 3500;
const {app,server} = require('./src/index')

try {
     dbConn().then(() => {
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }).catch((err) => { console.log(err) })
} catch (error) {
    console.error(error)
}


