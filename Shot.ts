import { Point3d, Vector3d } from "./_geometry-3d";

export class Shot {
    position: Point3d;
    direction: Vector3d;

    constructor(position0: Point3d, direction0: Vector3d) {
        this.position = position0;
        this.direction = direction0;
    }
}
