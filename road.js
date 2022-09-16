class Road{
    constructor(x, width, laneCount=3) {

        // Road center, width of lines, number of lanes
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        // Left and right road lines
        this.left = x - width/2
        this.right = x + width/2

        // Stretch road far up and far down the screen
        const infinity = 100000;
        this.top = -infinity;
        this.bottom = infinity;

        // Corners of the road in this straight line scenario
        // TODO: Change the below for complex road types
        const topLeft = {
            x: this.left,
            y: this.top
        };
        const topRight = {
            x: this.right,
            y: this.top
        };
        const bottomLeft = {
            x: this.left,
            y: this.bottom
        };
        const bottomRight = {
            x: this.right,
            y: this.bottom
        };

        // Borders of the road, in array form for flexibility for complex road types
        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ];
    }

    getLaneCenter(laneIndex) {
        const laneWidth = this.width/this.laneCount;
        return this.left + laneWidth/2 + laneIndex*laneWidth;
    }

    draw(ctx) {
        // Establish attributes of the road
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";
        
        for (let i = 1; i <= this.laneCount -1; i++) {
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

        ctx.setLineDash([]);
        this.borders.forEach(border=>{
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        });
    }

}

