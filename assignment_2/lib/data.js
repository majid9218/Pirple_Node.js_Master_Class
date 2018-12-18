/*
Application Reading Files Library
*/

//Dependencies
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');
//Lib Obg
const lib = {};
//Lib Base Url
lib.baseUrl = path.join(__dirname, '/../.data/');
//Create file function
lib.create = (dir, file, data, callback) => {
    //Open file for writing / create if not exist
    fs.open(`${lib.baseUrl}${dir}/${file}.json`, 'wx', (err, fd) => {
        if(!err && fd){
            //writing string of data
            const dataStr = JSON.stringify(data);
            fs.writeFile(fd, dataStr, (err) => {
                if(!err){
                    //Close file
                    fs.close(fd, (err) => {
                        if(!err){
                            callback(false);
                        }else{
                            callback('Error in closing the file!')
                        }
                    });
                }else{
                    callback('Error in writing to file!')
                }
            });
        }else{
            callback('Error in opening the file, or file may not exists!')
        }
    });
}
//Read file function
lib.read = (dir, file, callback) => {
    //Reading File
    fs.readFile(`${lib.baseUrl}${dir}/${file}.json`, 'utf8', (err, data) => {
        if(!err && data){
            const dataObj = helpers.parseStringToObject(data);
            callback(false, dataObj);
        }else{
            callback(err, data);
        }
    });
};
//Update file function
lib.update = (dir, file, data, callback) => {
    //Open file if exists
    fs.open(`${lib.baseUrl}${dir}/${file}.json`, 'r+', (err, fd) => {
        if(!err && fd){
            //Truncating file
            fs.ftruncate(fd, (err) => {
                if(!err){
                    //Update string of data
                    const dataStr = JSON.stringify(data);
                    fs.writeFile(fd, dataStr, (err) => {
                        if(!err){
                            //Close file
                            fs.close(fd, (err) => {
                                if(!err){
                                    callback(false);
                                }else{
                                    callback('Error in closing the file!');
                                }
                            });
                        }else{
                            callback('Error in writing to the file!');
                        }
                    });
                }else{
                    callback('Error in truncating the file!');
                }
            });
        }else{
            callback('Error in opening the file, or file may not exists!');
        }
    });
};
//Delete file function
lib.delete = (dir, file, callback) => {
    //Deleting file
    fs.unlink(`${lib.baseUrl}${dir}/${file}.json`, (err) => {
        if(!err){
            callback(false);
        }else{
            callback('Error in deleting the file!');
        }
    });
};
//List files
lib.list = (dir, callback) => {
    fs.readdir(`${lib.baseUrl}${dir}/`, (err, files) => {
        if(!err && files && files.length > 0){
            const trimmedFiles = [];
            files.forEach(file => {
                let trimmed = file.replace('.json', '');
                trimmedFiles.push(trimmed);
            });
            callback(false, trimmedFiles);
        }else{
            callback(err, files);
        }
    });
};
//Read array of files
lib.readArr = (dir, arr, callback) => {
    //Get items data
    const arrOfData = [];
    arr.forEach(item => {
        //Read item data
        lib.read(dir, item, (err, itemData) => {
            if(!err && itemData){
                arrOfData.push(itemData);
                if(arrOfData.length == arr.length){
                    callback(false, arrOfData);
                }
            }else{
                callback('Error in reading one of the menu items data');
            }
        });
    });
};
//Delete array of files
lib.deleteArr = (dir, arr, callback) => {
    //Set number
    let num = 0;
    arr.forEach(item => {
        //Delete item
        lib.delete(dir, item, err => {
            if(!err){
                num ++;
                if(num == arr.length){
                    callback(false);
                }
            }else{
                callback('Error in deleting one of the files!');
            }
        });
    });
}
//Export lib
module.exports = lib;