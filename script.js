// Document variables
    

// UI Elements
    const debugToggle = document.getElementById('debug-toggle');
    const debugStateLabel = document.getElementById('debug-state-label');    

// Perspective data
    const screen = {
        name: 'screen',
        width: window.innerWidth,
        height: window.innerHeight,
        depth: 0,
    }
    const fov = 39.6;
    const cameraHeight = 1.7;
    const imagePlaneDepth = 0.2;
    const imagePlane = {
        name: 'imagePlane',
        width: 2 * imagePlaneDepth * Math.tan((fov / 2) * (Math.PI) / 180), // window.innerWidth, <<< TU MOZE BYĆ BUG
        height: (2 * imagePlaneDepth * Math.tan((fov / 2 * Math.PI / 180))) * (window.innerWidth / window.innerHeight),
        depth: imagePlaneDepth,
    }
    const imagePlaneScale = imagePlane.width / window.innerWidth;
    // console.log(window.innerWidth);
    const perspective = {
        name: 'perspective',
    }

// Graphical elements
    const root = document.querySelector(':root');
    const gameArea = document.getElementById('game-area');
    const debugPoints = document.getElementById('debug-points');
    const target = document.getElementById('point-area-1');
    const ground = document.getElementById('ground');
    const leftHand = document.getElementById('left-hand');
    const rightHand = document.getElementById('right-hand');

    let targetSize = 1*1.22;
    let targetSizePixels;
    let targetPosition = {u: 0, v:(1.2-cameraHeight), w:30};
    let targetPositionPixels;
    let leftHandPosition;
    let leftHandSize = getComputedStyle(leftHand).getPropertyValue('--left-hand-size');
    leftHandSize = leftHandSize.slice(0, -2);
        leftHandSize = Number(leftHandSize);
        let rightHandSize = getComputedStyle(rightHand).getPropertyValue('--right-hand-size');
        rightHandSize = rightHandSize.slice(0, -2);
        rightHandSize = Number(rightHandSize);
        let originPosition = {
            X: Number (getComputedStyle(target).getPropertyValue('left').slice(0, -2)),
            Y: Number (getComputedStyle(sky).getPropertyValue('height').slice(0, -2))
        }    
        
        // Player input
        let device;
        let leftHandScr = {
            Xs: 0,
            Ys: 0
        };
        let leftHand_uvw = {
            u: 0,
            v: 0,
            w: 0
        }
    let rightHandScr = {
        Xs: 0,
        Ys: 0
    };
    let rightHand_uvw = {
        u: 0,
        v: 0,
        w: 0
    }
    let leftHandDistance = 1.4;
    let rightHandDistance = 0.7;   
    
// Debug mode - specific variables
    let debugMode;
    const testValues = 
        [0, 30, 0,
            10.800665, 30, 0,
            -10.800665, 30, 0,
            0, 30, 1.2,
            0.61, 30, 1.2,
            -0.61, 30, 1.2            
            ]

// Physics variables
    const gravity = 9.8; // m/s
    let t = 0;  // time will start at arrow release.
    let timeSlowMo = 1.0; // this variable will be used to slow time for debug or fun.
    const ArwLng = 0.85; // arrow length
    let arwSpdAtRel; // Arrow speed at release
    let arwSpd; // for storing current arrow speed
    let arwVecAtRel; // Arrow vector at release
    let arwVec; // for storing current arrow vector
    let arwHead;
    let arwEnd;


//








// GLOBAL UTILITIES SECTION ////////////////////////////////////////////////////////           

// Add event listeners
    debugToggle.addEventListener('click', toggle);
    gameArea.addEventListener('mousedown', mouse);
    gameArea.addEventListener('mousedown', leftHandAim);
    gameArea.addEventListener('mouseup', rightHandAim);
    gameArea.addEventListener('touchstart', touch);
    gameArea.addEventListener('touchstart', leftHandAim);
    gameArea.addEventListener('touchmove', rightHandAim);
    // gameArea.addEventListener('touchcancel', touchCancelled);
    // gameArea.addEventListener('touchmove', touchMoved);

//

// Device recognition           
    function mouse () {
        device = 'mouse';
        // console.log(device);
        return device;
    };
    function touch () {
        device = 'touch';
        // console.log(device);
        return device;
    };
//

