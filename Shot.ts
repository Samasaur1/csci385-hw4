import { Point3d, Vector3d } from "./_geometry-3d";

export class Shot {
    position: Point3d;
    direction: Vector3d;

    constructor(position0: Point3d, direction0: Vector3d) {
        this.position = position0;
        this.direction = direction0;
    }

    combo(scalar: number, other: Shot): Shot {
        const newPosition = this.position.combo(scalar, other.position);

        // I don't even need to scale this, since only the direction matters
        const newDirection = this.direction.plus(other.direction).div(2);

        return new Shot(newPosition, newDirection);
    }
}
