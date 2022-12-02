// Document variables
    
// Scene state variables
    let sceneState = 'start';
    console.log(sceneState);

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
    const trajectoryPoints = document.getElementById('trajectory-points'); 
    const arrowPoints = document.getElementById('arrow-points'); 

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
    let shotTrajectory;
    
    // Debug mode - specific variables
    let debugMode;
    const testValues = 
    [0, 0, 30,
        10.800665, 0, 30,
        -10.800665, 0, 30,
        0, 1.2, 30,
        0.61, 1.2, 30,
        -0.61, 1.2, 30,          
    ]
    
    // Physics variables
    const g = 9.8; // m/s
    let t = 0;  // time will start at arrow release.
    let timeSlowMo = 1.0; // this variable will be used to slow time for debug or fun.
    const arwLng = 0.85; // arrow length
    let arwSpdAtRel; // Arrow speed at release
    let arwSpd; // for storing current arrow speed
    let arwVecAtRel; // Arrow vector at release
    let arwVec; // for storing current arrow vector
    let arwHead;
    let arwEnd;
    
    // Bow parameters            
    let v0 = 50; // this will be a complex equation later.
    let shotPreviewSteps = 60;   










// GLOBAL UTILITIES SECTION ////////////////////////////////////////////////////////           

// Add event listeners
    debugToggle.addEventListener('click', toggle);
    gameArea.addEventListener('mousedown', mouse);
    gameArea.addEventListener('mousedown', gameStarted);
    // gameArea.addEventListener('mousemove', rightHandAim);
    gameArea.addEventListener('mouseup', rightHandAim);
    gameArea.addEventListener('touchstart', touch);
    gameArea.addEventListener('touchstart', gameStarted);
    gameArea.addEventListener('touchmove', rightHandAim);
    gameArea.addEventListener('touchend', bowReleased);
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
                v: chunk[1],
                w: chunk[2]
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
        if (input_vector.length === 2 && input_vector.length === 2) {
            result = Math.sqrt( Math.pow(input_vector[0], 2) + Math.pow(input_vector[1], 2));
        } else if (input_vector.length === 3 && input_vector.length === 3) {
            result = Math.sqrt( Math.pow(input_vector[0], 2) + Math.pow(input_vector[1], 2) + Math.pow(input_vector[2], 2));
        } else {
            result = 'Invalid input.'
        };
        return result;
    };

    // We don't need cross product, but can be useful later.
    // function crossProduct (vec1, vec2) {
    //     let result;
    //     result = [(vec1[1]*vec2[2] - vec1[2]*vec2[1]), (vec1[2]*vec2[0] - vec1[0]*vec2[2]), (vec1[0]*vec2[1] - vec1[1]*vec2[0])];
    //     return result;
    // };

    function dotProduct (vec1, vec2) {
        let result;
        if (vec1.length === 2 && vec2.length === 2) {
            result = (vec1[0]*vec2[0] + vec1[1]*vec2[1]);
        } else if (vec1.length === 3 && vec2.length === 3) {
            result = (vec1[0]*vec2[0] + vec1[1]*vec2[1] + vec1[2]*vec2[2]);
        } else {
            result = 'Invalid input.'
        };
        return result;
    };

    function vectorFromPoints (input1, input2) {
        let result;
        let vec1 = Object.values(input1);
        let vec2 = Object.values(input2);

        if (vec1.length === 2 && vec2.length === 2) {
            result = [vec2[0] - vec1[0], vec2[1] - vec1[1]];
        } else if (vec1.length === 3 && vec2.length === 3) {
            result = [vec2[0] - vec1[0], vec2[1] - vec1[1], vec2[2] - vec1[2]];
        } else {
            result = 'Invalid input.'
        };
        
        return result;
    };

    function multiplyVector (vec, multiplier) {
        let result;
        if (vec.length === 2) {
            result = [vec[0]*multiplier, vec[1]*multiplier];
        } else if (vec.length === 3) {
            result = [vec[0]*multiplier, vec[1]*multiplier, vec[2]*multiplier];
        } else {
            result = 'Invalid input.'
        };
        return result;
    };

    function series (startNumber, endNumber, count) {
        let result = [];
        let step = ( endNumber - startNumber ) / ( count - 1 );

        for ( i = 0; i < count; i++) {
            let y;
            y = startNumber + step * [i];
            result.push(y); 
        }
        return result;
    }

    // HARDCODED VALUES FOR DEBUGGING PURPOSES - TO BE DELETED / COMMENTED OUT       
        // leftHand_uvw = {
        //     "u": 0.12967788232866576,
        //     "v": -0.12233762483836391,
        //     "w": 1.4
        // };
        // rightHand_uvw = {
        //     "u": 0.1406882685641185,
        //     "v": -0.16270904103502398,
        //     "w": 0.7
        // };
        // leftHand_uvw = [0.12967788232866576, 0.12967788232866576, 0]
        // rightHand_uvw = [-0.16270904103502398, 0.12967788232866576]
        
        // rightHand_uvw = [] 
    //

    // console.log(vectorFromPoints(rightHand_uvw, leftHand_uvw));
    // console.log(leftHand_uvw.length);

    function vectorAngle (vec1, vec2) {
        let result;
        if ((vec1.length === 2 && vec2.length === 2) || (vec1.length === 3 && vec2.length === 3)) {
            result = Math.acos( dotProduct(vec1,vec2) / (vectorLength(vec1) * vectorLength(vec2)) )
        } else {
            result = 'Invalid input.'
        };
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

// TRIGGER EVENT /////////////////////////////
    function gameStarted (e) {
        sceneState = 'bowAim';
        console.log(sceneState);
        leftHandAim(e);
        };
//

//
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

// TRIGGER EVENT /////////////////////////////
    
    function bowAimed (e) {
        sceneState = 'bowDraw';
        console.log(sceneState);        
        rightHandAim(e);
    };

//

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
            
            shotPreview();

    
            return rightHandScr, rightHand_uvw;
        }

    //


