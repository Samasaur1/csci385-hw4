import { Point3d, Vector3d } from "./geometry-3d"
import { Point2d as _Point2d, Vector2d } from "./geometry-2d"

const Point2d = _Point2d

function project(location: Point3d) {
    const toLocation  = location.minus(this.center);
    const result = {
        point: location,
        projection: new Point2d(-toLocation.dy, toLocation.dz),
        depth: toLocation.dx
    };

    return result;
}
