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

        // STARTER CODE: just sets the `into` direction along x,
        //               the `right` direction along y, and the
        //               `up` direction along z. 
        this.center = center;
        this.right  = new Vector3d( 0.0,-1.0, 0.0);
        this.up     = new Vector3d( 0.0, 0.0, 1.0);
        this.into   = new Vector3d( 1.0, 0.0, 0.0);
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
