import { ORIGIN3D as _ORIGIN3D, X_VECTOR3D as _X_VECTOR3D, Z_VECTOR3D as _Z_VECTOR3D } from "./_geometry-3d";
import { SceneCamera as _SceneCamera } from "./SceneCamera";
import { SceneObject as _SceneObject } from "./SceneObject";
import { SceneEdge } from "./SceneEdge";
import { Shot as _Shot } from "./Shot";

const Shot = _Shot;
const SceneObject = _SceneObject;
const SceneCamera = _SceneCamera;
const ORIGIN3D = _ORIGIN3D;
const X_VECTOR3D = _X_VECTOR3D;
const Z_VECTOR3D = _Z_VECTOR3D;

class WalkThru {
    shot0: _Shot;
    shots: _Shot[];
    placements: any[];

    constructor() {
        /*
         * new WalkThru
         *
         * Initializes an empty scene with a single shot of it.
         * The shot is on the left side facing right.
         */
        this.shot0 = new Shot(ORIGIN3D(), X_VECTOR3D());
        this.shots = [this.shot0];
        this.placements = [];
    }

    toPDF(document, startNewPage) {
        //
        // Make all the cameras from the walk-through's shots.
        //
        const cameras: _SceneCamera[] = [];
        for (let shot of this.shots) {
            // Performs STEP 1.
            const camera = new SceneCamera(shot.position,
                                           shot.direction,
                                           Z_VECTOR3D());
            cameras.push(camera);
        }

        //
        // Make all the scene objects from their placements.
        //
        const objects: _SceneObject[] = [];
        for (let placement of this.placements) {
            const prototype = gObjectsLibrary.get(placement.name);
            const object = new SceneObject(prototype, placement);
            objects.push(object);
        }

        //
        // Render each page of the walk-through.
        //
        for (let camera of cameras) {
            
            // For now, one page per shot.
            startNewPage(document);

            // Ready to project from this perspective.
            for (let object of objects) {
                object.reset();
            }
            
            // Compute projected vertex information.
            for (let object of objects) {
                // Performs STEP 2.
                object.projectVertices(camera);
            }

            let edges: SceneEdge[] = [];
            // Gather the projection info about the edges of each object.
            for (let object of objects) {
                const moreEdges = object.projectEdges(camera, objects);
                edges = edges.concat(moreEdges);
            }

            // Appropriately draw (the visible parts of) each edge. 
            for (let edge of edges) {
                // Performs STEPS 3 and 4.
                edge.draw(document, camera, edges, objects);
            }
        }        
    }
}
