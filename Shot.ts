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
        const newDirection = this.direction.unit().times(scalar).plus(other.direction.unit().times(scalar)).unit();

        return new Shot(newPosition, newDirection);
    }
}
