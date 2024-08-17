const { Worker } = require('worker_threads');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // The folder where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('filePath'); // Use 'filePath' if that is the field name

let workerController = {};

workerController.processFile = (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            return res.status(500).json({
                status: false,
                data: err,
                message: "Error uploading file",
            });
        }

        try {
            const filePath = req.file.path;

            const worker = new Worker('./API/workers/csvWorker.js', {
                workerData: {
                    filePath: filePath
                }
            });

            worker.on('message', (message) => {
                if (message.status === 'success') {
                    fs.unlinkSync(filePath);

                    return res.status(200).json({
                        status: true,
                        message: "File processed successfully",
                    });
                } else {
                    fs.unlinkSync(filePath);

                    return res.status(500).json({
                        status: false,
                        data: message.error,
                        message: "Error processing file",
                    });
                }
            });

            worker.on('error', (error) => {
                console.error("Worker thread error:", error);
                fs.unlinkSync(filePath);
                return res.status(500).json({
                    status: false,
                    data: error,
                    message: "Worker thread error",
                });
            });

            worker.on('exit', (code) => {
                if (code !== 0) {
                    console.error(`Worker stopped with exit code ${code}`);
                }
            });

        } catch (error) {
            return res.status(500).json({
                status: false,
                data: error,
                message: "Error processing file",
            });
        }
    });
};

module.exports = workerController;