// Point array formatting function
    // Input format: [num0, num1, num2, num3, num4... numn];
    // Target format: {id:0, u:0, v:10, w:-cameraHeight};
    
    function pointArrayToObjects(pointArray) {
              
        let objectCollection = [];
        let pointObject;
        let chunkSize = 3;
        let chunk;
        for (let i = 0; i < pointArray.length; i += chunkSize) {
            chunk = pointArray.slice(i, i + chunkSize);
            pointObject = {
                u: chunk[0],
                v: chunk[2],
                w: chunk[1]
            }

            objectCollection.push(pointObject);
        };
        objectCollection = objectCollection.filter( Boolean );
        return objectCollection;
        }
//

// General math functions

    function vectorLength (input_vector) {
        let result;
        result = Math.sqrt( Math.pow(input_vector[0], 2) + Math.pow(input_vector[1], 2) + Math.pow(input_vector[2], 2));
        return result;
    };

    function crossProduct (vec1, vec2) {
        let result;
        result = [(vec1[1]*vec2[2] - vec1[2]*vec2[1]), (vec1[2]*vec2[0] - vec1[0]*vec2[2]), (vec1[0]*vec2[1] - vec1[1]*vec2[0])];
        return result;
    };

    function dotProduct (vec1, vec2) {
        let result;
        result = (vec1[0]*vec2[0] + vec1[1]*vec2[1] + vec1[2]*vec2[2]);
        return result;
    };

    function vectorFromPoints (input1_uvw, input2_uvw) {
        let result;
        result = [input2_uvw.u - input1_uvw.u, input2_uvw.v - input1_uvw.v, input2_uvw.w - input1_uvw.w,]
        return result;
    };

    function vectorAngle (vec1, vec2) {
        let result;
        result = Math.acos( dotProduct(vec1,vec2) / (vectorLength(vec1) * vectorLength(vec2)) );
        return result;
    }


//
    

// Perspective transformer functions
    
    /* We'll have 4 coordinate systems:

      - screen         [Xs,Ys],   2D, with screen top left as origin,       units: pixels;
      - scrAtOrg       [Xo,Yo],   2D, with Vp (vanishing point) as origin   units: pixels;
      - imagePlane     [x,y,z],   2D, with Vp (vanishing point) as origin   units: meters;
      - perspective    [u,v,w],   3D, with camera as origin                 units: meters;

    We need functions to transform the coordinates of a point, 
    given in one of these coordinate systems into a needed coordinate system. */



    // Transform: screen -> imagePlane
        
        function screenToImagePlane (input_XsYs) {
            let reorientedPoint = {
                x: 0,
                y: 0,
                z: imagePlaneDepth,
            }

            let input_Xs = input_XsYs.Xs;
            let input_Ys = input_XsYs.Ys;

            reorientedPoint.x = (input_Xs - screen.width / 2) * imagePlaneScale; // Multiplying by imagePlaneScale lets us go directly from scrAtOrg to imagePlane
            reorientedPoint.y = (originPosition.Y - input_Ys) * imagePlaneScale; 

            return reorientedPoint; 
        }

    //

    // Transform: imagePlane -> perspective
        // this one needs an additional variable of depth.

        // It actually can be used for ANY plane (?).
        
        function imagePlaneToPerspective(input_xyz, depth) {
            let pointInPerspective = {
                u: 0,
                v: 0,
                w: depth
            };
            let input_x = input_xyz.x;
            let input_y = input_xyz.y;
            let input_z = input_xyz.z;

            pointInPerspective.u = input_x * depth / input_z;
            pointInPerspective.v = input_y * depth / input_z ;
            pointInPerspective.w = depth;
            
            return pointInPerspective;
        }
        
    //

    // Transform: perspective -> imagePlane
        
        function perspectiveToImagePlane (input_uvw, depth) {
            let pointOnImagePlane = {
                x: 0,
                y: 0,
                z: 0
            }
            // console.log(input_uvw);
            let input_u = input_uvw.u;
            let input_v = input_uvw.v;
            let input_w = input_uvw.w;
            // console.log(input_u);
                        
            pointOnImagePlane.x = input_u * depth / input_w;
            pointOnImagePlane.y = input_v * depth / input_w;
            pointOnImagePlane.z = depth;
            
            // console.log(pointOnImagePlane);
            
            // console.log(pointOnImagePlane);
            return pointOnImagePlane;
        }

    //

    // Transform imagePlane -> screen

        function imagePlaneToScreen (input_xyz) {
            
            let pointOnScreen = {
                Xs: 0,
                Ys: 0,
            }
            // console.log(input_xyz)
            let input_x = input_xyz.x;
            let input_y = input_xyz.y;
            let input_z = input_xyz.z;

            pointOnScreen.Xs = (input_x / imagePlaneScale) + (screen.width / 2);
            pointOnScreen.Ys = originPosition.Y - (input_y / imagePlaneScale); // 

            return pointOnScreen;
        }

    // Transform perspective -> screen
    // TODO - figure out, why below code doesn't work:

        // function perspectiveToScreen (input_uvw, depth) {
        //     imagePlaneToScreen(perspectiveToImagePlane(input_uvw, depth));
        // }

        //  Temporary solution:
        //  imagePlaneToScreen(perspectiveToImagePlane(input_uvw, imagePlaneDepth));



