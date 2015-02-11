var empApp = empApp || {};

empApp.uidom = empApp.uidom || {};

empApp.uidom.drawPhoto = function (canvasId, img, width, height){
    var canvas = document.getElementById(canvasId);
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    var x = 0;
    var y = 0;

    if (img.width < width) {
        x = (width - img.width) / 2;
        width = img.width;
    }

    if (img.height < height) {
        y = (height - img.height) / 2;
        height = img.height;
    }

    context.drawImage(img, x, y, width, height);
}