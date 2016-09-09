import {EndPoint} from '../viewer2d'

/** @constructor */
function AddSegmentTool(viewer, multi) {
  this.viewer = viewer;
  this.line = null;
  this.multi = multi;
}

AddSegmentTool.prototype.mousemove = function(e) {
  var p = this.viewer.screenToModel(e);
  if (this.line != null) {
    this.viewer.snap(p.x, p.y, [this.line.a, this.line.b]);
    this.line.b.x = p.x;
    this.line.b.y = p.y;
    this.viewer.refresh();
  } else {
    this.viewer.snap(p.x, p.y, []);
    this.viewer.refresh();
  }
};

AddSegmentTool.prototype.cleanup = function(e) {
  this.viewer.cleanSnap();
  this.line = null;
};

AddSegmentTool.prototype.mousedown = function(e) {
  
};

AddSegmentTool.prototype.mouseup = function(e) {
  if (this.line == null) {
    const b = this.viewer.screenToModel(e);
    var a = b;
    var needSnap = false;
    if (this.viewer.snapped.length != 0) {
      a = this.viewer.snapped.pop();
      this.viewer.cleanSnap();
      needSnap = true;
    }
    this.line = this.viewer.addSegment(a.x, a.y, b.x, b.y, this.viewer.activeLayer);
    if (needSnap) {
      this.viewer.parametricManager.linkObjects([this.line.a, a]);
    }
    this.viewer.refresh();
  } else {
    if (this.viewer.snapped.length != 0) {
      var p = this.viewer.snapped.pop();
      this.viewer.cleanSnap();
      this.line.b.x = p.x;
      this.line.b.y = p.y;
      this.viewer.parametricManager.linkObjects([this.line.b, p]);
      this.viewer.refresh();
    }
    if (this.multi) {
      const b = this.line.b; 
      this.line = this.viewer.addSegment(b.x, b.y, b.x, b.y, this.viewer.activeLayer);
      this.viewer.parametricManager.linkObjects([this.line.a, b]);
    } else {
      this.line = null;
    }
  }
};

AddSegmentTool.prototype.dblclick = function(e) {
  this.cancelSegment();
};

AddSegmentTool.prototype.mousewheel = function(e) {
};

AddSegmentTool.prototype.keydown = function(e) {
  if (e.keyCode == 27) {
    this.cancelSegment();
  }
};

AddSegmentTool.prototype.cancelSegment = function() {
  if (this.multi && this.line != null) {
    this.viewer.remove(this.line);
    this.viewer.refresh();
    this.cleanup(null);
  }
};

AddSegmentTool.prototype.keypress = function(e) {};
AddSegmentTool.prototype.keyup = function(e) {};

/** @constructor */
function AddPointTool(viewer) {
  this.viewer = viewer;
}

AddPointTool.prototype.mousemove = function(e) {
};

AddPointTool.prototype.cleanup = function(e) {
};

AddPointTool.prototype.mousedown = function(e) {
};

AddPointTool.prototype.mouseup = function(e) {
  this.viewer.historyManager.checkpoint();
  var a = this.viewer.screenToModel(e);
  var p = new EndPoint(a.x, a.y);
  var layer = this.viewer.activeLayer;
  layer.objects.push(p);
  p.layer = layer;
  this.viewer.refresh();
};

AddPointTool.prototype.mousewheel = function(e) {
};

AddPointTool.prototype.keydown = function(e) {
};

AddSegmentTool.prototype.keypress = function(e) {};
AddSegmentTool.prototype.keyup = function(e) {};

export {AddSegmentTool, AddPointTool}