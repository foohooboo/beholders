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

            // check collisions
            this.game.obstacles.forEach(obstacle => {
            });
        }
    }

    class Obstacle {
        constructor(game){
            this.game = game;
            this.collisionX = Math.random() * this.game.width;
            this.collisionY = Math.random() * this.game.height;
            this.collisionRadius = 40;
            this.image = document.getElementById('obstacles');
            this.spriteWidth = 250;
            this.spriteHeight = 250;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.spriteX = this.collisionX - this.width * 0.5;
            this.spriteY = this.collisionY - this.height * 0.5 - 80;
            this.frameX = Math.floor(Math.random() * 4);
            this.frameY = Math.floor(Math.random() * 3);
        }

        draw(context){
            // draw sprite
            context.drawImage(
                this.image,                                                         // src image
                this.frameX * this.spriteWidth, this.frameY * this.spriteHeight,    // src x/y
                this.spriteWidth, this.spriteHeight,                                // src w/h
                this.spriteX, this.spriteY,                                         // dest x/y
                this.width, this.height                                             // dest w/h
            );
            // draw obstacle circle
            context.beginPath();
            context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
            context.save();
            context.globalAlpha = 0.5;
            context.fill();
            context.restore();
            context.stroke();
        }
    }

    class Game {
        constructor(canvas){
            this.canvas = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.topMargin = 100;
            this.player = new Player(this);
            this.numberOfObstacles = 7;
            this.obstacles = [];
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

        checkCollision(a, b, buffer = 0){
            const dx = a.collisionX - b.collisionX;
            const dy = a.collisionY - b.collisionY;
            const distance = Math.hypot(dy, dx);
            return (distance < a.collisionRadius + b.collisionRadius + buffer);
        }

        render(context){
            this.obstacles.concat(this.player).sort((a, b) => (a.collisionY > b.collisionY) ? 1 : -1).forEach(renderable => {
                renderable.draw(context);
            });
            this.player.update();
        }

        init(){
            let attempts = 0;
            while (this.obstacles.length < this.numberOfObstacles && attempts < 500){
                let testObstacle = new Obstacle(this);
                let overlap = false;
                this.obstacles.forEach(obstacle => {
                    if (this.checkCollision(testObstacle, obstacle, 100)){
                        overlap = true;
                    }
                });
                if (!overlap && 
                    testObstacle.spriteX > 40 && testObstacle.spriteX < this.width - testObstacle.width && 
                    testObstacle.spriteY > this.topMargin && testObstacle.spriteY < this.height){
                    this.obstacles.push(testObstacle);
                }
                attempts++;
            }
        }
    }

    const game = new Game(canvas);
    game.init();
    console.log(game);
    game.render(ctx);

    function animate(){
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        game.render(ctx);
        window.requestAnimationFrame(animate);
    }

    animate();
});