//

// Display & Clear display functions
    // This function takes as an input an array of perspective points,
    // it projects these points onto browser screen,
    // and assigns divs of a given class to them.
   
    function display (pointArray, targetDiv, divClass) {
        let pointCollection = '';
        for (let i = 0; i < (pointArray.length / 3); i++) {
            // I have coordinates of a point in perspective coordinates:
            let pointInPerspective = pointArrayToObjects(pointArray)[i];
            
            let pointOnScreen;
            let pointOnImagePlane;
            // Now I need to find its position on the screen:
            // console.log(pointInPerspective);
            pointOnImagePlane = perspectiveToImagePlane(pointInPerspective, imagePlaneDepth);
            // console.log(pointOnImagePlane);
            pointOnScreen = imagePlaneToScreen(pointOnImagePlane);
            // console.log(pointOnScreen);
    
            let pointDiv = `
            <div class="${divClass}" style="
            top: ${pointOnScreen.Ys}px;
            left: ${pointOnScreen.Xs}px;">
            </div>
            `;
            
            pointCollection = `${pointCollection} ${pointDiv}`;
            // console.log(pointCollection);

            
            // return pointCollection;
        }
        // console.log(pointCollection);
        targetDiv.innerHTML = pointCollection;        
    }

    function clearDisplay (targetDiv) {
        targetDiv.innerHTML = null;
    }

//









// USER INTERFACE SECTION ////////////////////////////////////////////////////////
// This section contains all UI elements.

    // Debug mode
    function toggle(e) {
        debugMode = debugToggle.checked
        if (debugMode === true) {
            debugStateLabel.innerHTML = `Debug: ON`;
            console.log('Debug: ON');
            display(testValues, debugPoints, 'test-point');
        } else {
            debugStateLabel.innerHTML = `Debug: OFF`;
            console.log('Debug: OFF');
            clearDisplay(debugPoints);
        }
        return debugMode
    }    

//








// SCENE SECTION ////////////////////////////////////////////////////////
// This section contains all stuff that is visible on the screen when the page loads, excluding UI elements.

// Target size & position calculation

    // Target size calculation:
        // targetSize;
        // targetPosition.w;
        ;

        // we need to calculate distance in px from a point [targetSize/2, targetPosition.]
        (function targetSizePx() {            
            let rightPoint = {u: targetSize/2, v: targetPosition.v , w: targetPosition.w};
            let leftPoint = {u: -targetSize/2, v: targetPosition.v , w: targetPosition.w};
            let rightPointPx = imagePlaneToScreen(perspectiveToImagePlane(rightPoint, imagePlaneDepth));
            let leftPointPx = imagePlaneToScreen(perspectiveToImagePlane(leftPoint, imagePlaneDepth));

            let result = rightPointPx.Xs - leftPointPx.Xs;
            
            targetSizePixels = result;
        }());
        root.style.setProperty('--target-size', `${targetSizePixels}px`);
        
        // we need to calculate the position of the target in px
        
        targetPositionPixels = imagePlaneToScreen(perspectiveToImagePlane(targetPosition, imagePlaneDepth));
        let targetPositionPixelsXs = targetPositionPixels.Xs;

        root.style.setProperty('--target-position-X', `${targetPositionPixels.Xs - (targetSizePixels/2)}px`);
        root.style.setProperty('--target-position-Y', `${targetPositionPixels.Ys - (targetSizePixels/2)}px`);

