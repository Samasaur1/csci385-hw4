import { CGObject, PlacementType } from "./_cg-object";
import { SceneCamera } from "./SceneCamera";
import { SceneEdge } from "./SceneEdge";

export class SceneObject extends CGObject {
    vertexProjections: Map<any, any> | null;
    
    constructor(cgobject: CGObject, placement: PlacementType) {
        // Compile geometric info from a placed object,
        super();
        this.cloneFromObject(cgobject, placement);
        
        // Clear projection info.
        this.vertexProjections = null;
    }

    cloneFromObject(cgobject: CGObject, placement: PlacementType) {
        /*
         * Sets the faces, edges, and vertices of a CGObject so
         * that they share the topology of another object, and 
         * so that the vertex locations correspond to a placement
         * of the vertices of that other object.
         */
        
        const vs = cgobject.allVertices();
        for (let v of vs) {
            this.addVertex(v.getRelativePosition(placement));
        }
        const fs = cgobject.allFaces();
        for (let f of fs) {
            this.addFace(f.vertexi[0],
                         f.vertexi[1],
                         f.vertexi[2],
                         f.id);
        }
        this.lock = true;
    }

    reset() {
        // Reset projection info.
        this.vertexProjections = new Map();
    }

    projectVertices(camera: SceneCamera) {
        for (let v of this.allVertices()) {
            // Get the projection info.
            const projection = camera.project(v.position);
            // Store that info in the Map, as an entry for that vertex.
            this.vertexProjections!.set(v,projection);
        }
    }
    
    projectEdges(camera: SceneCamera): SceneEdge[] {
        const segments: SceneEdge[] = []
        for (let e of this.allEdges()) {
            //
            const v0 = e.vertex(0); // source vertex
            const v1 = e.vertex(1); // target vertex
            //
            const pj0 = this.vertexProjections!.get(v0); // projected locations
            const pj1 = this.vertexProjections!.get(v1);
            //
            if ((pj0.depth > 0) && (pj1.depth > 0)) {
                //
                // Only include edges whose two endpoints are in front of
                // the camera.
                //
                // Return the projected segment info for this scene object.
                const segment = new SceneEdge(pj0, pj1, e.faces());
                segments.push(segment);
            }
        }
        return segments;
    }
}
