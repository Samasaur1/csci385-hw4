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
        //
        // Compute the projection information of a `location` in the
        // scene, given as a `point3d` object. The result gets
        // reported as a point in 2D along with a depth. These are
        // found by performing a perspective projection from this
        // SceneCamera.
        //

        // STEP 2
        //
        // TO DO: compute the projection of a 3D point according to
        //        this camera's perspective.

        // Depth from the camera to the true point
        var depth = location.minus(this.center).dot(this.into)

        // Vector from the camera to the projected point
        var v = location.minus(this.center).div(depth)

        // The projected point, **as a Point3d**
        var pointIn3d = this.center.plus(v)

        // The origin of the page **as a Point3d**
        var originIn3d = this.center.plus(this.into)

        // The 2d coordinates of the projected point
        var x = pointIn3d.minus(originIn3d).dot(this.right)
        var y = pointIn3d.minus(originIn3d).dot(this.up)

        return {
            point: location,
            projection: new Point2d(x, y),
            depth: depth
        }
    }
}
