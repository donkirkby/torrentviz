// Draw a circle on the canvas
var canvas = $("canvas");
var pieceCount = 3;
var lineWidth = 10;
var sendTime = 20;
var bottomY = pieceCount * sendTime;
var outlineShade = (256/pieceCount) & 255;
var outlineColour = "rgb(" + [outlineShade-1, outlineShade-1, outlineShade-1].join() + ")";
for ( var i = 0; i < pieceCount; i++) {
    var senderX = i * lineWidth;
    var receiverX = (pieceCount * 2 + i) * lineWidth;
    var startY = i * sendTime;
    var endY = startY + sendTime;
    var shade = ((1+i) * outlineShade - 1) & 255;
    var colour = "rgb(" + [shade, shade, shade].join() + ")";;
    canvas.drawLine({
        strokeStyle : outlineColour,
        strokeWidth : 10,
        rounded : true,
        x1 : senderX, y1 : 0,
        x2 : senderX, y2 : startY,
        x3 : receiverX, y3 : endY,
        x4 : receiverX, y4 : bottomY
    }).drawLine({
        strokeStyle : colour,
        strokeWidth : 6,
        rounded : true,
        x1 : senderX, y1 : 0,
        x2 : senderX, y2 : startY,
        x3 : receiverX, y3 : endY,
        x4 : receiverX, y4 : bottomY
    });
}
