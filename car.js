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
        this.controls = new Controls();
        this.sensor = new Sensor(this);
    }

    update(roadBorders) {
        this.#move();
        this.polygon = this.#createPolygon()
        this.sensor.update(roadBorders);
    }

    #createPolygon(){
        const points = [];
        const rad = Math.hypot(this.width, this.height)/2;
        const alpha = Math.atan2(this.width, this.height)
        points.push({
            x: this.x-Math.sin(this.angle-alpha)*rad,
            y: this.y-Math.cos(this.angle-alpha)*rad
        });
        points.push({
            x: this.x-Math.sin(this.angle+alpha)*rad,
            y: this.y-Math.cos(this.angle+alpha)*rad
        });
        points.push({
            x: this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y: this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        });
        points.push({
            x: this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y: this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        });
        
        return points;
    }

    #move() {
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
        if (this.speed != 0) {
            // flip direction of turning when reversing to maintain consistency with steering input
            const flip = this.speed > 0 ? 1: -1; 

            if (this.controls.right) {
                this.angle -= 0.03*flip; // negative due to y = 0 being at the top of the page
            }

            if (this.controls.left) {
                this.angle += 0.03*flip; // positive due to y = 0 being at the top of the page
            }
        }

        // Update position depending on the speed and angle (basic trig, unit circle with 0 at the top)
        this.x -= Math.sin(this.angle)*this.speed;
        this.y -= Math.cos(this.angle)*this.speed;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for(let i=1; i<this.polygon.length; i++){
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();

        this.sensor.draw(ctx);
    }
}