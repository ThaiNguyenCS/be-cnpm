// Author: THAI
const sequelize = require("../config/mysql.database");
const { PermittedFileType } = require("../models/PermittedFileType");
const { SystemConfig } = require("../models/SystemConfig");

async function getSystemConfig(id) {
    try {
        const response = await SystemConfig.findOne({
            where: {
                id: id,
            },
            include: [
                {
                    model: PermittedFileType,
                    as: "permittedFileTypes",
                    required: true,
                },
            ],
        });
        return { status: "success", data: response };
    } catch (error) {
        console.log(error);
        return { status: "failed", error };
    }
}

async function updateSystemConfig(id, data) {
    const { permittedFileTypes, defaultNoPages, renewDate } = data;
    console.log(data);
    
    const transaction = await sequelize.transaction();
    try {
        await SystemConfig.upsert(
            {
                defaultNoPages: defaultNoPages,
                renewDate: renewDate,
                id: id,
            }
        );


        if (permittedFileTypes && permittedFileTypes.length > 0) { 
            // delete all the old values
            await PermittedFileType.destroy({ 
                where: {
                    configId: id
                }
            })
            // add new values
            permittedFileTypes.map(async (type) => {
                await PermittedFileType.upsert({
                    fileType: type,
                    configId: id,
                });
            });
        }
        await transaction.commit(); // commit the transaction

        const getResponse = await getSystemConfig(id);
        return getResponse;
    } catch (error) {
        console.log(error);
        await transaction.rollback(); // rollback if there's error
        return { status: "failed", error };
    }
}

async function addPermittedFileType(id, data) {
    const { fileType } = data;
    try {
        const response = await PermittedFileType.create({
            configId: id,
            fileType: fileType,
        });
        return { status: "success", data: response };
    } catch (error) {
        console.log(error);
        return { status: "failed", error };
    }
}

async function deletePermittedFileType(id, fileType) {
    try {
        const response = await PermittedFileType.destroy({
            where: {
                configId: id,
                fileType: fileType,
            },
        });
        return { status: "success", data: `Delete ${response} rows successfully` };
    } catch (error) {
        console.log(error);
        return { status: "failed", error };
    }
}

exports.getSystemConfig = getSystemConfig;
exports.updateSystemConfig = updateSystemConfig;
exports.addPermittedFileType = addPermittedFileType;
exports.deletePermittedFileType = deletePermittedFileType;
