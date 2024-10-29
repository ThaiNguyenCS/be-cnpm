const Log = require("../models/Log");

class LogService {
    async createLog(studentID, printerID, filename, startPrintTime, endPrintTime, numberOfPages) {
        console.log("Creating log");
        return await Log.create({ studentID, printerID, filename, startPrintTime, endPrintTime, numberOfPages });
    }

    async getLogById(id) {
        return await Log.findByPk(id);
    }
 
    async getLogByStudentId(studentID) {
        return await Log.findOne({
            where: {
                studentID: studentID,
            },
        });
    }

    async updateLog(id, updates) {
        const log = await Log.findByPk(id);
        if (!log) {
            throw new Error("Log not found");
        }
        return await log.update(updates);
    }
}

module.exports = new LogService();
