/**
 * Created by Dhruv on 2/8/14.
 */

function Ball (radius, color, text) {
    if (radius === undefined) { radius = 40; }
    if (color === undefined) { color = "#ff0000"; }
    if (text === undefined) { text = ""}
    this.x = 0;
    this.y = 0;
    this.radius = radius;

    this.stressed = function(value,context){
        value ? this.stress(context) : this.draw(context) ;
    }

    this.rotation = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.color = parseColor(color);
    this.lineWidth = 1;
    this.text = text.toString();
    this.textColor = inverse(this.color);
}

Ball.prototype.draw = function (context) {

    function write_label(context, text, radius){
        function decide_context_font_and_location(text) {
            if(text.length <= 1){
                context.font = "bold 16px Arial";
                context.fillText(text,-radius/2, radius/2);
                return;
            }
            if(text.length <= 2){
                context.font = "bold 14px Arail";
                context.fillText(text, -radius/2 -radius/4, radius/2)
                return;
            }
        }
        decide_context_font_and_location(text);
    }

    context.save();
    context.translate(this.x - this.radius/2, this.y - this.radius/2);
    context.rotate(this.rotation);
    context.scale(this.scaleX, this.scaleY);
    context.lineWidth = this.lineWidth;
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(-this.radius/2, -this.radius/2, this.radius, 0, (Math.PI * 2), true);   //x, y, radius, start_angle, end_angle, anti-clockwise
    context.closePath();
    context.fill();
    if (this.lineWidth > 0) {
        context.stroke();
    }
    context.fillStyle = this.textColor;
    context.translate(-this.radius/2, -this.radius/2);
    this.text != "" ? write_label(context, this.text, this.radius) : "";
    context.restore();
};

Ball.prototype.stress = function(context){
    function write_label(context, text, radius){
        function decide_context_font_and_location(text) {
            if(text.length <= 1){
                context.font = "bold 16px Arial";
                context.fillText(text,-radius/2, radius/2);
                return;
            }
            if(text.length <= 2){
                context.font = "bold 14px Arail";
                context.fillText(text, -radius/2 -radius/4, radius/2)
                return;
            }
        }
        decide_context_font_and_location(text);
    }

    context.save();
    context.translate(this.x - this.radius/2, this.y - this.radius/2);
    context.rotate(this.rotation);
    context.scale(this.scaleX, this.scaleY);
    context.lineWidth = this.lineWidth;
    context.fillStyle = "0x00ff00";
    context.beginPath();
    context.arc(-this.radius/2, -this.radius/2, this.radius, 0, (Math.PI * 2), true);   //x, y, radius, start_angle, end_angle, anti-clockwise
    context.closePath();
    context.fill();
    if (this.lineWidth > 0) {
        context.stroke();
    }
    context.fillStyle = this.textColor;
    context.translate(-this.radius/2, -this.radius/2);
    this.text != "" ? write_label(context, this.text, this.radius) : "";
    context.restore();
}

Ball.prototype.getBounds = function() {
    return {
        x: this.x - this.radius,
        y: this.y - this.radius,
        width: this.radius * 2,
        height: this.radius * 2
    };
}

Ball.prototype.addOrRemoveMouseClick = function(canvas,mouse,doOnMouseClick,addOrRemove){
    var ball = this;

    if(!addOrRemove){
        canvas.removeEventListener('click', ball.onBallMouseClick, false);
    }

    ball.onBallMouseClick = function onBallMouseClick(){
        if(containsPoint(ball.getBounds(),mouse.x, mouse.y)){
            doOnMouseClick();
        }
    }

    canvas.addEventListener('click', ball.onBallMouseClick, false);
}

Ball.prototype.addOrRemoveMouseOver = function(canvas,mouse,doOnMouseOverPositive, doOnMouseOverNegative,addOrRemove) {

    var ball = this;

    if(!addOrRemove){
        canvas.removeEventListener('mousemove',ball.onBallMouseOver, false);
        return;
    }

    ball.onBallMouseOver = function onBallMouseOver() {
        if(containsPoint(ball.getBounds(),mouse.x, mouse.y)){
            doOnMouseOverPositive();
        }
        else{
            doOnMouseOverNegative();
        }
    }

    canvas.addEventListener('mousemove', ball.onBallMouseOver, false);

};

