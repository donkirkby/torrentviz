function Node(name) {
    this.name = name;
    this.lineWidth = 10;
    this.sendTime = 20;
    this.left = 0;
    
    this.setPieceCount = function(pieceCount) {
        this.pieceCount = pieceCount;
        this.bottom = this.pieceCount*this.sendTime;
    }
    
    this.setPieceCount(3);
}

/**
 * A transmission of a piece of the file from one node to another.
 * @param sender - the node that sends the piece, or null if the receiver starts
 *          with a copy of this piece. 
 * @param receiver - the node that receives the piece of the file.
 * @param pieceNum - index of the piece to send.
 * @param startTime - when the transmission begins.
 */
function Transmission(sender, receiver, pieceNum, startTime) {
    this.sender = sender;
    this.receiver = receiver;
    this.pieceNum = pieceNum;
    this.startTime = startTime;
    this.offsetX = 20;
    this.offsetY = 20;
    this.transmissionTime = 20;
    this.outlineShade = (256/receiver.pieceCount) & 255;
    this.outlineColour = "rgb(" + [this.outlineShade-1, 
                                   this.outlineShade-1, 
                                   this.outlineShade-1].join() + ")";
    this.outlineColour = "black";
    this.shade = ((1+pieceNum) * this.outlineShade - 1) & 255;
    this.colour = "rgb(" + [this.shade, this.shade, this.shade].join() + ")";
    
    this.draw = function(canvas) {
        var receiverX = (
                this.receiver.left 
                + this.pieceNum * this.receiver.lineWidth 
                + this.offsetX);
        var lineData = {
                strokeStyle : this.outlineColour,
                strokeWidth : this.receiver.lineWidth,
                rounded : true,
                pointCount : 0,
                addPoint : function(x, y) {
                    this.pointCount++;
                    this['x' + this.pointCount] = x;
                    this['y' + this.pointCount] = y;
                }
        }
        if (sender == null) {
            lineData.addPoint(receiverX, startTime + this.offsetY);
        } else {
            var senderX = (
                    sender.left 
                    + pieceNum * sender.lineWidth
                    + this.offsetX);
            var endTime = startTime + this.transmissionTime;
            lineData.addPoint(senderX, startTime + this.offsetY);
            lineData.addPoint(receiverX, endTime + this.offsetY);
        }
        lineData.addPoint(receiverX, receiver.bottom + this.offsetY);
        canvas.drawLine(lineData);
        lineData.strokeWidth -= 2;
        lineData.strokeStyle = this.colour;
        canvas.drawLine(lineData);
    }
}



$(function() {
    $( "#slider" ).slider({
        max : 10,
        value : 3,
        slide: function( event, ui ) {
            seed.setPieceCount(ui.value);
            peer.setPieceCount(ui.value);
            transmissions = createTransmissions(ui.value);
            canvas.clearCanvas();
            drawTransmissions(transmissions);
        }
    });
  });
var canvas = $("canvas");
var seed = new Node("seed");
var peer = new Node("peer");
peer.left = 150;
function createTransmissions(pieceCount) {
    var transmissions = [];
    for (var i = 0; i < pieceCount; i++) {
        transmissions.push(new Transmission(null, seed, i, 0));
    }
    for (var i = 0; i < pieceCount; i++) {
        transmissions.push(new Transmission(seed, peer, i, 20*i));
    }
    
    return transmissions;
}

function drawTransmissions(transmissions) {
    for ( var i in transmissions) {
        var transmission = transmissions[i];
        transmission.draw(canvas);
    }
}

var transmissions = createTransmissions(3);
drawTransmissions(transmissions);
