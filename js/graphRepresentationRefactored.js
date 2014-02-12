window.onload = function(){


    var canvas = document.getElementById('canvas'),
        put_points = document.getElementById('put-points'),
        put_edges = document.getElementById('put-edges'),
        information = document.getElementById('information'),
        edges_info = document.getElementById('edges'),
        current_msg = document.getElementById('current-msg'),
        generate_connectivity_csv = document.getElementById('generate-connectivity-csv'),
        generate_destination_csv = document.getElementById('generate-destination-csv'),
        import_node = document.getElementById('import-nodes'),
        mouse = captureMouse(canvas);

    var edge_cost = 1;

    function generateDestinationCSV() {
        var edges = edges_info.innerHTML.split(' ');
        var csv = "data:text/csv;charset=utf-8,";
        edges.pop(); //removing the last space
        edges.reduce(function(prev,cur){
            curs = cur.substr(1,cur.length -2).split(',');
            var mac0 = document.getElementById("point_" + curs[0]).value;
            var mac1 = document.getElementById("point_" + curs[1]).value;
            csv += mac0 + "," + mac1 + "," + edge_cost + "\n" ;
        }, csv);
        console.log(csv);
        var encodedUri = encodeURI(csv);
        window.open(encodedUri);
        }

    function importNodesFromCSV() {
        
    }

    generate_destination_csv.addEventListener('click', generateDestinationCSV, false);
    import_node.addEventListener('click', importNodesFromCSV, false)

    new State("NoState",canvas,put_points,put_edges,current_msg,information,edges_info,mouse).action();
}