class Road{
    constructor(x, width, laneCount=3) {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left = x - width/2
        this.right = x + width/2

        const infinity = 10000000000;
        this.top = -infinity;
        this.bottom = infinity;
    }

    draw(ctx) {
        // Establish attributes of the road
        ctx.lineWidth = 8;
        ctx.strokeStyle = "white";

        for (let i=0; i <= this.laneCount; i++) {
            // Calculate where to draw lane line 
            // (according to number of lanes)
            const x = interpolation(
                this.left,
                this.right,
                i/this.laneCount
            )
            // Draw lane line
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }
    }

}

