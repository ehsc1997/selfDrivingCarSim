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

        // Draw left side of the road
        ctx.beginPath();
        ctx.moveTo(this.left, this.top);
        ctx.lineTo(this.left, this.bottom);
        ctx.stroke();

        // Draw right side of the road
        ctx.beginPath();
        ctx.moveTo(this.right, this.top);
        ctx.lineTo(this.right, this.bottom);
        ctx.stroke();
    }

}