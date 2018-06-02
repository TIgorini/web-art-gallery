var express = require("express")
var app = express()
var fs = require('fs')

var bodyParser = require('body-parser') 
var formidable = require('formidable')

app.use(express.static('static'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.post('/remove', function (req, res){
    var path = __dirname + '/static/' + req.body.src
    fs.unlink(path, function (err) {
        if (err) throw err
        console.log('Image with id: ' + req.body.id + ' removed')
    })
    fs.writeFile('static/images.json', req.body.data, function (err) {
        if (err) throw err
    })
})


app.post('/upload', function (req, res) {
    var form = new formidable.IncomingForm()
    form.parse(req, function (err, fields, files) {
        var oldpath = files.image.path
        var newpath = __dirname + '/static/img/' + files.image.name
        var fileName = files.image.name
        var imageName = fields.image_name

        fs.readFile(oldpath, function (err, data, fname=fileName, iname=imageName) {
            fs.writeFile(newpath, data, function (err, fileName=fname, imageName = iname) {
                if (err) throw err
                console.log('New image uploaded')

                fs.readFile('static/images.json', function (err, data){
                    var images = JSON.parse(data)
                    var max_id = images.data[images.data.length - 1].id
                    var new_image = {
                        'src': 'img/' + fileName, 
                        'name': imageName,
                        'id': max_id + 1
                    }
                    images.data.push(new_image)
                    data = JSON.stringify(images, null, 4)
                    fs.writeFile('static/images.json', data, function (err){
                        if (err) throw err
                    })
                    res.send(new_image)
                })
            });
        });
    })
})


var server = app.listen(8080, function() {
    console.log('Server running at http://127.0.0.1:8080')
});
