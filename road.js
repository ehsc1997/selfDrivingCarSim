class Road{
    constructor(x, width, laneCount=3) {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        this.left = x - width/2
        this.right = x + width/2

        const infinity = 100000;
        this.top = -infinity;
        this.bottom = infinity;
    }

    getLaneCenter(laneIndex) {
        const laneWidth = this.width/this.laneCount;
        return this.left + laneWidth/2 + laneIndex*laneWidth;
    }

    draw(ctx) {
        // Establish attributes of the road
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";
        
        for (let i = 0; i <= this.laneCount; i++) {
            // Calculate where to draw lane line 
            // (according to number of lanes)
            const x = interpolation(
                this.left,
                this.right,
                i/this.laneCount
            );
            
            // Establish dotted and none dotted lanes
            if (i > 0 && i < this.laneCount) {
                ctx.setLineDash([20,20]);
            } else {
                ctx.setLineDash([]);
            }
            
            // Draw lane lines
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }
    }

}