//



// BOW DRAW SECTION ////////////////////////////////////////////////////////
// This section contains creates an arrow flight preview based on user input.
    
    // Arrow flight plane
    // We create a plane with rightHand_uvw (arrow release position) as origin.
    // We'll need functions to transform between arrow plane coordinates to uvw, too.

    // HARDCODED VALUES FOR DEBUGGING PURPOSES - TO BE DELETED / COMMENTED OUT       
        // leftHand_uvw = {
        //     "u": 0.12967788232866576,
        //     "v": -0.12233762483836391,
        //     "w": 1.4
        // };
        // rightHand_uvw = {
        //     "u": 0.1406882685641185,
        //     "v": -0.16270904103502398,
        //     "w": 0.7
        // };
    //

    // Transform perspective (uvw) to arrowPlane (dh) [d - distance on horizontal plane, h - height]
        function perspectiveToArwPln (input_uvw) {
            let result = {d:0, h:0};
            result.d = Math.sqrt( Math.pow( (rightHand_uvw.u - input_uvw.u), 2) + Math.pow( (rightHand_uvw.w-input_uvw.w), 2) );
             
            result.h = input_uvw.v - rightHand_uvw.v;
            return result;
        };
        // console.log(perspectiveToArwPln(leftHand_uvw));

    //
    
    // Transform arrowPlane (dh) to perspective (uvw) [d - distance on horizontal plane, h - height]
        // We need to get the angle between | rH -> lH | vector projected to uw plane and | w | axis vector.        
        function arwPlnToPerspective (input_dh) {
            
            let result = {u: 0, v: 0, w: 0}
            // We calculate a horizontal projection of the release angle.
            let projectedArwVec;
            projectedArwVec = [arwVecAtRel[0], 0, arwVecAtRel[2]]; 
            let wAxis;
            wAxis = [0, 0, arwVecAtRel[2]];            
            let angle;            
            angle = vectorAngle(wAxis, projectedArwVec);

            // Now we can calculate u & w values of the point.
            let delta_u;
            let delta_v;
            let delta_w;

            delta_u = input_dh.d*Math.sin(angle);
            delta_w = input_dh.d*Math.cos(angle);

            if (leftHand_uvw.u < rightHand_uvw.u) {
                result.u = rightHand_uvw.u - delta_u;
                result.w = rightHand_uvw.w + delta_w;
            } else {
                result.u = rightHand_uvw.u + delta_u;
                result.w = rightHand_uvw.w + delta_w;
            };

            
            // Now we just need v value.
            delta_v = input_dh.h; // correct.
            result.v = rightHand_uvw.v + delta_v;            
            
            return result;
        };
        // console.log(arwPlnToPerspective(perspectiveToArwPln(leftHand_uvw)));

    //

    // arrowHead calculation

        function arrowHeadPos (arrowEndPos_dh, arwVec_dh) {
            let result = {d: 0, h: 0};
            result.d = arrowEndPos_dh.d + arwVec_dh[0];
            result.h = arrowEndPos_dh.h + arwVec_dh[1];
            return result;
        };

    // Now, we need to create a function that calculates the position of the arrow on arrowPlane.
                
        function arrowMotion(startPoint_dh, angle, v0, t) {
            let result = [];
            let v0x = v0 * Math.cos(angle);
            let v0y;
            
            if (leftHand_uvw.v >= rightHand_uvw.v) {
               v0y = v0 * Math.sin(angle);
            } else {
                v0y = - v0 * Math.sin(angle);
            }
          
            for (i = 0; i < t.length;) {
                let currentPosition = {d:0, h:0}; // SUPER IMPORTANT BASIC STUFF!! To get stuff out from the loop, we need to declare this variable in loop scope, not outside.
                
                // Displacement
                currentPosition.d = v0x * t[i] + startPoint_dh.d;
                // Height 
                currentPosition.h = v0y * t[i] - (g * Math.pow(t[i], 2) * 0.5) + startPoint_dh.h;
                i++;

                result.push(currentPosition) ;
            }            
            
            return result;
        };
    //

    // This function calculates time, when the arrow SHOULD arrive at tha target.
        // distance to cover:
        
        function timeAtTargetDist (startPoint_dh) {
            let timeAtTargetDistance;
            let targetPosition_dh = perspectiveToArwPln(targetPosition);
            timeAtTargetDistance = (targetPosition_dh.d - startPoint_dh.d) / v0;
            return timeAtTargetDistance;
        };

    // Shot preview function
        
        function shotPreview () {
            // First, we need to create the | rH -> lH | vector in uvw space.
            arwVecAtRel = vectorFromPoints(rightHand_uvw, leftHand_uvw); 

                        
            // Now, we need the vector of the arrow at release in dh coordinates
            let rightHand_dh = perspectiveToArwPln(rightHand_uvw);
            let leftHand_dh = perspectiveToArwPln(leftHand_uvw);
            
            let arwVecAtRel_dh = vectorFromPoints(rightHand_dh, leftHand_dh);
            arwVecAtRel_dh =  multiplyVector( arwVecAtRel_dh, ( arwLng / vectorLength (vectorFromPoints(rightHand_dh, leftHand_dh) ) ) ); // Now we need to change the magnitude of the vector to arwLength
            console.log(arwVecAtRel_dh);
            let arwHeadAtRel_dh = arrowHeadPos(rightHand_dh, arwVecAtRel_dh);
            // console.log(arwHeadAtRel_dh);

            // Now we calculate the trajectory of the END of the arrow.
            let arwAngAtRel_dh = vectorAngle([arwVecAtRel_dh[0], 0], arwVecAtRel_dh);
            let shotTrajectory_dh = arrowMotion(arwHeadAtRel_dh, arwAngAtRel_dh, v0, t);
            
            t = series(0, timeAtTargetDist(arwHeadAtRel_dh), shotPreviewSteps);
            //
                        
            shotTrajectory = [];
            for (i = 0; i < shotTrajectory_dh.length;) {
                shotTrajectory.push ( Object.values ( arwPlnToPerspective ( shotTrajectory_dh [i] ) ) ); 
                i++;
            }
            let arwHeadAtRel_uvw = Object.values ( arwPlnToPerspective(arwHeadAtRel_dh) );
            // console.log(arwHeadAtRel_uvw);
            
            display(shotTrajectory.flat(), trajectoryPoints, 'trajectory');
            display(arwHeadAtRel_uvw, arrowPoints, 'arrow-head');
                        
        };