// Target - here we define point areas

    let previousPointArea = '';
    let thisPointArea = '';
    let nextPointArea = '';

    for (let i = 0; i <= 9;) {
        
        thisPointArea = `
        <div id="point-area-${10-i}" class="point-area " style="
        width: calc(var(--target-size)*${(i+1)*0.1});
        height: calc(var(--target-size)*${(i+1)*0.1});
        z-index: ${10-i}">
            ${previousPointArea}
        </div>
        `;
        i++;
        previousPointArea = thisPointArea;

        if (i===9) {
            target.innerHTML = thisPointArea;
        }
    };
//










// USER INPUT SECTION ////////////////////////////////////////////////////////
// This section contains all objects the player interacts with, excluding UI.

    // Left Hand Aim

        function leftHandAim(e) {
            leftHand.style.setProperty('display', 'block');
            let triggerX;
            let triggerY;
            if (device === 'mouse') {
                triggerX = e.clientX;
                triggerY = e.clientY;
            } else {
                triggerX = e.touches[0].clientX;
                triggerY = e.touches[0].clientY;
            }
            // let triggerX = e.touches[0].clientX, e.clientX // e.touches[0].clientX for mobile; e.clientX for desktop

            leftHand.style.left = `${triggerX-leftHandSize/2}px`;
            leftHand.style.top = `${triggerY-leftHandSize/2}px`;

            leftHandScr.Xs = triggerX;
            leftHandScr.Ys = triggerY;
        
            let ipCoordinates = {
                x: screenToImagePlane(leftHandScr).x,
                y: screenToImagePlane(leftHandScr).y,
                z: imagePlane.depth,
            }

            
            let ppCoordinates = {
                u: imagePlaneToPerspective(ipCoordinates, leftHandDistance).u,
                v: imagePlaneToPerspective(ipCoordinates, leftHandDistance).v,
                w: leftHandDistance,
            }

            let ipRtrnCoords = perspectiveToImagePlane(ppCoordinates, imagePlaneDepth);

            let scrnRtrnCoords = imagePlaneToScreen(ipRtrnCoords);

            leftHand_uvw = ppCoordinates;        
            
            if (debugMode === true) {
                leftHand.innerHTML = `
                <span class="debug-text">
                    ${screen.name}:<br>
                    ${triggerX},<br>
                    ${triggerY}
                </span>
                <span class="debug-text">
                    ${imagePlane.name}:<br>
                    ${ipCoordinates.x},<br>
                    ${ipCoordinates.y},<br>
                    ${ipCoordinates.z}
                </span>
                <span class="debug-text">
                    ${perspective.name}:<br>
                    ${ppCoordinates.u},<br>
                    ${ppCoordinates.v},<br>
                    ${ppCoordinates.w}
                </span>
                <span class="debug-text">
                    imgpl-rtrn:<br>
                    ${ipRtrnCoords.x},<br>
                    ${ipRtrnCoords.y},<br>
                    ${ipRtrnCoords.z}
                </span>
                <span class="debug-text">
                    scrn-rtrn:<br>
                    ${scrnRtrnCoords.Xs},<br>
                    ${scrnRtrnCoords.Ys}
                </span>
                `;
            } else {
                leftHand.innerHTML = ``;
            };

            return leftHandScr, leftHand_uvw;
        }

    //

    // Right hand aim
        // TODO: this function is basically a duplicaye code of leftHandAim. These two should be combined into one.

        function rightHandAim(e) {
            rightHand.style.setProperty('display', 'block');
            let triggerX;
            let triggerY;


            if (device === 'mouse') {
                triggerX = e.clientX;
                triggerY = e.clientY;
            } else {
                triggerX = e.touches[0].clientX;
                triggerY = e.touches[0].clientY;
            }


            rightHand.style.left = `${triggerX-rightHandSize/2}px`;
            rightHand.style.top = `${triggerY-rightHandSize/2}px`;
            rightHandScr.Xs = triggerX;
            rightHandScr.Ys = triggerY;
       
            let ipCoordinates = {
                x: screenToImagePlane(rightHandScr).x,
                y: screenToImagePlane(rightHandScr).y,
                z: imagePlane.depth,
            }

            
            let ppCoordinates = {
                u: imagePlaneToPerspective(ipCoordinates, rightHandDistance).u,
                v: imagePlaneToPerspective(ipCoordinates, rightHandDistance).v,
                w: rightHandDistance,
            }

            let ipRtrnCoords = perspectiveToImagePlane(ppCoordinates, imagePlaneDepth);

            let scrnRtrnCoords = imagePlaneToScreen(ipRtrnCoords);

            rightHand_uvw = ppCoordinates;
            
            if (debugMode === true) {
                rightHand.innerHTML = `
                <span class="debug-text">
                    ${screen.name}:<br>
                    ${triggerX},<br>
                    ${triggerY}
                </span>
                <span class="debug-text">
                    ${imagePlane.name}:<br>
                    ${ipCoordinates.x},<br>
                    ${ipCoordinates.y},<br>
                    ${ipCoordinates.z}
                </span>
                <span class="debug-text">
                    ${perspective.name}:<br>
                    ${ppCoordinates.u},<br>
                    ${ppCoordinates.v},<br>
                    ${ppCoordinates.w}
                </span>
                <span class="debug-text">
                    imgpl-rtrn:<br>
                    ${ipRtrnCoords.x},<br>
                    ${ipRtrnCoords.y},<br>
                    ${ipRtrnCoords.z}
                </span>
                <span class="debug-text">
                    scrn-rtrn:<br>
                    ${scrnRtrnCoords.Xs},<br>
                    ${scrnRtrnCoords.Ys}
                </span>
                `;
            } else {
                rightHand.innerHTML = ``;
            };
    
            return rightHandScr, rightHand_uvw;
        }

    //

    //console.log(leftHand_uvw);
    //console.log(rightHand_uvw);

