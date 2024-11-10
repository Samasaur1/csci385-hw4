import { Point3d, Vector3d } from "./geometry-3d"
import { Point2d, Vector2d } from "./geometry-2d"

class SceneCamera {
    center: Point3d;
    right: Vector3d;
    up: Vector3d;
    into: Vector3d;

    constructor(center: Point3d, towards: Vector3d, upward: Vector3d) {
        //
        // Constructs a left-handed orthonormal frame for projection.

        // STEP 1
        //
        // TO DO: figure out an orthonormal frame that gives the
        //        center of focus along with the orientation of the
        //        camera for its perspective.
        //

        this.center = center;
        this.into = towards.unit();
        this.right = this.into.cross(upward.unit())
        this.up = this.right.cross(this.into)
    }

    project(location: Point3d) {
        const toLocation  = location.minus(this.center);
        const result = {
            point: location,
            projection: new Point2d(-toLocation.dy, toLocation.dz),
            depth: toLocation.dx
        };

        return result;
    }
}
