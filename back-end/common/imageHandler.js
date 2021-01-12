const imageToBase64 = require("image-to-base64");
var fs = require("fs");

// strip off the data: url prefix to get just the base64-encoded bytes
var saveImage = async (img) => {
  return new Promise((resolve, reject) => {
    var ext = img.split(";")[0].match(/jpeg|png|gif/)[0];
    var data = img.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer.from(data, "base64");
    let imagePath = "data/images/" + Date.now()+ "." + ext;
    fs.writeFile(imagePath, buf, err => {
      if (err) reject(err);
      resolve(imagePath);
    });
  });
};


var loadImage = async filepath => {
  return new Promise((resolve, reject) => {
    imageToBase64(filepath) // Path to the image
      .then(res => resolve("data:image/jpeg;base64,"+res))
      .catch(error => reject(error));
  });
};

module.exports = {
  loadImage,
  saveImage
};
