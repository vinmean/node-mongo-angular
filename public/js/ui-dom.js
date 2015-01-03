function drawPhoto(canvasId,img, width, height){
    var canvas = document.getElementById(canvasId);
    var context = canvas.getContext('2d');
    var x = 0;
    var y = 0;
    if (img.width < width) {
        x = (width - img.width) / 2;
    }
    if (img.height < height) {
        y = (height - img.height) / 2;
    }
    context.drawImage(img, x, y, width, height);
}