class Car {
    constructor(x, y, width, height) {
        // Positional attributes
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        // Speed attributes
        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = 3;

        // Turning attributes
        this.angle = 0;

        // Frictional attributes
        this.friction = 0.05;

        // Car controls with event listeners
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
        
        // Turning mechanics
        if (this.controls.right) {
            this.angle += 0.03; // negative due to y = 0 being at the top of the page
        }

        if (this.controls.left) {
            this.angle -= 0.03; // positive due to y = 0 being at the top of the page
        }

        // Update position depending on the speed and angle (basic trig, unit circle with 0 at the top)
        this.x -= Math.sin(-this.angle)*this.speed;
        this.y -= Math.cos(-this.angle)*this.speed;
    }

    draw(ctx) {
        // Save context as is to avoid jittering during translation
        ctx.save();

        // Implement forward/backward movement and rotation
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        // Draw out the car rectangle
        ctx.beginPath();
        ctx.rect(
            -this.width/2,
            -this.height/2,
            this.width,
            this.height
        );
        ctx.fill();
        
        // This, alongside save, will supposedly prevent jitters
        ctx.restore();
    }
}