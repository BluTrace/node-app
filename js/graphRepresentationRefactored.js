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
        $.get( "import_nodes", function(resp) {
            console.log(resp);
            for(var i in resp){
                makeImportedNode(resp[i][2],resp[i][3],resp[i][1],resp[i][0]);
            }
        });
    }

    function makeImportedNode(x,y,name,mac){
        var context = canvas.getContext('2d');
        var node = new Ball(10,"#ff0000",nodes.length);
        centralize(node,canvas);
        node.x = x;
        node.y = y;
        node.name = name;
        node.mac = mac;
        nodes.push(node);
        node.draw(context);
        console.log(node);

        var nodeDiv = document.createElement('div');
        nodeDiv.setAttribute('id', node.name);
        nodeDiv.innerHTML = "Point " + (nodes.length -1 )  + " located at (" + node.x  + "," + node.y + ")" +  " : ";
        var nodeName = document.createElement('input');
        nodeName.setAttribute('name', "name");
        nodeName.setAttribute('value', node.name);
        nodeDiv.appendChild(nodeName);
        var nodeMac = document.createElement('input');
        nodeMac.setAttribute('name', "mac");
        nodeMac.setAttribute('value', node.mac);
        nodeDiv.appendChild(nodeMac);

        information.appendChild(nodeDiv);
    }

    generate_destination_csv.addEventListener('click', generateDestinationCSV, false);
    generate_connectivity_csv.addEventListener('click', generateConnectivityCSV, false);
    import_node.addEventListener('click', importNodesFromCSV, false)

    var state = new State("NoState",canvas,put_points,put_edges,current_msg,information,edges_info,mouse, nodes, edges).action();
}