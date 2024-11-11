import { Point3d } from "./geometry-3d";
import { SceneCamera, ProjectionResult } from "./SceneCamera";
import { segmentsIntersect as _SI, rayFacetIntersect as _RFI } from "./walk-thru-library";
import { Face } from "./cg-object";
import { SceneObject } from "./SceneObject";
import { Point2d } from "./geometry-2d";

const segmentsIntersect = _SI;
const rayFacetIntersect = _RFI;
type XY = {x: number, y: number}
const toPDFcoord = (x: Point2d): XY => { return x }

export class SceneEdge {
    start: ProjectionResult;
    end: ProjectionResult;
    faces: Face[];

    constructor(pj0: ProjectionResult, pj1: ProjectionResult, fs: Face[]) {
        //
        // new SceneEdge(pj0, pj1, fs)
        //
        // This represents the projection of the edge of an object in
        // the scene.  The projection info of its two endpoints are
        // provided as `pj0` and `pj1`. This is data computed by
        // SceneCamera.project.  The edge is formed between the one
        // or two faces listed in the array `fs`.
        //
        this.start = pj0;
        this.end   = pj1;
        this.faces = fs;
    }
    
    breakpoints(edges: SceneEdge[]): number[] {
        return edges
            .map((other) => segmentsIntersect(
                this.start.projection,
                this.end.projection,
                other.start.projection,
                other.end.projection
            )
            )
        .filter((res) => res !== null)
        .concat([0, 1])
        
        // Figure out what edges cross this segment. Records a
        // fractional value (from 0.0 to 1.0) locating each crossing
        // edge along `this` edge.
        //
        // Each pair of consecutive values determines a
        // segment of the edge.
        
        const crossings = [0.0,1.0];

        //
        // TO DO: collect any of other breakpoint locations
        //        of segements whose projection crosses this
        //        one. Use your 2D segment intersection code.
        //

        // STARTER CODE: an edge is only a single segment, from
        //               0.0 to 1.0.
        return crossings;
    }

    isSegmentVisible(breakpointA: Point3d, breakpointB: Point3d, camera: SceneCamera, objects: SceneObject[]) {

        // TO DO:
        //
        // Figure out whether an edge's segment, from `breakpointA`
        // to `breakpointB`, is hidden by a collection of `objects`
        // when viewed from the perspective of the given `camera`.
        //

        // STARTER CODE: just says all edge segments are visible.
        return true;
    }
        
    draw(document, camera: SceneCamera, segments: SceneEdge[], objects: SceneObject[]) {
        //
        // Draw the edge but by showing only its segments that aren't
        // hidden by object facets in the scene.
        //

        // Compute any/all breakpoints along the segment.
        // These are places where the other scene edge crosses this edge
        // when looking through this camera.
        const crossings = this.breakpoints(segments);

        const p0 = this.start.point;
        const p1 = this.end.point;
        const pp0 = this.start.projection;
        const pp1 = this.end.projection;

        // TO DO: go through each of the segments of the edge, as
        //        defined by the breakpoints made by crossing edges.
        //        If the segment is visible (isn't obscured by some
        //        object's facet) draw it.

        // STARTER CODE: just draws the whole edge and its endpoints.

        const ppdf0 = toPDFcoord(pp0);
        const ppdf1 = toPDFcoord(pp1);        
        document.setLineWidth(0.125);
        document.setDrawColor(gIncludedColor.r,
                              gIncludedColor.g,
                              gIncludedColor.b);
        document.line(ppdf0.x, ppdf0.y, ppdf1.x, ppdf1.y);
        document.circle(ppdf0.x, ppdf0.y, 0.35, "F");
        document.circle(ppdf1.x, ppdf1.y, 0.35, "F");
    }        
}
