fps = null;
canvas = null;
ctx = null;

var posX = 0;
var posY = 0;
var velX = 250;
var velY = 250;
var sizeX = 100;
var sizeY = 60;
var gravityY = 900;
var paused = true;

function GameTick(elapsed) {
    fps.update(elapsed);

    InputManager.padUpdate();

    // --- Logic

    if (InputManager.padPressed & InputManager.PAD.CANCEL)
        paused = !paused;

    if (!paused) {
        if ((InputManager.padPressed & InputManager.PAD.OK) && velY >= -10) {
            AudioManager.play("jump");
            velY = -1000;
        }
        // Movement physics

        posX += velX * elapsed;
        posY += (velY + 0.5 * gravityY * elapsed) * elapsed;
        velY += gravityY * elapsed;
        // Collision detection and response
        var bouncedX = false,
            bouncedY = false;
        if ((posX <= 0 && velX < 0) || (posX >= canvas.width - sizeX && velX > 0)) {
            velX = -velX;
            bouncedX = true;
        }
        if ((posY <= 0 && velY < 0) || (posY >= canvas.height - sizeY && velY > 0)) {
            velY = -velY * 0.7;
            bouncedY = true;
        }
        if (bouncedX)
            AudioManager.play("ping");
        if (bouncedY)
            AudioManager.play("bounce");
    }
    // --- Rendering

    // Clear the screen
    ctx.fillStyle = "cyan";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Render objects
    ctx.strokeRect(posX, posY, sizeX, sizeY);
    ctx.fillStyle = "red";
    ctx.fillText("Hello World!", posX + 10, posY + 25);
}

window.onload = function () {
    canvas = document.getElementById("screen");
    ctx = canvas.getContext("2d");
    fps = new FPSMeter("fpsmeter", document.getElementById("fpscontainer"));
    GameLoopManager.run(GameTick);
}