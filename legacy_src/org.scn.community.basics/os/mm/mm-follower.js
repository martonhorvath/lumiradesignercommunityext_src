define([
        "./mm"
        ]
     , function() {

(function(MM) {

    MM.Follower = function(map, location, content, imageUrl, onClickHandler) {
        this.coord = map.locationCoordinate(location);
        
        this.offset = new MM.Point(0, 0);
        this.dimensions = new MM.Point(200, 110);
        this.margin = new MM.Point(10, 10);
        this.offset = new MM.Point(0, -this.dimensions.y);
    
        var follower = this;
        
        var callback = function(m, a) { return follower.draw(m); };
        map.addCallback('drawn', callback);
        
        this.image = document.createElement('img');
        this.image.style.position = 'absolute';
        this.image.style.width = '28px';
        this.image.style.height = '28px';
        this.image.src = imageUrl;
        
        this.image.style.borderRadius = '3px 3px 3px 3px / 3px 3px 3px 3px';
        this.image.style.border = 'solid 1px #000000 !important';
        
        this.div = document.createElement('div');
        this.div.style.position = 'absolute';
        this.div.style.width = this.dimensions.x + 'px';
        this.div.style.height = this.dimensions.y + 'px';

        var shadow = document.createElement('canvas');
        this.div.appendChild(shadow);
        if (typeof G_vmlCanvasManager !== 'undefined') shadow = G_vmlCanvasManager.initElement(shadow);
        shadow.style.position = 'absolute';
        shadow.style.left = '0px';
        shadow.style.top = '0px';
        shadow.width = this.dimensions.x*2;
        shadow.height = this.dimensions.y;
        var ctx = shadow.getContext("2d");
        ctx.transform(1, 0, -0.5, 0.5, 75, this.dimensions.y/2);
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        this.drawBubblePath(ctx);
        ctx.fill();
    
        var bubble = document.createElement('canvas');
        this.div.appendChild(bubble);
        if (typeof G_vmlCanvasManager !== 'undefined') bubble = G_vmlCanvasManager.initElement(bubble);
        bubble.style.position = 'absolute';
        bubble.style.left = '0px';
        bubble.style.top = '0px';
        bubble.width = this.dimensions.x;
        bubble.height = this.dimensions.y;
        var bubCtx = bubble.getContext('2d');
        bubCtx.strokeStyle = 'black';
        bubCtx.fillStyle = 'white';
        this.drawBubblePath(bubCtx);
        bubCtx.fill();    
        bubCtx.stroke();    
        
        var contentDiv = document.createElement('div');
        contentDiv.style.position = 'absolute';
        contentDiv.style.left = '0px';
        contentDiv.style.top = '0px';
        contentDiv.style.overflow = 'hidden';    
        contentDiv.style.width = (this.dimensions.x - this.margin.x) + 'px';
        contentDiv.style.height = (this.dimensions.y - this.margin.y - 25) + 'px';    
        contentDiv.style.padding = this.margin.y + 'px ' + this.margin.x + 'px ' + this.margin.y + 'px ' + this.margin.x + 'px';
        contentDiv.innerHTML = content;    
        this.div.appendChild(contentDiv);
        
        var that = this;
        
        MM.addEvent(contentDiv, 'mousedown', function(e) {
            if(!e) e = window.event;
            return MM.cancelEvent(e);
        });
        
        MM.addEvent(this.image, 'click', onClickHandler);
        
        MM.addEvent(this.image, 'mouseover', function(e) {
        	that.div.style.display = 'block';
        });

        var hideFunction = function(e) {
        	that.div.style.display = 'none';
        };
        
        MM.addEvent(contentDiv, 'mouseout', hideFunction);
        MM.addEvent(this.image, 'mouseout', hideFunction);
      
        map.parent.appendChild(this.image);
        map.parent.appendChild(this.div);
        
        this.draw(map);
    };
    
    MM.Follower.prototype = {
    
        div: null,
        coord: null,
        
        offset: null,
        dimensions: null,
        margin: null,
    
        draw: function(map) {
            try {
                var point = map.coordinatePoint(this.coord);
            } catch(e) {
                console.error(e);
                // too soon?
                return;
            }
            
            if(point.x + this.dimensions.x + this.offset.x < 0) {
                // too far left
                this.div.style.display = 'none';
                this.image.style.display = 'none';
            
            } else if(point.y + this.dimensions.y + this.offset.y < 0) {
                // too far up
                this.div.style.display = 'none';
                this.image.style.display = 'none';
            
            } else if(point.x + this.offset.x > map.dimensions.x) {
                // too far right
                this.div.style.display = 'none';
                this.image.style.display = 'none';
            
            } else if(point.y + this.offset.y > map.dimensions.y) {
                // too far down
                this.div.style.display = 'none';
                this.image.style.display = 'none';
    
            } else {
            	if(!this._firstDrawDone) {
            		// show div only on first time
            		this.div.style.display = 'block';	
            	}
            	this._firstDrawDone = true;
                
                this.image.style.display = 'block';

                MM.moveElement(this.div, { 
                    x: Math.round(point.x + this.offset.x),
                    y: Math.round(point.y + this.offset.y),
                    scale: 1,
                    width: this.dimensions.x,
                    height: this.dimensions.y
                });
                
                MM.moveElement(this.image, { 
                    x: Math.round(point.x - 14),
                    y: Math.round(point.y - 14),
                    scale: 1
                });
            }
        },
        
        drawBubblePath: function(ctx) {
            ctx.beginPath();
            ctx.moveTo(10, this.dimensions.y);
            ctx.lineTo(35, this.dimensions.y-25);
            ctx.lineTo(this.dimensions.x-10, this.dimensions.y-25); 
            ctx.quadraticCurveTo(this.dimensions.x, this.dimensions.y-25, this.dimensions.x, this.dimensions.y-35);
            ctx.lineTo(this.dimensions.x, 10);
            ctx.quadraticCurveTo(this.dimensions.x, 0, this.dimensions.x-10, 0);
            ctx.lineTo(10, 0);
            ctx.quadraticCurveTo(0, 0, 0, 10);
            ctx.lineTo(0, this.dimensions.y-35);
            ctx.quadraticCurveTo(0, this.dimensions.y-25, 10, this.dimensions.y-25);
            ctx.lineTo(15, this.dimensions.y-25);
            ctx.moveTo(10, this.dimensions.y);
        }
    
    };
    
})(com.modestmaps);

});// End of closure