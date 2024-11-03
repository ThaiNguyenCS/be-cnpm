const logService = require("../services/logService");
const Log = require("../models/Log");
class LogController {
    async createLog(req, res) {
        const { studentID, printerID, filename, numberOfPages } = req.body;
        try {
            // Lấy thời gian hiện tại
            const now = new Date();
            const startPrintTime = now.toISOString();  // Thời gian bắt đầu in
            const createdAt = now.toISOString();  // Thời gian tạo bản ghi
            
            // Cộng thêm 20 phút vào thời gian hiện tại để tính thời gian kết thúc in
            const endPrintTime = new Date(now.getTime() + 20 * 60000).toISOString();  // 20 phút = 20 * 60 * 1000 ms
            const updatedAt = endPrintTime;  // Thời gian cập nhật
            
            // Tạo log mới với các giá trị trên
            const newLog = Log.build({
                studentID,
                printerID,
                filename,
                startPrintTime,
                endPrintTime,
                numberOfPages,
                createdAt,
                updatedAt
            });
            await newLog.save();
            res.status(201).json(newLog);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    

    async getLog(req, res) {
        try {
            console.log("Fetching log for studentID:", req.params.studentID);
            const log = await logService.getLogByStudentId(req.params.studentID);
            console.log("Log found:", log);
            if (log) {
                const formattedLog = {
                    ...log.toJSON(),
                    startPrintDate: log.startPrintTime.toISOString().split('T')[0],
                    startPrintTime: log.startPrintTime.toISOString().split('T')[1].split('.')[0],
                    endPrintDate: log.endPrintTime.toISOString().split('T')[0],
                    endPrintTime: log.endPrintTime.toISOString().split('T')[1].split('.')[0],
                };
                res.status(200).json(formattedLog);
            } else {
                res.status(404).json({ error: "Log not found" });
            }
        } catch (error) {
            console.error("Error fetching log:", error);
            res.status(500).json({ error: error.message });
        }
    }
    

    async updateLog(req, res) {
        const { studentID } = req.params;
        const updates = req.body;

        try {
            const updatedLog = await logService.updateLog(studentID, updates);
            res.status(200).json(updatedLog);
        } catch (error) {
            // Log the error details
            console.error("Update error:", error);

            // Handle not found error
            if (error.message === "Log not found") {
                return res.status(404).json({ error: error.message });
            }

            // Handle other errors
            res.status(500).json({ error: error.message });
        }
    }

}

module.exports = new LogController();
