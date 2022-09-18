class Car {
    constructor(x, y, width, height, controlType, maxSpeed=3) {
        // Positional attributes
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        // Speed attributes
        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = maxSpeed;

        // Turning attributes
        this.angle = 0;

        // Default damage off
        this.damaged = false;

        // Frictional attributes
        this.friction = 0.05;

        // Car controls with event listeners
        this.controls = new Controls(controlType);

        // Whether the car's brain should be used
        this.useBrain = controlType == "AI";

        // Excludes controls for traffic cars (dummy cars)
        if(controlType != "DUMMY"){
            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork(
                [this.sensor.rayCount, 6, 4]
            );
        }     
    }

    update(roadBorders, traffic) {

        if(!this.damaged){
            this.#move();
            this.polygon = this.#createPolygon()
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }
        if(this.sensor){
            this.sensor.update(roadBorders, traffic);
            const offsets = this.sensor.readings.map(
                s=>s==null?0:1-s.offset
                );
            const outputs = NeuralNetwork.feedForward(offsets, this.brain);
            
            if(this.useBrain){
                this.controls.forward = outputs[0]
                this.controls.left = outputs[1]
                this.controls.right = outputs[2]
                this.controls.reverse = outputs[3]
            }
        }
    }

#assessDamage(roadBorders, traffic){
    for(let i=0; i<roadBorders.length; i++){
        if(polyIntersect(this.polygon, roadBorders[i])){
            return true;
        }
    }
    for(let i=0; i<traffic.length; i++){
        if(polyIntersect(this.polygon, traffic[i].polygon)){
            return true;
        }
    }
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

    draw(ctx, color, drawSensor=false) {
        if(this.damaged){
            ctx.fillStyle = "gray";
        }else{
            ctx.fillStyle = color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for(let i=1; i<this.polygon.length; i++){
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
        if(this.sensor && drawSensor){
            this.sensor.draw(ctx);
        }
    }
}