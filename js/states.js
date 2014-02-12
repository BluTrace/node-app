function State(name,canvas,put_points,put_edges,current_msg,information,edges_info,mouse, nodes, edges) {

    var context = canvas.getContext('2d');

    function AddEdgeState() {

        function SelectSecondPointState(){

            function drawEdgeAndRedrawNodes(node1,node2){
                clearCanvas(canvas);
                edges.push([node1,node2]);
                edges_info.innerHTML = edges.reduce(function(prev,cur){
                    return prev + "(" + cur[0].text + "," + cur[1].text + ")" + " ";
                }, "")

                function drawEdge(edge) {
                    drawLine(edge[0],edge[1],context);
                }

                edges.forEach(drawEdge);

                function drawNode(node) {
                    node.draw(context);
                }

                nodes.forEach(drawNode);
            }

            var pointA = null;

            var put_points_msg = "Not making nodes";
            var put_edges_msg = "Making edges!";
            var current_msg_msg = "Select a node as an ending point.";

            function initialize_state() {

                pointA.stressed(true, context);

                put_points.innerHTML = put_points_msg;
                put_edges.innerHTML = put_edges_msg;
                put_points.className = "disabled";
                put_edges.className = "enabled";

                current_msg.innerHTML = current_msg_msg;
                add_all_listeners();
            }

            var clean_up_state = function(){
                remove_all_listeners();
                pointA.stressed(false,context);
                current_msg.innerHTML = "";
                console.log("Hope you had a nice time making an edge!")
            };

            var add_edges_state_put_points_listener = function(){
                clean_up_state();
                new PutPointsState().action();
            };

            var add_edges_state_put_edges_listener = function(){
                clean_up_state();
                new NoState().action();
            };

            var addMouseOverListener = function (node) {

                if(node == pointA){return;}

                function doMouseOverPositive() {
                    node.stressed(true, context);
                }
                function doMouseOverNegative() {
                    node.stressed(false, context);
                }
                node.addOrRemoveMouseOver(canvas, mouse, doMouseOverPositive, doMouseOverNegative, true);
            }

            var addMouseClickListener = function(node){

                if(node == pointA){return;}

                function doMouseClick(){
                    clean_up_state();
                    drawEdgeAndRedrawNodes(pointA, node);
                    new AddEdgeState().action();
                }

                node.addOrRemoveMouseClick(canvas, mouse, doMouseClick,true);
            }

            function add_all_listeners(){
                put_points.addEventListener('click', add_edges_state_put_points_listener, false);
                put_edges.addEventListener('click', add_edges_state_put_edges_listener,false);
                nodes.forEach(addMouseOverListener);
                nodes.forEach(addMouseClickListener);
            }

            var removeMouseOverListener = function(node){

                if(node == pointA){return;}

                var dummyDoMouseOverPositive = function(){};
                var dummyDoMouseOverNegative = function(){};

                node.addOrRemoveMouseOver(canvas,mouse,dummyDoMouseOverPositive,dummyDoMouseOverNegative,false);
            }

            var removeMouseClickListener = function(node){

                var dummyDoMouseClick = function(){};

                node.addOrRemoveMouseClick(canvas,mouse,dummyDoMouseClick,false);
            }

            function remove_all_listeners(){
                put_points.removeEventListener('click', add_edges_state_put_points_listener, false);
                put_edges.removeEventListener('click', add_edges_state_put_edges_listener,false);
                nodes.forEach(removeMouseOverListener);
                nodes.forEach(removeMouseClickListener);
            }

            this.action = function(node){
                pointA = node;
                console.log("In Selecting second node state! The edge is almost made!");
                initialize_state();
            }
        }

        function SelectFirstPointState(){

            var put_points_msg = "Not making nodes";
            var put_edges_msg = "Making edges!";
            var current_msg_msg = "Select a node as a starting point.";

            function initialize_state() {
                put_points.innerHTML = put_points_msg;
                put_edges.innerHTML = put_edges_msg;
                put_points.className = "disabled";
                put_edges.className = "enabled";
                current_msg.innerHTML = current_msg_msg;
                add_all_listeners();
            }

            var clean_up_state = function(){
                remove_all_listeners();
                current_msg.innerHTML = "";
                console.log("Leaving Select First Node state..");
            };

            var add_edges_state_put_points_listener = function(){
                clean_up_state();
                new PutPointsState().action();
            };

            var add_edges_state_put_edges_listener = function(){
                clean_up_state();
                new NoState().action();
            };


            var addMouseOverListener = function (node) {
                function doMouseOverPositive() {
                    node.stressed(true, context);
                }
                function doMouseOverNegative() {
                    node.stressed(false, context);
                }
                node.addOrRemoveMouseOver(canvas, mouse, doMouseOverPositive, doMouseOverNegative, true);
            }

            var addMouseClickListener = function(node){
                function doMouseClick(){
                    clean_up_state();
                    new SelectSecondPointState().action(node);
                }

                node.addOrRemoveMouseClick(canvas, mouse, doMouseClick,true);
            }

            var removeMouseOverListener = function(node){

                var dummyDoMouseOverPositive = function(){};
                var dummyDoMouseOverNegative = function(){};

                node.addOrRemoveMouseOver(canvas,mouse,dummyDoMouseOverPositive,dummyDoMouseOverNegative,false);
            }

            var removeMouseClickListener = function(node){

                var dummyDoMouseClick = function(){};

                node.addOrRemoveMouseClick(canvas,mouse,dummyDoMouseClick,false);
            }

            var unstress = function(node){
                node.stressed(false,context);
            }


            function add_all_listeners(){
                put_points.addEventListener('click', add_edges_state_put_points_listener, false);
                put_edges.addEventListener('click', add_edges_state_put_edges_listener,false);
                nodes.forEach(addMouseOverListener);
                nodes.forEach(addMouseClickListener);
            }

            function remove_all_listeners(){
                put_points.removeEventListener('click', add_edges_state_put_points_listener, false);
                put_edges.removeEventListener('click', add_edges_state_put_edges_listener,false);
                nodes.forEach(removeMouseOverListener);
                nodes.forEach(removeMouseClickListener);
                nodes.forEach(unstress);
            }

            this.action = function(){
                console.log("In Selecting First Node state.");
                initialize_state();
            }
        }

        var put_points_msg = "Not making nodes";
        var put_edges_msg = "Making edges!";
        var current_msg_msg = "Need to have more than 2 nodes to form an edge.";

        function initialize_state() {
            put_points.innerHTML = put_points_msg;
            put_edges.innerHTML = put_edges_msg;
            put_points.className = "disabled";
            put_edges.className = "enabled";

            if(nodes.length >= 2){
                clean_up_state();
                new SelectFirstPointState().action();
                return;
            }

            current_msg.innerHTML = current_msg_msg;
            add_all_listeners();
        }

        var clean_up_state = function(){
            remove_all_listeners();
            current_msg.innerHTML = "";
            console.log("Okayy, off to select first node! Hope you had a nice time selecting first node!")
        };

        var add_edges_state_put_points_listener = function(){
            clean_up_state();
            new PutPointsState().action();
        };

        var add_edges_state_put_edges_listener = function(){
            clean_up_state();
            new NoState().action();
        };

        function add_all_listeners(){
            put_points.addEventListener('click', add_edges_state_put_points_listener, false);
            put_edges.addEventListener('click', add_edges_state_put_edges_listener,false);
        }

        function remove_all_listeners(){
            put_points.removeEventListener('click', add_edges_state_put_points_listener, false);
            put_edges.removeEventListener('click', add_edges_state_put_edges_listener,false);
        }

        this.action = function(){
            console.log("In Adding Edges State! Have a nice time adding edges!");
            initialize_state();
        }
    }

    function PutPointsState() {

        var put_points_msg = "Making nodes!";
        var put_edges_msg = "Not making edges";
        var current_msg_msg = "Click on canvas to add points";

        function initialize_state() {
            put_points.innerHTML = put_points_msg;
            put_edges.innerHTML = put_edges_msg;
            put_points.className = "enabled";
            put_edges.className = "disabled";
            current_msg.innerHTML = current_msg_msg;
            add_all_listeners();
        }

        function makeANode(){
            var node = new Ball(10,"#ff0000",nodes.length);
            centralize(node,canvas);
            node.x = mouse.x;
            node.y = mouse.y;
            nodes.push(node);
            node.draw(context);

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

        var clean_up_state = function(){
            remove_all_listeners();
            current_msg.innerHTML = "";
            console.log("Leaving Making Nodes state...");
        };

        var put_points_state_put_points_listener = function(){
            clean_up_state();
            new NoState().action();
        };

        var put_points_state_put_edges_listener = function(){
            clean_up_state();
            new AddEdgeState().action();
        };

        var put_points_state_canvas_click = function(){
            makeANode();
        };

        function add_all_listeners(){
            canvas.addEventListener('click', put_points_state_canvas_click, false);
            put_points.addEventListener('click', put_points_state_put_points_listener, false);
            put_edges.addEventListener('click', put_points_state_put_edges_listener,false);
        }

        function remove_all_listeners(){
            canvas.removeEventListener('click', put_points_state_canvas_click, false);
            put_points.removeEventListener('click', put_points_state_put_points_listener, false);
            put_edges.removeEventListener('click', put_points_state_put_edges_listener,false);
        }

        this.action = function(){
            console.log("In Making Nodes State! Have a nice time adding nodes");
            initialize_state();
        }
    }

    function NoState() {

        var put_points_msg = "Not making nodes";
        var put_edges_msg = "Not making edges";
        var current_msg_msg = "Click something to begin!";

        function initialize_state() {
            put_points.innerHTML = put_points_msg;
            put_edges.innerHTML = put_edges_msg;
            put_points.className = "disabled";
            put_edges.className = "disabled";
            current_msg.innerHTML = current_msg_msg;
            add_all_listeners();
        }

        var clean_up_state = function(){
            remove_all_listeners();
            current_msg.innerHTML = "";
            console.log("Leaving No Action state! Now let's do something!")
        };

        var no_state_state_put_points_listener = function(){
            clean_up_state();
            new PutPointsState().action();
        };

        var no_state_state_put_edges_listener = function(){
            clean_up_state();
            new AddEdgeState().action();
        };

        function add_all_listeners(){
            put_points.addEventListener('click', no_state_state_put_points_listener, false);
            put_edges.addEventListener('click', no_state_state_put_edges_listener,false);
        }

        function remove_all_listeners(){
            put_points.removeEventListener('click', no_state_state_put_points_listener, false);
            put_edges.removeEventListener('click', no_state_state_put_edges_listener,false);
        }

        this.action = function(){
            console.log("In No State!");
            initialize_state();
        }
    }

    if(name == "NoState"){
        return new NoState();
    }

    this.action = function() {
        throw "Called abstract method!";
    }

}