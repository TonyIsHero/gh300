const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('public/docs/examquestions.pdf');

pdf(dataBuffer).then(function(data) {
    console.log(data.text.substring(0, 2000)); // Log the first 2000 characters
});
