//
// walk-thru.js
//
// Author: Jim Fix
// CSCI 385: Computer Graphics, Reed College, Fall 2024
//
// This defines a library of geometric calculations used by
// `walk-thru.js` as part of the `WalkThru.toPDF` method.  These help
// us determine whether two edges of two scene objects intersect when
// projected to 2-D according to a perspective projection, and to
// determine whether a portion of an object edge is hidden by some
// other object.
//

import { Point3d, Vector3d } from "./geometry-3d"

function segmentsIntersect(P0,P1,Q0,Q1) {
    //
    // Determine whether two 2-D line segments intersect. The first
    // segment runs between points P0 and P1. The second segment runs
    // between Q0 and Q1. These are all Point2d objects.
    //
    // Returns `null` if they do not intersect. Returns a fraction
    // between 0.0 and 1.0 that locates the intersection point along
    // the first segment between P0 and P1.
    //
    // THat is to say, if this code returns a scalar value s, and if
    // R is the intersection point of the two line segments, then R
    // should be at P0.combo(s,P1).

    //
    // TO DO: compute the whether the segments intersect
    //
    
    var u = Q1.minus(Q0).unit()
    var v = u.perp()

    var O = Q0

    // Now we have a coordinate scheme where Q0 is the origin, +x is towards Q1 and +y is 90 degrees offset
    // (it doesn't actually matter if +y is up or down)

    var x0 = P0.minus(O).dot(u)
    var x1 = P1.minus(O).dot(u)
    var y0 = P0.minus(O).dot(v)
    var y1 = P1.minus(O).dot(v)

    if (y0 * y1 > 0) {
        // The signs are the same, which means the line segment P is entirely on one side of Q,
        // so they by definition cannot cross
        return null
    }

    var s = y0 / (y0 - y1)
    // s correctly shows the point of intersection, but we haven't yet checked to make sure
    // that it's actually between Q0 and Q1

    // the following *should* work, but does not
    /*
    S = P0.combo(s, P1)

    t = Q0.dist(S) / Q1.dist(S)
    console.log(t)

    if (t < 0) { return null }
    if (t > 1) { return null }

    return s
    */

    // Instead compute y0 and y1 again, but using P0 as the origin instead of Q0
    u = P1.minus(P0).unit()
    v = u.perp()

    O = P0

    y0 = Q0.minus(O).dot(v)
    y1 = Q1.minus(O).dot(v)

    if (y0 * y1 > 0) { return null }

    return s
}

function rayFacetIntersect(Q1: Point3d, Q2: Point3d, Q3: Point3d, R: Point3d, Rp: Point3d) {
    //
    // Determine whether a ray eminating from point R and passing
    // through point Rp intersects a triangular facet given by the
    // points Q1 Q2 Q3. These are all Point3d objects.
    //
    // Returns `null` if the ray doesn't hit the facet. If it does,
    // the code should return a primtive Javascript object with two
    // components:
    //
    //    point: the point on the facet struck by the ray
    //    distance: the distance from the ray source R to that point
    //


    //
    // TO DO: compute whether the ray hits the facet, and where.
    //

    var r = Rp.minus(R).unit()
    // unit vector along the ray

    var v2 = Q2.minus(Q1).unit()
    var v3 = Q3.minus(Q1).unit()

    var n = v2.cross(v3)
    // n is normal to the plane containing the triangle

    var D = Q1.minus(R).dot(n) // distance from R to the plane
    var d = r.dot(n) // project the unit vector of the ray

    // The point of intersection between the ray and the plane
    // May or may not be within the triangle
    var S = R.plus(r.times(D/d))

    // Now check whether S is within the triangle

    if (v2.cross(S.minus(Q1)).dot(v2.cross(v3)) < 0) { return null }
    if (v3.cross(S.minus(Q1)).dot(v3.cross(v2)) < 0) { return null }

    var v4 = Q3.minus(Q2)

    if (v2.neg().cross(S.minus(Q2)).dot(v2.neg().cross(v4)) < 0) { return null }
    if (v4.cross(S.minus(Q2)).dot(v4.cross(v2.neg())) < 0) { return null }
    
    return {point:S, distance:S.dist(R)};
}    

