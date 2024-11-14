//
// walk-thru.js
//
// Author: Jim Fix
// CSCI 385: Computer Graphics, Reed College, Fall 2024
//
// This defines six object types that support a walk through a scene
// of objects. It is made up of several camera shots of that scene.
//
// It defines these classes
//
//  * Shot: the position and direction of a camera shot in the scene.
//
//  * Placement: the positioning, sizing, and orientation of an object
//      from an object library.
//
//  * WalkThru: a collection of shots and placements.
//
// It provides templates for code for these classes:
//
//  * SceneCamera: information for producing a snapshot of the scene
//      from a particular camera Shot.
//
//  * SceneObject: geometric information for the placememt of a
//      library object within a scene. This is used for projecting its
//      points and edges when taking a camera snapshot.
//
//  * SceneEdge: geometric information for the projection of an
//      SceneObject's edge. This is computed when taking a snapshot of
//      the scene.
//
// ------
//
// Assignment
//
// Your job is to get the code for the `toPDF` method of the
// `WalkThru` class fully working. This method should compile all the
// geometric information for the shots and object placements of the
// scene walk-through. Having done that, it should then produce a
// series of lines on the pages of a PDF documemt. Each page should
// correspond to a snapshot of the objects in the scene from some
// camera location, as directed by the series of shots.
//
// Each page should render the objects according to a perspective
// drawing of the edges/facets of each object in the scene, with
// "hidden lines removed." This means that if a portion of an edge is
// hidden behind a face of an object that sits closer to the camera,
// then that portion of the edge should not be drawn.
//
// There is a template worked out for the code for `WalkThru.toPDF`.
// It contains the skeleton of a solution as described in the
// assignment text. See the comments in that code, and the description
// in the assignment text, to complete the code according to that
// prescription.
//
// If you choose to follow the prescription, scan through the code of
// `WalkThru.toPDF` and then look for all the "TO DO" comments
// littered through its supporting code. Write that supporting code.
//
// If you instead choose to devise your own approach to a solution,
// then you can just rewrite `WalkThru.toPDF`, but you still might find
// the existing code's supporting code useful.
//

const MINIMUM_PLACEMENT_SCALE = 0.1; // Smallest object we can place.
const EPSILON = 0.00000001;

// Ink colors for drawing in the PDF
const BLACK = {r:25, g:25, b:25};
const PINK = {r:255, g:225, b:240};
const TEAL = {r:0, g:75, b:125};

// Colors of the included and excluded portions of a drawn edge.
// When the excluded color is `null`, then that portion is not
// drawn.
const gIncludedColor = BLACK;
const gExcludedColor = null; /* or could make PINK */

class Shot {
    constructor(position0, direction0) {
        this.position = position0;
        this.direction = direction0;
    }
}

class Placement {
    //
    // Class representing the placement of a library object in the scene.
    //
    constructor(name, position0) {
        //
        // `name`: string of the object cloned from the library. This
        //         name is used to access the object's geometric info
        //         (its faceted surface) and also to render it with
        //         glBeginEnd.
        //
        // `position`, `scale`, `direction`: a `point`, number, and
        //         `vector` representing the location, size, and
        //         orientation of this object's placement in the
        //         scene.
        //
        this.name        = name;
        this.position    = position0;
        this.scale       = MINIMUM_PLACEMENT_SCALE;
        this.orientation = 0.0;
    }
    
    resize(scale, bounds) {
        //
        // Return the 2D orientation of the object as an angle in degrees.
        // This gives the "spin" of the clone around its base.
        //
        // Some checks prevent growing the clone beyond the scene bounds.
        //
        if (bounds != null) {
            scale = Math.max(scale, MINIMUM_PLACEMENT_SCALE);
            scale = Math.min(scale, bounds.right - this.position.x);
            scale = Math.min(scale, bounds.top - this.position.y);
            scale = Math.min(scale, this.position.x - bounds.left);
            scale = Math.min(scale, this.position.y - bounds.bottom);
        }
        this.scale = scale;    
    }

    moveTo(position, bounds) {
        //
        // Relocate the object.
        //
        // Some checks prevent the object from being placed outside
        // the scene bounds.
        //
        if (bounds != null) {
            position.x = Math.max(position.x ,bounds.left + this.scale);
            position.y = Math.max(position.y, bounds.bottom + this.scale);
            position.x = Math.min(position.x, bounds.right - this.scale);
            position.y = Math.min(position.y, bounds.top - this.scale);
        }
        this.position = position;
    }

    rotateBy(angle) {
        //
        // Re-orient the clone by spinning it further by and angle.
        //
        this.orientation += angle;
    }

    baseIncludes(queryPoint) {
        //
        // Checks whether the `queryPoint` lives within the circular base
        // of the clone.
        //
        const distance = this.position.dist2(queryPoint);
        return (distance < this.scale*this.scale);
    }

    draw(objectColor, highlightColor, drawBase, drawShaded) {
        //
        // Draws the object within the current WebGL/opengl context.
        //
        glPushMatrix();
        const position = this.position;
        const angle = this.orientation;
        const scale = this.scale;
        glTranslatef(this.position.x, this.position.y, this.position.z);
        glRotatef(angle, 0.0, 0.0, 1.0);
        glScalef(this.scale, this.scale, this.scale);
        //
        // draw
        if (drawShaded) {
            // Turn on lighting.
            glEnable(GL_LIGHTING);
            glEnable(GL_LIGHT0);
        }
        glColor3f(objectColor.r, objectColor.g, objectColor.b);
        glBeginEnd(this.name);
        if (drawShaded) {
            // Turn on lighting.
            glDisable(GL_LIGHT0);
            glDisable(GL_LIGHTING);
        }

        // draw with highlights
        if (highlightColor != null) {
            
            glColor3f(highlightColor.r,
                      highlightColor.g,
                      highlightColor.b);
            //
            // Draw its wireframe.
            glBeginEnd(this.name+"-wireframe");
            if (drawBase) {
                // Show its extent as a circle.
                glBeginEnd("BASE");
            }
            
        }

        glPopMatrix();
    }    
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   WALK THRU
*/

function toPDFcoord(p) {
    const x = p.x * 27 + 27 + 2;
    const y = 4 + (2.0 - p.y) * 27;
    return {x:x, y:y};
}

function pointIsHidden(camera, point, exclude, objects) {
    for (let object of objects) {
        if (object.hides(camera, point, exclude)) {
            return true;
        }
    }
    return false;
}

class WalkThru {}

class SceneCamera {}

class SceneObject extends CGObject {
    
    constructor(cgobject, placement) {
        // Compile geometric info from a placed object,
        super();
        this.cloneFromObject(cgobject, placement);
        
        // Clear projection info.
        this.vertexProjections = null;
    }

    cloneFromObject(cgobject, placement) {
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

    projectVertices(camera) {
        for (let v of this.allVertices()) {
            // Get the projection info.
            const projection = camera.project(v.position);
            // Store that info in the Map, as an entry for that vertex.
            this.vertexProjections.set(v,projection);
        }
    }
    
    projectEdges(camera) {
        const segments = []
        for (let e of this.allEdges()) {
            //
            const v0 = e.vertex(0); // source vertex
            const v1 = e.vertex(1); // target vertex
            //
            const pj0 = this.vertexProjections.get(v0); // projected locations
            const pj1 = this.vertexProjections.get(v1);
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

class SceneEdge {}
