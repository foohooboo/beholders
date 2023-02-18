window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 1280;
    canvas.height = 720;
    
    ctx.fillStyle = 'white';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'white';

    class Player {
        constructor(game){
            this.game = game;
            this.collisionX = this.game.width * 0.5;
            this.collisionY = this.game.height * 0.6;
            this.collisionRadius = 30;
            this.baseSpeed = 5;
            this.speedX = 0;
            this.speedY = 0;
            this.dx = 0;
            this.dy = 0;
        }

        draw(context){
            // draw player circle
            context.beginPath();
            context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
            context.save();
            context.globalAlpha = 0.5;
            context.fill();
            context.restore();
            context.stroke();

            // draw player movemement trajectory
            context.beginPath();
            context.moveTo(this.collisionX, this.collisionY);
            context.lineTo(this.game.mouse.x, this.game.mouse.y);
            context.stroke();
        }

        update(){
            this.dx = this.game.mouse.x - this.collisionX;
            this.dy = this.game.mouse.y - this.collisionY;
            const distance = Math.hypot(this.dy, this.dx);
            if (distance > this.baseSpeed){
                this.speedX = this.dx / distance || 0;
                this.speedY = this.dy / distance || 0;
                this.collisionX += this.speedX * this.baseSpeed;
                this.collisionY += this.speedY * this.baseSpeed;
            }
        }
    }

    class Game {
        constructor(canvas){
            this.canvas = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.player = new Player(this);
            this.mouse = {
                x: this.width * 0.5,
                y: this.height * 0.5,
                pressed: false
            }

            // event listeners
            this.canvas.addEventListener('mousedown', (e) => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = true;
            });
            this.canvas.addEventListener('mouseup', (e) => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = false;
            });
            this.canvas.addEventListener('mousemove', (e) => {
                if (this.mouse.pressed) {
                    this.mouse.x = e.offsetX;
                    this.mouse.y = e.offsetY;
                }
            });
        }

        render(context){
            this.player.draw(context);
            this.player.update();
        }
    }

    const game = new Game(canvas);
    game.render(ctx);

    function animate(){
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        game.render(ctx);
        window.requestAnimationFrame(animate);
    }

    animate();
});