const fs = require('fs').promises
const path = require('path')
const {format} = require('date-fns')

// Create file name
const fileName = path.join(__dirname, '../Logs', 'errorLogs.log')

// Create function write log to file
const errorLogEvents = async msg => {
    // Get dateTime with custom format
    const dateTime = `${format(new Date(), 'dd-MM-yyyy\tHH:mm:ss')}`
    // Custom content log before write to file
    const contentLog = `${dateTime}-----${msg}\n`

    try {
        // Write error logs to file
        await fs.appendFile(fileName, contentLog)
    } catch (error) {
        console.log("error::", error)
    }
}

module.exports = errorLogEvents