var Venn = function(x, y, r){
	this.shaded=[false, false, false, false, false, false, false];
	this.marked=[false, false, false, false, false, false, false, false, false, false];
	

	this.params = Venn.params;
	this.params.r = r;
	this.params.c1.x = x+r;
	this.params.c1.y = y+r;
	this.params.c2.x = x+2*r;
	this.params.c2.y = y+r;
	this.params.c3.x = x+1.5*r;
	this.params.c3.y = y+2*r;

	this.drawVenn();
	canvas.addEventListener('click', this.processClick.bind(this), false)
}

//coordinates for circles and angles of intersection
Venn.params={
	r: 64,
	c1: {
		x: 128,
		y: 128,
		c21: 5*Math.PI/3,
		c22: Math.PI/3,
		c31: 2*Math.PI/3,
		c32: Math.PI/24
	},
	c2: {
		x: 192,
		y: 128,
		c11: 4*Math.PI/3,
		c12: 2*Math.PI/3,
		c31: 23*Math.PI/24,
		c32: Math.PI/3
	},
	c3: {
		x: 160,
		y: 192,
		c11: 25*Math.PI/24,
		c12: 5*Math.PI/3,
		c21: 4*Math.PI/3,
		c22: 47*Math.PI/24
	}
};

Venn.prototype.getShaded = function(){
	return this.shaded;
}

Venn.prototype.getMarked = function(){
	return this.marked;
}

//draw outlines of Venn diagram circles
Venn.prototype.drawVenn = function(){
	this.drawCircle("c1");
	this.drawCircle("c2");
	this.drawCircle("c3");
};

//draw a specific circle
//circle: (string) name of circle to show ie "c1"
//return: nothing
Venn.prototype.drawCircle = function(circle){
	var r = this.params.r;
	var circ = this.params[circle];
	ctx.beginPath();
	ctx.arc(circ.x,circ.y,r,0,2*Math.PI);
	ctx.stroke();
}

Venn.prototype.processClick = function(e){
	var totalOffsetX = 0;
    var totalOffsetY = 0;
    var currentElement = canvas;
    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

	var x = e.pageX-totalOffsetX;
    var y = e.pageY-totalOffsetY;

    var cell = this.findCell(x, y);
    this.toggleShading(cell);
    // this.mark(cell, "#0000FF");
}

//switches the shading of the specified cell
//cell: (int from 0-6) cell to be toggled
//return: nothing
Venn.prototype.toggleShading = function(cell){
	if(cell < 0 || cell >6){
		return;
	}
    if(this.shaded[cell]){
    	this.clear(cell);
    } else{
    	this.shade(cell);
    }
}

//shades the specified cell
//cell: (int from 0-6) cell to be shaded
//return: nothing
Venn.prototype.shade = function(cell){
	this.shaded[cell] = true;
	this.fill(cell, "#FF0000");
}

//clears the specified cell
//cell: (int from 0-6) cell to be cleared
//return: nothing
Venn.prototype.clear = function(cell){
	this.shaded[cell] = false;
	this.fill(cell, "#FFFFFF");
}

//determines whether a value is in the given circle
//x: (int) x coordinate of click, y: (int) y coordinate of click, circ: (string) circle name
//return: (boolean) if the point is in the circle
Venn.prototype.inCircle = function(x, y, circ){
	var circle = this.params[circ];
	var distFromCenter = Math.sqrt(Math.pow(x-circle.x,2) + Math.pow(y-circle.y,2))
	return distFromCenter < this.params.r;
}

//finds the cell that the user clicked in
//x: (int) x coordinate of click, y: (int) y coordinate of click
//return: (int from -1-6) the number of the cell that the user clicked (-1 corresponds to no cell)
Venn.prototype.findCell = function(x, y){
	var c1 = this.inCircle(x, y, "c1");
	var c2 = this.inCircle(x, y, "c2");
	var c3 = this.inCircle(x, y, "c3");
	if(!c1 && !c2 && !c3){return -1;}
	if(c1 && !c2 && !c3){return 0;}
	if(c1 && c2 && !c3){return 1;}
	if(!c1 && c2 && !c3){return 2;}
	if(c1 && !c2 && c3){return 3;}
	if(c1 && c2 && c3){return 4;}
	if(!c1 && c2 && c3){return 5;}
	if(!c1 && !c2 && c3){return 6;}
}

//color the border and mark with an X the given cell
//cell: (integer from 0-6) cell to be marked, color: (string) hex value of color for border
//return: nothign
Venn.prototype.mark = function(cell, color){
	ctx.strokeStyle = color;
	this.trace(cell);
	ctx.stroke();
	console.log(cell);
}

//fill in the given cell
//cell: (integer from 0-6) cell to be colored, color: (string) hex value of color for fill
//return: nothing
Venn.prototype.fill = function(cell, color){
	ctx.fillStyle=color;
	ctx.strokeStyle="#000000";
	this.trace(cell);
	ctx.fill();
	ctx.stroke();
}

//ctx traces path around the given cell
//cell: (integer from 0-6) cell to be traced around
//return: nothing
Venn.prototype.trace = function(cell){
	ctx.beginPath();
	
	switch(cell){
		case 0:
			this.arc("c1","c31","c21",false);
			this.arc("c2","c11","c31",true);
			this.arc("c3","c21","c11",true);
			break;
		case 1:
			this.arc("c2","c31","c11",false);
			this.arc("c1","c21","c32",false);
			this.arc("c3","c12","c21",true);
			break;
		case 2:
			this.arc("c2","c11","c32",false);
			this.arc("c3","c22","c12",true);
			this.arc("c1","c32","c21",true);
			break;
		case 3:
			this.arc("c3","c11","c21",false);
			this.arc("c2","c31","c12",true);
			this.arc("c1","c22","c31",false);
			break;
		case 4:
			this.arc("c3","c21","c12",false);
			this.arc("c1","c32","c22",false);
			this.arc("c2","c12","c31",false);
			break;
		case 5:
			this.arc("c1","c22","c32",true);
			this.arc("c3","c12","c22",false);
			this.arc("c2","c32","c12",false);
			break;
		case 6:
			this.arc("c1","c31","c22",true);
			this.arc("c2","c12","c32",true);
			this.arc("c3","c22","c11",false);
			break;
	}
}

//draw arc
//circ: (string) of circle name, start/end: (string) points of intersection, cc: (boolean) counterclockwise
//return: nothing
Venn.prototype.arc = function(circ, start, end, cc){
	var circle = this.params[circ];
	ctx.arc(circle.x, circle.y, this.params.r, circle[start], circle[end], cc);
}