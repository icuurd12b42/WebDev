class Camera {
    constructor(element) {
		//the camera always draws on the viewports center
		console.log(element);
		this.viewport = element; //the element, the canvas
		this.pos = new Vector2D(0, 0); //the position of the camera in the world, usually calculated from anchor and offset
		this.anchor = new Vector2D(0, 0); //the point in the world that the camera moves arround with...
		this.offset = new Vector2D(0, 0); //the offset from the anchor point the camera is located at.
		this.zoomFactor = 1; //the zoom factor of the camera
		this.radius = 0; //the radius of the camera on the world, how much of the world it sees
		this.targetOffset = new Vector2D(0, 0);
		this.updateRadius(); //the radius is based on the canvas radius and zoom factor
		console.log("Camera",this)
    }
  
    //sets the anchor point
    setAnchor(anchor) {
		this.anchor.set(anchor);
		this.updatePos();
    }
  
    //set the offset
    setOffset(offset) {
		this.offset.set(offset);
		this.targetOffset.set(offset);
		this.updatePos();
    }
  
    setZoomFactor(zoomFactor, mousePos) {
		//before zooming set the offset to the mouse distance from anchor
		const mouseWorldPos = this.portToWorldPos(mousePos);
		this.offset = mouseWorldPos.sub(this.anchor);
		//this will make sure whatever was under the mouse will be centered in the viewport
		//after zoom
		//zoom
		this.zoomFactor = zoomFactor;
		this.updateRadius();
		this.updatePos();
		//After zooming add to the offest the vector of the mouse to center viewport
		const fromCanvasCenterVector = Vecc2g.setXY(this.viewport.width/2-mousePos.x,this.viewport.height/2-mousePos.y);
		//in world values
		const fromCanvasCenterWorldVector = this.portToWorldScale(fromCanvasCenterVector)
		//to the offset
		this.offset.add_self(fromCanvasCenterWorldVector);

		this.targetOffset.set(this.offset);

		//so that the point of zoom shift back from center of port to under the mouse
		this.updateRadius();
		this.updatePos();
    }

    sssetZoomFactor(zoomFactor, mousePos) {
		const offsetAsRatio = this.offset.mul(this.zoomFactor);
		const mouseWorldPos = this.portToWorldPos(mousePos);
		const offsetToMouseAsRatio = mouseWorldPos.sub(this.offset).mul(this.zoomFactor);
		this.zoomFactor = zoomFactor;
		this.offset.set(offsetAsRatio.div(this.zoomFactor).add(offsetToMouseAsRatio.div(this.zoomFactor)));
		this.updateRadius();
		this.updatePos();
    }
	sssetZoomFactor(zoomFactor, mousePos) {
		const prevOffsetAsRatio = this.offset.mul(this.zoomFactor);
		const prevWorldMousePos = this.portToWorldPos(mousePos);
		
		this.zoomFactor = zoomFactor;
		this.updateRadius();
	
		const newOffsetAsRatio = prevOffsetAsRatio.div(this.zoomFactor);
		const newWorldMousePos = this.portToWorldPos(mousePos);
		const offsetChange = newWorldMousePos.sub(prevWorldMousePos).mul(this.zoomFactor);
		this.offset.set(newOffsetAsRatio.add(offsetChange));
	
		this.updatePos();
	}

	smoothZoom(camera, event) {
		//remember where we were at this zoom relative to mouse
		const x1 = event.clientX / camera.zoomFactor - camera.offset.x;
		const y1 = event.clientY / camera.zoomFactor - camera.offset.y;
		
		//delta zoom
		const dtz = camera.zoomFactorRequested - camera.zoomFactor;
	
		if (dtz > 0) {
			//we need a different factor zooming in and zooming out, in requires double the value of out
			camera.zoomFactor += (camera.zoomFactorRequested - camera.zoomFactor) / 16;
		} else {
			camera.zoomFactor += (camera.zoomFactorRequested - camera.zoomFactor) / 8;
		}
	
		//check where we are now relative to mouse
		const x2 = event.clientX / camera.zoomFactor - camera.offset.x;
		const y2 = event.clientY / camera.zoomFactor - camera.offset.y;
	
		//and shift the view back to match the mouse position for pixel perfect zoom on point
		camera.offset.x += x2 - x1;
		camera.offset.y += y2 - y1;
		camera.targetOffset.set(camera.offset);
		//update camera position and radius
		camera.updatePos();
		camera.updateRadius();
	}

	//add to the offset
    addOffset(offset) {
		this.offset.add_self(offset);
		this.targetOffset.set(this.offset);
		this.updatePos();
    }

    //calculate the changes
    updatePos() {
		this.pos.setXY(this.anchor.x + this.offset.x, this.anchor.y + this.offset.y);
    }
    //calculate the changes
    updateRadius() {
		const portRadius = Math.hypot(this.viewport.width, this.viewport.height) / 2;
		this.radius = portRadius / this.zoomFactor;
    }

    //convert canvas to world coord
    
	portToWorldPos(coord) {
		const x = coord.x - this.viewport.width / 2;
		const y = coord.y - this.viewport.height / 2;
		const worldX = (x / this.zoomFactor) + this.anchor.x + this.offset.x;
		const worldY = (y / this.zoomFactor) + this.anchor.y + this.offset.y;
		return new Vector2D(worldX, worldY);
	  }
    //convert world coord to canvas coord

    worldToPortPos(coord) {
		const x = (coord.x - this.anchor.x - this.offset.x) * this.zoomFactor + this.viewport.width / 2;
		const y = (coord.y - this.anchor.y - this.offset.y) * this.zoomFactor + this.viewport.height / 2;
		return new Vector2D(x, y);
	}
    portToWorldScale(coord) {
      	return coord.div(this.zoomFactor);
    }
    worldToPortScale(coord) {
      	return coord.mul(this.zoomFactor);
    }
    //translates the canvas according to the camera specs
    setCanvasTransform(ctx) {
		ctx.scale(this.zoomFactor, this.zoomFactor);
		ctx.translate(-this.pos.x + this.viewport.width / (2 * this.zoomFactor), -this.pos.y + this.viewport.height / (2 * this.zoomFactor));
    }
}
  