//

// TRIGGER EVENT //////////////////////////////

    function bowReleased () {
        sceneState = 'arwFlight';
        console.log(sceneState);
    };

//

// ARROW FLIGHT SECTION ////////////////////////////////////////////////////////
// This section contains checks, where the arrow hit and displays an animation of the flight.

    // To simplify the calculations, we consider the arrow a single point, that starts from arrow TIP and reaches either target or the ground.
    // To do that, we need to calculate the tip position of the arrowTip in dh coordinates, and then plugging this position into our motion equations.
    
    // To check where the arrow hit, we need to calculate the intersectionPoint of the arrow horizontal vector & target plane in dh coordinates.
    // We'll figure out the height of this point by getting time when it arrived at target plane and then evaluating a simple motion equation.
    // Now we need to convert from dh to uvw.
    // We need to check the distance between target and intersectionPoint in uvw space, and now we know how far off the hit was.
    // If it was less than targetSize, the target was hit.
    // By simple division we can evaluate  how many points the player got.
    //
    // Else, if the distance was larger than targetSize, we go back to dh space and do another calculation.
    // From the motion equations in dh space, we need to calculate, when the arrow reached the height of -rightHandSet.
    // We need to get the point, where arrow was at that time and that is a groundHit position in dh space.
    //
    // Now we need to just create a shotTrajectory and display it.
    // To display it as an animation, we'll need to create a new function that creates a different "style" for each div on the flightpath
    // 
    // In the end we can change the animated point into a line of a couple dozen divs, but this can be left for later, because it's quite simple.
    // It will be just single point and a vector, with some trick to stop the arrow animation when the ARROWHEAD, not ARROWEND hits stuff.    

//




// TRIGGER EVENT //////////////////////////////

    function arrowHit () {
        sceneState = 'arwStopped';
        console.log(sceneState);
    };

//

// SCORE SECTION ////////////////////////////////////////////////////////
// This section displays score calculated in the previous section and gives player the option to exit.

// TRIGGER EVENT //////////////////////////////

    function continueGame () {
        sceneState = 'reload';
        console.log(sceneState);
    };

//

// RELOAD SECTION ////////////////////////////////////////////////////////

// TRIGGER EVENT //////////////////////////////

    function finishGame () {
        sceneState = 'gameOver';
        console.log(sceneState);
    };

//

// GAMEOVER SECTION ////////////////////////////////////////////////////////
