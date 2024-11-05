const logService = require("../services/logService");
const Log = require("../models/PrintingLog");
const {v4: uuidv4} = require('uuid');
class LogController {
    async createLog(req, res) {
        const {studentUserName, printerId, fileId, noOfCopies, a3Quantity, a4Quantity} = req.body;
        try {
            const now = new Date();
            const startPrintTime = now.toISOString();  // Thời gian bắt đầu in
            
            const time = (a3Quantity * 2 + a4Quantity * 1) * noOfCopies;
            const endPrintTime = new Date(now.getTime() + time * 1000).toISOString(); // Thời gian kết thúc in
            
            const newLog = Log.build({
                id: uuidv4(),
                startTime: startPrintTime,
                finishTime: endPrintTime,
                a4Quantity,
                a3Quantity,
                noOfCopies,
                fileId,
                printerId,
                studentUserName
            });
            await newLog.save();
            res.status(201).json(newLog);
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }
    

    async getLog(req, res) {
        try {
            console.log("Fetching logs for studentID:", req.params.studentUserName);
            
            const logs = await logService.getLogByStudentUserName(req.params.studentUserName);
            console.log("Logs found:", logs);
    
            if (logs && logs.length > 0) {
                const formattedLogs = logs.map(log => {
                    return {
                        ...log.toJSON(),
                        startPrintDate: log.startTime.toISOString().split('T')[0],
                        startPrintTime: log.startTime.toISOString().split('T')[1].split('.')[0],
                        endPrintDate: log.finishTime ? log.finishTime.toISOString().split('T')[0] : null,
                        endPrintTime: log.finishTime ? log.finishTime.toISOString().split('T')[1].split('.')[0] : null,
                    };
                });
                res.status(200).json(formattedLogs);
            } else {
                res.status(404).json({error: "Logs not found"});
            }
        } catch (error) {
            console.error("Error fetching logs:", error);
            res.status(500).json({error: error.message});
        }
    }
    
    async getLogsByTimeStudent(req, res) {
        const {studentUserName} = req.params;
        const {startTime, endTime} = req.query;

        try {
            const logs = await logService.getLogsByTimeStudent(studentUserName, startTime, endTime);

            if (logs.length > 0) {
                const formattedLogs = logs.map(log => ({
                    ...log.toJSON(),
                    startPrintDate: log.startTime.toISOString().split('T')[0],
                    startPrintTime: log.startTime.toISOString().split('T')[1].split('.')[0],
                    endPrintDate: log.finishTime.toISOString().split('T')[0],
                    endPrintTime: log.finishTime.toISOString().split('T')[1].split('.')[0],
                }));
                res.status(200).json(formattedLogs);
            } else {
                res.status(404).json({error: "No logs found"});
            }
        } catch (error) {
            console.error("Error fetching logs:", error);
            res.status(500).json({error: error.message});
        }
    }
    async getLogsByTime(req, res) {
        const {startTime, endTime} = req.query;

        try {
            const logs = await logService.getLogsByTime(startTime, endTime);

            if (logs.length > 0) {
                const formattedLogs = logs.map(log => ({
                    ...log.toJSON(),
                    startPrintDate: log.startTime.toISOString().split('T')[0],
                    startPrintTime: log.startTime.toISOString().split('T')[1].split('.')[0],
                    endPrintDate: log.finishTime.toISOString().split('T')[0],
                    endPrintTime: log.finishTime.toISOString().split('T')[1].split('.')[0],
                }));
                res.status(200).json(formattedLogs);
            } else {
                res.status(404).json({error: "No logs found"});
            }
        } catch (error) {
            console.error("Error fetching logs:", error);
            res.status(500).json({error: error.message});
        }
    }
    
    

    async updateLog(req, res) {
        const {id} = req.params;
        const {endTime} = req.query;
        try {
            if (!endTime) {
                return res.status(400).json({error: "endTime is required"});
            }
    
            const updatedLog = await logService.updateLog(id, new Date(endTime));
            res.status(200).json(updatedLog);
        } catch (error) {
            console.error("Update error:", error);
    
            if (error.message === "Log not found") {
                return res.status(404).json({error: error.message});
            }
    
            res.status(500).json({error: error.message});
        }
    }
    
    

}

module.exports = new LogController();
