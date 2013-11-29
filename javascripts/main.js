MAX_PIECES = 10;
MAX_SEEDS = 3;
MAX_PEERS = 3;
var seedCount = 1;
var peerCount = 2;
var pieceCount = 3;

function Node(name) {
    this.name = name;
    this.lineWidth = 10;
    this.sendTime = 20;
    this.left = 0;
    this.bottom = MAX_PIECES*this.sendTime;
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
    this.outlineShade = (256/pieceCount) & 255;
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
    $( "#seed-slider" ).slider({
        min : 1,
        max : MAX_SEEDS,
        value : seedCount,
        slide: function( event, ui ) {
            seedCount = ui.value;
            createNodes();
            transmissions = createTransmissions();
            canvas.clearCanvas();
            drawTransmissions(transmissions);
        }
    });
  });
$(function() {
    $( "#peer-slider" ).slider({
        min : 1,
        max : MAX_PEERS,
        value : 2,
        slide: function( event, ui ) {
            peerCount = ui.value;
            createNodes();
            transmissions = createTransmissions();
            canvas.clearCanvas();
            drawTransmissions(transmissions);
        }
    });
  });
$(function() {
    $( "#piece-slider" ).slider({
        min : 1,
        max : MAX_PIECES,
        value : 3,
        slide: function( event, ui ) {
            pieceCount = ui.value;
            transmissions = createTransmissions();
            canvas.clearCanvas();
            drawTransmissions(transmissions);
        }
    });
  });

nodes = [];
seeds = [];
peers = [];
function createNodes() {
    nodes = [];
    seeds = [];
    peers = [];
    for (var i = 0; i < seedCount; i++) {
        seed = new Node('Seed ' + (i+1));
        seed.left = i*seed.lineWidth * (MAX_PIECES + 2);
        nodes.push(seed);
        seeds.push(seed);
    }
    for (var i = 0; i < peerCount; i++) {
        peer = new Node('Peer ' + (i+1));
        peer.left = nodes.length*peer.lineWidth * (MAX_PIECES + 2);
        nodes.push(peer);
        peers.push(peer);
    }
}

var canvas = $("canvas");
function createTransmissions() {
    var transmissions = [];
    for (var i in seeds) {
        var seed = seeds[i];
        for (var i = 0; i < pieceCount; i++) {
            transmissions.push(new Transmission(null, seed, i, 0));
        }
    }
    for (var i in peers) {
        var peer = peers[i];
        for (var i = 0; i < pieceCount; i++) {
            transmissions.push(new Transmission(seed, peer, i, 20*i));
        }
    }
    
    return transmissions;
}

function drawTransmissions(transmissions) {
    for ( var i in transmissions) {
        var transmission = transmissions[i];
        transmission.draw(canvas);
    }
}

createNodes();
var transmissions = createTransmissions(3);
drawTransmissions(transmissions);
