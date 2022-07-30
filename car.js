class Car {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = 3;
        this.friction = 0.05;

        this.controls = new Controls()
    }

    update() {

        // Accelerate or decelerate
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }

        // Cap speed with the value of maxSpeed
        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }

        // Cap breaking/ reverse speed with the value of maxSpeed (note, -ve speed is reverse)
        if (this.speed < -this.maxSpeed) {
            this.speed = -this.maxSpeed
        }

        // Apply some basic friction physics
        if (this.speed > 0) {
            this.speed -= this.friction;
        }
        if (this.speed < 0) {
            this.speed += this.friction;
        }

        // To catch friction edge case
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }
        
        // Lateral movement mechanics (TODO: turning mechanics)
        if (this.controls.right) {
            this.x += 2;
        }

        if (this.controls.left) {
            this.x -= 2;
        }

        // Update position depending on the speed
        this.y -= this.speed;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.rect(
            this.x-this.width/2,
            this.y-this.height/2,
            this.width,
            this.height
        );
        ctx.fill();
    }
}