//










// SHOOTING SECTION ////////////////////////////////////////////////////////
// This section contains creates an arrow flight simulation based on user input.
    
    // Arrow flight plane
    // We create a plane with rightHand_uvw (arrow release position) as origin.
    // We'll need functions to transform between arrow plane coordinates to uvw, too.
    
    // Transform perspective (uvw) to arrowPlane (dh) [d - distance on horizontal plane, h - height]
        
        // HARDCODED VALUES FOR DEBUGGING PURPOSES - TO BE DELETED        
            leftHand_uvw = {
                "u": 0.12967788232866576,
                "v": -0.12233762483836391,
                "w": 1.4
            };
            rightHand_uvw = {
                "u": 0.1406882685641185,
                "v": -0.16270904103502398,
                "w": 0.7
            };
        //

        function perspectiveToArwPln (input_uvw) {
            let result = {d:0, h:0};
            result.d = Math.sqrt( Math.pow( (rightHand_uvw.u - input_uvw.u), 2) + Math.pow( (rightHand_uvw.w-input_uvw.w), 2) );
            result.h = input_uvw.v - rightHand_uvw.v;
            return result;
        };

        let testPointOnArwPln = perspectiveToArwPln(leftHand_uvw);
        console.log(perspectiveToArwPln(leftHand_uvw));

    //

    // Transform arrowPlane (dh) to perspective (uvw) [d - distance on horizontal plane, h - height]
        
        // We need to get the angle between | rH -> lH | vector projected to uw plane and | w | axis vector.
        // First, we need to create the | rH -> lH | vector in uvw space.
        arwVecAtRel = vectorFromPoints(rightHand_uvw, leftHand_uvw); 
        console.log(arwVecAtRel);
        
        function arwPlnToPerspective (input_dh) {
            
            let projectedArwVec;
            projectedArwVec = [arwVecAtRel[0], 0, arwVecAtRel[2]]; 
            let wAxis;
            wAxis = [0, 0, arwVecAtRel[2]];            
            let angle;            
            angle = vectorAngle(wAxis, projectedArwVec);
            // this is the angle we've been looking for.

            console.log(angle);
            
            
            return angle;
        };


        // We know, that the coordinates of leftHand on arrowPlane are:
        perspectiveToArwPln(leftHand_uvw);

        console.log(arwPlnToPerspective({d:0, h:0}))

    //
    
    
    
    

    // Arrow vector at release
    arwVecAtRel = [0, 0, 0];

    //U
    // console.log(arwVecAtRel);