/**
 * Created by Dhruv on 2/8/14.
 */

if (!window.requestAnimationFrame){
    window.requestAnimationFrame = (window.webkitRequestAnimationFrame ||
                                    window.mozRequestAnimationFrame ||
                                    window.oRequestAnimationFrame ||
                                    window.msRequestAnimationFrame ||
                                    function (callback) {
                                        return window.setTimeout(callback, 1000/60)
                                    });
}

captureMouse = function(element) {
    var mouse = {x: 0, y: 0};

    element.addEventListener('mousemove', function(event){
        var x,y;
        var rect = canvas.getBoundingClientRect();
        if(event.pageX || event.pageY){
            x = event.clientX - rect.left;
            y = event.clientY - rect.top;
        }
        else{
            x = event.clientX + document.body.scrollLeft + document.body.scrollLeft - rect.left;
            y = event.clientY + document.body.scrollTop + document.body.scrollTop - rect.top;
        }
        mouse.x = x;
        mouse.y = y;
//        console.log(mouse);
    }, false);

    return mouse;
}

centralize = function(element,canvas){
    element.x = canvas.width / 2;
    element.y = canvas.height / 2;
}

clearCanvas = function(canvas){
    var context = canvas.getContext('2d');
    context.clearRect(0,0,canvas.width,canvas.height);
}

update_button_class = function(button, state){
    if(state){
        button.className = "enabled";
    }
    else{
        button.className = "disabled";
    }
}

update_button_name = function(button, state, enabled_state_msg, disabled_state_msg){
    if(state){
        button.innerHTML = enabled_state_msg;
    }
    else{
        button.innerHTML = disabled_state_msg;
    }
}

parseColor = function (color, toNumber) {
    if (toNumber === true) {
        if (typeof color === 'number') {
            return (color | 0); //chop off decimal
        }
        if (typeof color === 'string' && color[0] === '#') {
            color = color.slice(1);
        }
        return window.parseInt(color, 16);
    } else {
        if (typeof color === 'number') {
            //make sure our hexadecimal number is padded out
            color = '#' + ('00000' + (color | 0).toString(16)).substr(-6);
        }
        return color;
    }
};

inverse = function (hex) {

    pad = function(num) {
        if (num.length < 2) {
            return "0" + num;
        } else {
            return num;
        }
    }

    if (hex.length != 7 || hex.indexOf('#') != 0) {
        return null;
    }
    var r = (255 - parseInt(hex.substring(1, 3), 16)).toString(16);
    var g = (255 - parseInt(hex.substring(3, 5), 16)).toString(16);
    var b = (255 - parseInt(hex.substring(5, 7), 16)).toString(16);
    var inverse = "#" + pad(r) + pad(g) + pad(b);

    return inverse
}

containsPoint = function(rect, x, y){
    var result = !(x < rect.x || x > rect.x + rect.width || y < rect.y || y > rect.y + rect.height);
    return result;
}

drawLine = function(pointA, pointB, context){
    context.moveTo(pointA.x-pointA.radius/2,pointA.y-pointA.radius/2);
    context.lineTo(pointB.x-pointB.radius/2,pointB.y-pointB.radius/2);
    context.stroke();
}