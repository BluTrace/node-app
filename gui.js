var http = require('http'),
    csv = require('csv'),
    express = require('express');

var app = express();

app.use(express.static(__dirname));

app.get('/destinations', function(req, res){
    dumpToCSV(req.param('destinations'),"destinations.csv");
    res.send('Done');
});

app.get('/connectivity', function(req, res){
    dumpToCSV(req.param('connectivity'),"beacon_connectivity.csv");
    res.send('Done');
});

app.get('/import_nodes', function(req, res){
    var balls = [];
    csv()
        .from.path('./calibration.csv', { comment: '#', delimiter: ',', escape: '"' })
        .to.array(function(data){
            data.forEach(function(row){
                balls.push([row[1],row[2],row[3],row[4]]);
            });
            console.log(balls);
            res.send(balls);
        });

});

app.listen(1337);
console.log('Listening on port 1337');

var dumpToCSV = function(data, filename) {
    csv().from(data).to(filename);
};