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
        destination_csv = document.getElementById('destinations-csv'),
        connectivity_csv = document.getElementById('connectivity-csv'),
        nodes = [],
        edges = [],
        edge_weight = 1,
        mouse = captureMouse(canvas);

    function generateDestinationCSV() {
        var destinations = "";
        for(var i in nodes){
            destinations += nodes[i].mac + "\n";
        }
        destination_csv.innerHTML = destinations;
        $.get( "destinations", { destinations: destinations } );

    }

    function generateConnectivityCSV() {
        var connectivity = "";
        for(var i in nodes){
            connectivity += nodes[i].mac;
            for(var j in edges){
                if(edges[j][0].mac == nodes[i].mac){
                    connectivity += "," + edges[j][1].mac + "," + edge_weight;
                }
            }
            connectivity += "\n";
        }
        connectivity_csv.innerHTML = connectivity;
        $.get( "connectivity", { connectivity: connectivity } );
    }

    function importNodesFromCSV() {
        console.log(nodes);
        console.log(edges);
        var myFile = new File('calibration.csv');
    }

    generate_destination_csv.addEventListener('click', generateDestinationCSV, false);
    generate_connectivity_csv.addEventListener('click', generateConnectivityCSV, false);
    import_node.addEventListener('click', importNodesFromCSV, false)

    new State("NoState",canvas,put_points,put_edges,current_msg,information,edges_info,mouse, nodes, edges).action();
}