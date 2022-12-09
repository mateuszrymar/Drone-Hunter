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
    const perspective = {
        name: 'perspective',
    }

// Graphical elements
    const backGround = document.getElementById(background);
    const root = document.querySelector(':root');
    const gameArea = document.getElementById('game-area');
    const debugPoints = document.getElementById('debug-points');
    const target = document.getElementById('point-area-1');
    const ground = document.getElementById('ground');
    const leftHand = document.getElementById('left-hand');
    const rightHand = document.getElementById('right-hand');
    const trajectoryPoints = document.getElementById('trajectory-points'); 
    const arrowHeadPoints = document.getElementById('arrow-head-points'); 
    const arrowShaftPoints = document.getElementById('arrow-shaft-points'); 
    const arrowEndPoints = document.getElementById('arrow-end-points'); 
    const score = document.getElementById('score'); 
    const currentHit = document.getElementById('current-hit'); 
    const arrowAnimations = document.getElementById('released-arrows');
    const stationaryArrows = document.getElementById('stationary-arrows'); 
    const explosion_10 = document.getElementById('explosion-10'); 

    let totalScore = 0;
    let arrowId = 0;
    let targetSize = 1*1.22;
    let targetSizePixels;
    let targetPosition = {u: 0, v:(1.5-cameraHeight), w:30};
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
    let time = 0;  // time will start at arrow release.
    let slowMoFactor = 1.0; // this variable will be used to slow time for debug or fun.
    const arwLng = 0.85; // arrow length
    let arwSpdAtRel; // Arrow speed at release
    let arwSpd; // for storing current arrow speed
    let arwVecAtRel; // Arrow vector at release
    let arwVec; // for storing current arrow vector
    let arwHead;
    let arwEnd;
    let hitTime;
    
    // Bow parameters            
    let v0 = 30; // this will be a complex equation later.
    let shotPreviewSteps = 16;
    let arrowShaftPointsCount = 64;

    // Animation parameters
    let animation_fps = 30;

//

// Known bugs to fix:
    // 1. Arrows should have a variable z-index applied, based on w coordinate, so that they vanish behind the target.
    // 2. Desktop-specific event listeners to enable desktop browser support.
    // 3. Zooming in on mobile doesn't work as intended.
    // 4. Performance issues with 4+ arrows in the air simultaneously.
    // 5. Arrow spine doesn't have its spine width animated.
    // 6. All width variables should be parametrized, not specified locally.
    // 7. All variable declarations should be moved to the top.
    // 8. General code clean-up is needed.
    // 9. On mobile devices, unwanted arrow releases occur with double-tap or with very short swipes. Exact reason needs to be found.
    // 10. Target framerate is 60 fps. Should be achievable after optimizations.
    // 11. After turning the mobile screen to horizontal, the page needs a refresh. That can be super annoying if it happens mid-game!
    // 12. Hit scores sometimes display properly for 2.5s, but often (50% of the time) they just flash for a moment.
    // 13. DONE. Performance issues while aiming. Reason unknown. // Reason: SVG background melts the GPU.
    // 14. The target feels a few centimeters off to the top in relation to trajectory hint. Possible reasons:
    //      a) player's finger can move a little on release -> no fix needed.
    //      b) trajectory hint is wrong. -> fix
    //      c) displayed target position is wrong -> fix
    // 15. Target PNG's position should be paramatrized to scale and move according to target distance parameter.
    // 16. Make hitbox of the target bigger, so that the arrow gets stuck in the spaceship properly.
    
    
//

// Possible optimizations:
    // 1. All depth calculations can be made beforehand. We just need an array with width percentages at certain depths.
    // 2. Arrowheads should vanish after hitting the target / ground.
    // 3. Arrow animation function can be rewritten so that it skips some frames when overloaded.
    // 4. There are multiple points in the code, where a certain thing is calculated despite being calculated before.
    // 5. Suspect performance killers: display and loop functions. Some are calculating dozens of arrays, but could calculate just one,
    //    or have data passed from another function, that calculated sth earlier.

//

// Graphics features wishlist:
    // 1. DONE - UI, arrow & hands recoloring to match new art direction.
    // 2. Simple light FX after hitting "10".
    // 3. Target startup animation.
    // 4. Target after hit animation.
    // 5. Polish midground of the background image.
    // 6. Custom numbers after hits - images, not font.
    // 7. Static background animation.
    // 8. Special FX after hitting the target / ground.
    // 9. After getting new points, score counter should light up a little.
//

// Gameplay features wishlist:
    // 1. Start screen.
    // 2. End screen.
    // 3. Instructions on start screen.
    // 4. Name of the game.
    // 5. 2-3 different game modes.
    // 6. Add shop screen with bow and arrow upgrades.
    // 7. Equipment screen.
    // 8. Leaderboard.
    // 9. Streak mechanics after hitting 2+ "10s" in a row.
    // 10. Options screen.
    // 11. Credits screen.
    // 12. Move Debug switch to options.
//

// Sound features wishlist:
    // 0. Add sound switch.
    // 1. Sound FX on: bow draw, release, target hit, ground hit, 10 hit.
    // 2. Soundscape for the scene.
    // 3. Try if music works well or not.
    // 4. Add sound options.
//









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

// Create DOM element from string

    function createElementFromHTML(htmlString) {
        let div = document.createElement('div');
        div.innerHTML = htmlString.trim();
    
        return div.firstElementChild;
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

    function setVectorMagnitude (input_vector, num) {
        let result;
        let multiplier = num / vectorLength(input_vector);
        if (input_vector.length === 2 && input_vector.length === 2) {
            result = [input_vector[0] * multiplier, input_vector[1] * multiplier]; 
        } else if (input_vector.length === 3 && input_vector.length === 3) {
            result = [input_vector[0] * multiplier, input_vector[1] * multiplier, input_vector[2] * multiplier];
        } else {
            result = 'Invalid input.'
        };
        return result;
    }

    function distance (point1, point2) {
        let result;
        let pt1;
        let pt2;
        let isPt1Array = Array.isArray(point1);
        let isPt2Array = Array.isArray(point2);

        if (Array.isArray(point1)) {
            pt1 = point1;
        } else {
            pt1 = Object.values (point1);
        };

        if (Array.isArray(point2)) {
            pt2 = point2;
        } else {
            pt2 = Object.values (point2);
        };

        point1;
        if (pt1.length === 2 && pt2.length === 2) {
            result = Math.sqrt( Math.pow((pt2[0] - pt1[0]), 2) + Math.pow((pt2[1] - pt1[1]), 2));
        } else if (pt1.length === 3 && pt2.length === 3) {
            result = Math.sqrt( Math.pow((pt2[0] - pt1[0]), 2) + Math.pow((pt2[1] - pt1[1]), 2) + Math.pow((pt2[2] - pt1[2]), 2));
        } else {
            result = 'Invalid input.'
        };
        return result;
    };

    function crossProduct (vec1, vec2) {
        let result;
        if (vec1.length === 3 && vec2.length === 3) {
            result = [(vec1[1]*vec2[2] - vec1[2]*vec2[1]), (vec1[2]*vec2[0] - vec1[0]*vec2[2]), (vec1[0]*vec2[1] - vec1[1]*vec2[0])];
        } else {
            result = 'Invalid input.'
        };
        return result;
    };

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

    function interpolatePts (point1, point2, count) {
        let result = [];
        let stepX = ( point2[0] - point1[0] ) / ( count - 1 );
        let stepY = ( point2[1] - point1[1] ) / ( count - 1 );
        let stepZ = ( point2[2] - point1[2] ) / ( count - 1 );

        for ( i = 0; i < count; i++) {
            let point;
            point = [(point1[0] + stepX * [i]), (point1[1] + stepY * [i]), (point1[2] + stepZ * [i])];
            result.push(point); 
        }
        return result;
    }


    let a = 1;
    let b = 2;
    let c = -3;

    function solveQuadraticEquation (a, b, c) {
        let delta;
        let result1;
        let result2;
        let result;
        delta = Math.pow(b, 2) - 4 * a * c;
        if (delta > 0) {
            result1 = ( - b - Math.sqrt(delta)) / ( 2 * a );
            result2 = ( - b + Math.sqrt(delta)) / ( 2 * a );
            result = [result1, result2];
        } else if (delta = 0) {
            result = - b / ( 2 * a );
        } else {
            result = 'no solution';
        }
        return result;
    };

    // test = solveQuadraticEquation(a, b, c);
    // console.log(test);

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
            result = Math.acos( dotProduct(vec1,vec2) / ((vectorLength(vec1) * vectorLength(vec2))) )
        } else {
            result = 'Invalid input.'
        };
        return result;
    }

    function planeVecVecPt (vec_x=[], vec_y=[], origin=[]) {
        result = {type: 'plane', xAxis: [0, 0, 0], yAxis: [0, 0, 0], zAxis: [0, 0, 0], origin: [0, 0, 0]}; // this is the plane object format we'll be using.
        if (vectorAngle (vec_x, vec_y) === Math.PI/2) {
            result.type = 'plane';
            result.xAxis = vec_x;
            result.yAxis = vec_y;
            result.zAxis = crossProduct(vec_x, vec_y);
            result.origin = origin;
        } else {
            result = 'Invalid input.'
        };
        return result;
    };
    
    // test = vectorAngle([1, 0, 0], [0, 1, 0]);
    // console.log(test);
    // // vec = [0, 1, 0];
    // // console.log(vec.length)
    // console.log(planeVecVecPt ([-1, 0, 0], [0, 1, 0], [0, 0, 0]));
    
    function changeOrigin (plane, newOrigin) {
        let result = {type: 'plane', xAxis: [0, 0, 0], yAxis: [0, 0, 0], zAxis: [0, 0, 0], origin: [0, 0, 0]};
        if ((plane.type === 'plane' && newOrigin.length === 3) || (plane.type === 'plane' && newOrigin.length === 2)) {
            result.type = 'plane';
            result.xAxis = plane.xAxis;
            result.yAxis = plane.yAxis;
            result.zAxis = plane.zAxis;
            result.origin = newOrigin;
        } else {
            result = 'Invalid input.'
        };

        return result; 
    };

    function move (point, vector) {
        let result;
        let pt;

        if (Array.isArray(point)) {
            pt = point;
        } else {
            pt = Object.values(point);
        };

        if (vector.length === 2) {
            result = [pt[0] + vector [0], pt[1] + vector [1]];
        } else if (vector.length === 3) {
            result = [pt[0] + vector [0], pt[1] + vector [1], pt[2] + vector [2]];
        } else {
            result = 'Invalid input.'
        }
 

        return result; 
    };

//

// General graphic functions

    let arrowLine;

    function line (point1_xy, point2_xy, width, target_div, _class) {
        let result;
        let center;
        let style;
        let length;
        let angle;
        let correctionX = 0;
        let correctionY = 0;
        // We have an endpoint in screen coordinates. To calculate relative width of the arrow, we need to calculate its position to uvw space.
        point1_xy = Object.values(point1_xy);
        point2_xy = Object.values(point2_xy);

        length = distance(point1_xy, point2_xy);
        
        if (point1_xy[1] < point2_xy[1]) {
            angle = vectorAngle(vectorFromPoints(point1_xy, point2_xy), [1, 0]);
        } else {
            angle = -vectorAngle(vectorFromPoints(point1_xy, point2_xy), [1, 0]);
        }

        let correctionVec;
        correctionVec = vectorFromPoints(point1_xy, point2_xy);
        correctionVec = [-correctionVec[1], correctionVec[0]];
        correctionVec = setVectorMagnitude(correctionVec, (width)/2);

        result = `
            <div class="${_class}" style="
                position: absolute;
                top: ${point1_xy[1]}px;
                left: ${point1_xy[0]}px;
                height: ${width}px;
                width: ${length}px;
                transform-origin: 0px 0px;
                transform: translate(${-correctionVec[0]}px, ${-correctionVec[1]}px) rotate(${angle}rad);
                "></div>
                `;
        target_div.innerHTML = result;
        arrowLine = result;
        // return result;
    };

    // function line_uvw (point1_xy, point2_xy, width, target_div, _class) {
    //     let result;
    //     let center;
    //     let style;
    //     let length;
    //     let angle;
    //     let correctionX = 0;
    //     let correctionY = 0;
    //     // We have an endpoint in screen coordinates. To calculate relative width of the arrow, we need to calculate its position to uvw space.
    //     let endPt_xy = screenToImagePlane (point2_xy); 
    //     let endPt_uvw = imagePlaneToPerspective( endPt_xy, imagePlaneDepth) 
    //     let sizeRefPt = [endPt_uvw.u + width, endPt_uvw.v, endPt_uvw.w];
    //     point1_xy = Object.values(point1_xy);
    //     point2_xy = Object.values(point2_xy);

    //     length = distance(point1_xy, point2_xy);
        
    //     if (point1_xy[1] < point2_xy[1]) {
    //         angle = vectorAngle(vectorFromPoints(point1_xy, point2_xy), [1, 0]);
    //     } else {
    //         angle = -vectorAngle(vectorFromPoints(point1_xy, point2_xy), [1, 0]);
    //     }


    //     // Relative width calculation
        
        
    //     // console.log(sizeRefPt);

    //     console.log(endPt_uvw, sizeRefPt)
        
    //     let sizeRefPtOnImagePlane = perspectiveToImagePlane(sizeRefPt, imagePlaneDepth);
    //     console.log(endPt_xy, sizeRefPtOnImagePlane);
    //     let sizeScale = distance(endPt_xy, sizeRefPtOnImagePlane);
    //     console.log(sizeScale);
    //     // let initialSize = distance(perspectiveToImagePlane([0,0,imagePlaneDepth], imagePlaneDepth), perspectiveToImagePlane( [size, 0, imagePlaneDepth] , imagePlaneDepth));
    //     let currentSize = Math.ceil(sizeScale * width);

    //     let correctionVec;
    //     correctionVec = vectorFromPoints(point1_xy, point2_xy);
    //     correctionVec = [-correctionVec[1], correctionVec[0]];
    //     correctionVec = setVectorMagnitude(correctionVec, ((width)/2)*currentSize);

    //     result = `
    //         <div class="${_class}" style="
    //             position: absolute;
    //             top: ${point1_xy[1]}px;
    //             left: ${point1_xy[0]}px;
    //             height: ${width * currentSize}px;
    //             width: ${length}px;
    //             transform-origin: 0px 0px;
    //             transform: translate(${-correctionVec[0]}px, ${-correctionVec[1]}px) rotate(${angle}rad);
    //             "></div>
    //             `;
    //     target_div.innerHTML = result;
    //     // return result;
    // };

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
            let input_u;
            let input_v;
            let input_w;

            // console.log(input_uvw);
            if (Array.isArray(input_uvw)) {
                input_u = input_uvw[0];
                input_v = input_uvw[1];
                input_w = input_uvw[2];
            } else {
                input_u = input_uvw.u;
                input_v = input_uvw.v;
                input_w = input_uvw.w;
            }
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

    let pointOnScreen;
    let pointOnScreenDiv;

    function display (pointArray, targetDiv, divClass, size) {
        let pointCollection = '';
        for (let i = 0; i < (pointArray.length / 3); i++) {
            // I have coordinates of a point in perspective coordinates:
            let pointInPerspective = pointArrayToObjects(pointArray)[i];
            
            let pointOnImagePlane;
            // Now I need to find its position on the screen:
            pointOnImagePlane = perspectiveToImagePlane(pointInPerspective, imagePlaneDepth);
            pointOnScreen = imagePlaneToScreen(pointOnImagePlane);
            
            // console.log(pointInPerspective);
            let sizeRefPt = [pointInPerspective.u + size, pointInPerspective.v, pointInPerspective.w];
            // console.log(sizeRefPt);

            let sizeRefPtOnImagePlane = perspectiveToImagePlane(sizeRefPt, imagePlaneDepth);
            let sizeScale = distance(pointOnImagePlane, sizeRefPtOnImagePlane) / size;
            // let initialSize = distance(perspectiveToImagePlane([0,0,imagePlaneDepth], imagePlaneDepth), perspectiveToImagePlane( [size, 0, imagePlaneDepth] , imagePlaneDepth));
            let currentSize = Math.ceil(sizeScale * size);
    
            let pointDiv = `
            <div class="${divClass}" style="
            top: ${pointOnScreen.Ys}px;
            left: ${pointOnScreen.Xs}px;
            width: ${currentSize}px;
            height: ${currentSize}px;            
            transform: translate(-${currentSize/2}px, -${currentSize/2}px);
            "</div>
            `;
            
            pointCollection = `${pointCollection} ${pointDiv}`;
            // console.log(pointCollection);

            pointOnScreenDiv = pointDiv;
        }
        targetDiv.innerHTML = pointCollection;        
    }

    function clearDisplay (targetDiv) {
        targetDiv.innerHTML = null;
    }

    function displayTrajectory (pointArray, targetDiv, divClass) {
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

//









// USER INTERFACE SECTION ////////////////////////////////////////////////////////
// This section contains all UI elements.

    // Debug mode
    function toggle(e) {
        debugMode = debugToggle.checked
        if (debugMode === true) {
            debugStateLabel.innerHTML = `Debug: ON`;
            console.log('Debug: ON');
            display(testValues, debugPoints, 'test-point', 1, false);
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
            if (Array.isArray(input_uvw)) {
                // console.log('array')
                result.d = Math.sqrt( Math.pow( (rightHand_uvw.u - input_uvw[0]), 2) + Math.pow( (rightHand_uvw.w-input_uvw[2]), 2) );
                result.h = input_uvw[1] - rightHand_uvw.v;
            } else {
                // console.log('object')
                result.d = Math.sqrt( Math.pow( (rightHand_uvw.u - input_uvw.u), 2) + Math.pow( (rightHand_uvw.w-input_uvw.w), 2) );
                result.h = input_uvw.v - rightHand_uvw.v;
            }
            return result;
        };

    //
    
    // Transform arrowPlane (dh) to perspective (uvw) [d - distance on horizontal plane, h - height]
        // We need to get the angle between | rH -> lH | vector projected to uw plane and | w | axis vector.        
        let horizRelAng_uvw;
        
        function arwPlnToPerspective (input_dh) {
            
            let result = {u: 0, v: 0, w: 0}
            // We calculate a horizontal projection of the release angle.
            let projectedArwVec;
            projectedArwVec = [arwVecAtRel[0], 0, arwVecAtRel[2]]; 
            let wAxis;
            wAxis = [0, 0, arwVecAtRel[2]];            
            let angle;            
            angle = vectorAngle(wAxis, projectedArwVec);
            horizRelAng_uvw = angle;

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
                
        function arrowMotion(startPoint_dh, angle, v0, t=[]) {
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

    // Arrow End evaluation

        function velocityVec (v0, angle, time) {
            let result;
            let vx;
            let vy;
            let v0x = v0 * Math.cos(angle);
            let v0y;
            if (leftHand_uvw.v >= rightHand_uvw.v) {
                v0y = v0 * Math.sin(angle);
            } else {
                v0y = - v0 * Math.sin(angle);
            };

            vx = v0x;
            vy = v0y - (g * time);

            result = [vx, vy];

            return result;
        };
    //


    // This function calculates time, when the arrow SHOULD arrive at tha target.
        // distance to cover:
        
        
        function timeAtDist (startPoint_dh, distance, angle) {
            let timeAtTargetDistance;
            let v0x = v0 * Math.cos(angle);
            timeAtTargetDistance = (distance - startPoint_dh.d) / v0x;
            return timeAtTargetDistance;
        }; 
    //

    // This function calculates time, when the arrow SHOULD hit the ground.

        function timeAtHeight (height, angle, initialV) {
            let result;
            let v0y;
            if (leftHand_uvw.v >= rightHand_uvw.v) {
                v0y = initialV * Math.sin(angle);
            } else {
                v0y = - initialV * Math.sin(angle);
            }
            
            // We need to transform this equation to solve it:
            // 0 = v0y * t - (g * Math.pow(t, 2) * 0.5) + (startPoint_dh.h + height);
            // Quadratic equation looks like this:
            // -gt^2/2 + v0y*t + (startPoint_dh.h + height) = 0
            // ,hence:

            let a = -g/2;
            let b = v0y;
            let c = height;

            // console.log(a,b,c);
            result = solveQuadraticEquation(a,b,c);
            // console.log(result);
            return result;
        };

        // test = timeAtHeight(68, (67/180)*Math.PI, 29);
        // console.log(test);

        
    //


    // Shot preview function
        
        let arwVecAtRel_dh;
        let arwHeadAtRel_dh;
        let arwAngAtRel_dh;
        let arwHeadAtRel_uvw;
        let arwEndAtRel_dh;
        let arwEndAtRel_uvw;
        let rightHand_dh;
        let leftHand_dh
        
        function shotPreview () {
            // First, we need to create the | rH -> lH | vector in uvw space.
            arwVecAtRel = vectorFromPoints(rightHand_uvw, leftHand_uvw); 

                        
            // Now, we need the vector of the arrow at release in dh coordinates
            rightHand_dh = perspectiveToArwPln(rightHand_uvw);
            leftHand_dh = perspectiveToArwPln(leftHand_uvw);
            
            arwVecAtRel_dh = vectorFromPoints(rightHand_dh, leftHand_dh);
            arwVecAtRel_dh =  multiplyVector( arwVecAtRel_dh, ( arwLng / vectorLength (vectorFromPoints(rightHand_dh, leftHand_dh) ) ) ); // Now we need to change the magnitude of the vector to arwLength
            arwHeadAtRel_dh = arrowHeadPos(rightHand_dh, arwVecAtRel_dh);

            // VERY IMPORTANT!
            // Now we shift coordinate system to the ARROWHEAD. From now on, all calculations regarding arrow flight will be calculated in "dhAtArwHead" coordinate system.
            // console.log(arwHeadAtRel_dh);
            let dhPln = planeVecVecPt([arwVecAtRel_dh[0], 0], [0, 1], [0, 0]);
            // console.log(dhPln);
            let dhPlnAtArwHead = changeOrigin(dhPln, Object.values(arwHeadAtRel_dh))
            // console.log(dhPlnAtArwHead);
            
            // Now we calculate the trajectory of the HEAD of the arrow.
            arwAngAtRel_dh = vectorAngle([arwVecAtRel_dh[0], 0], arwVecAtRel_dh);
            // console.log(arwAngAtRel_dh);
            // console.log({d: 0, h: arwHeadAtRel_dh.h});
            let targetPosition_dh = perspectiveToArwPln(targetPosition);
            // console.log(targetPosition_dh);
            t = series(0, timeAtDist(arwHeadAtRel_dh, targetPosition_dh.d, arwAngAtRel_dh), shotPreviewSteps);
            let shotTrajectory_dh = (arrowMotion(arwHeadAtRel_dh, arwAngAtRel_dh, v0, t));
            // console.log(shotTrajectory_dh);
            // Checked to this point. Should be ok up till now.
            // Displayed trajectory seems correct, but values passed for hit evaluation look wrong.
            // We need to check if we pass last point of preview trajectory as a hit Result for evaluation.

            shotTrajectory = [];
            for (i = 0; i < shotTrajectory_dh.length;) {
                shotTrajectory.push ( Object.values ( arwPlnToPerspective ( shotTrajectory_dh [i] ) ) ); 
                i++;
            }
            // console.log(shotTrajectory)
                       
            arwHeadAtRel_uvw = Object.values ( arwPlnToPerspective(arwHeadAtRel_dh) );            
            // Now we'll calculate arrow end position.
            arwEndAtRel_uvw = Object.values (rightHand_uvw);

            // We'll calculate arrowshaft here.
            let arrowShaftAtRel;
            arrowShaftAtRel = interpolatePts(arwEndAtRel_uvw, arwHeadAtRel_uvw, arrowShaftPointsCount);
            
            displayTrajectory(shotTrajectory.flat(), trajectoryPoints, 'trajectory');
            // console.log(shotTrajectory.flat());
            display(arwHeadAtRel_uvw, arrowHeadPoints, 'arrow-head', 250, false);
            display(arwEndAtRel_uvw, arrowEndPoints, 'arrow-end', 250, false);
            line(Object.values(imagePlaneToScreen(perspectiveToImagePlane(arwEndAtRel_uvw, imagePlaneDepth))), 
                 Object.values(imagePlaneToScreen(perspectiveToImagePlane(arwHeadAtRel_uvw, imagePlaneDepth))), 
                 8, arrowShaftPoints, 'arrow-shaft');


            

            

            // return arwVecAtRel_dh;                        
        };

        // console.log(arwVecAtRel_dh);

//

// TRIGGER EVENT //////////////////////////////

    function bowReleased () {
        sceneState = 'arwFlight';
        console.log(sceneState);
        console.log(`Arrow no:${arrowId}`);
        clearDisplay(trajectoryPoints);
        clearDisplay(arrowHeadPoints);
        clearDisplay(arrowEndPoints);
        clearDisplay(arrowShaftPoints);
        evalHit(arrowId);
        animateArrow(arwHeadAtRel_dh, hitTime, arrowId);
        arrowId++;
        //animFlight();
    };

//

// ARROW FLIGHT SECTION ////////////////////////////////////////////////////////
// This section contains checks, where the arrow hit and displays an animation of the flight.

    // To simplify the calculations, we consider the arrow a single point, that starts from arrow TIP and reaches either target or the ground. OK
    // To do that, we need to calculate the tip position of the arrowTip in dh coordinates, and then plugging this position into our motion equations. DONE
    
    // To check where the arrow hit, we need to calculate the intersectionPoint of the arrow horizontal vector & target plane in dh coordinates. DONE
    // We'll figure out the height of this point by getting time when it arrived at target plane and then evaluating a simple motion equation. DONE
    // Now we need to convert from dh to uvw. DONE
    // We need to check the distance between target and intersectionPoint in uvw space, and now we know how far off the hit was. DONE
    // If it was less than targetSize, the target was hit. DONE
    // By simple division we can evaluate  how many points the player got. DONE
    //
    // Else, if the distance was larger than targetSize, we go back to dh space and do another calculation. OK
    // From the motion equations in dh space, we need to calculate, when the arrow reached the height of -arwHeightAtRel. DONE
    // We need to get the point, where arrow was at that time and that is a groundHit position in dh space.
    //
    // Now we need to just create a shotTrajectory and display it.
    // To display it as an animation, we'll need to create a new function that creates a different "style" for each div on the flightpath
    // 
    // In the end we can change the animated point into a line of a couple dozen divs, but this can be left for later, because it's quite simple.
    // It will be just single point and a vector, with a condition to stop the arrow animation when the ARROWHEAD, not ARROWEND hits stuff.    

//

// Hit evaluation function
    let arwHeadHit;
    let arwEndHit;
    let pointResults = [];
    
    function evalHit (arrowId) {
        arwVecAtRel_dh;
        horizRelAng_uvw;
        
        let pointResult = {id: 0, result: 0};
        let delta_u;
        let delta_v;
        let delta_w;
        let d;
        let time;
        let intersectionPoint_dh;
        let intersectionPoint_uvw;
        let groundHit_dh;
        let groundHit_uvw;
        let uniqueArrowId = arrowId;
        pointResult.id = uniqueArrowId;



        // Tis value is the distance the arrow travels along wAxis, until it reaches target plane:
        delta_w = targetPosition.w - rightHand_uvw.w; // It doesn't compensate for arrow length.
        delta_u = delta_w / Math.tan(Math.PI/2 - horizRelAng_uvw);
        d = Math.sqrt(Math.pow(delta_u, 2) + Math.pow(delta_w, 2)) - vectorLength([arwVecAtRel_dh[0], 0]); // we compensate for arrow length here.
        time = timeAtDist(arwHeadAtRel_dh, d, arwAngAtRel_dh);

        intersectionPoint_dh = arrowMotion(arwHeadAtRel_dh, arwAngAtRel_dh, v0, [time]);
        intersectionPoint_dh = intersectionPoint_dh[0];
        intersectionPoint_dh.d = (intersectionPoint_dh.d + vectorLength([arwVecAtRel_dh[0], 0]));
        
        // Now we have the intersectionPoint in uvw space!
        intersectionPoint_uvw = arwPlnToPerspective(intersectionPoint_dh);
        // console.log(intersectionPoint_dh);

        // Let's check how far off it was.
        let offTarget;

        offTarget = distance (targetPosition, intersectionPoint_uvw);
        // console.log(offTarget);

        if (offTarget <= targetSize/2) {
            let pointAreaSize = targetSize / 20;
            pointResult.result = Math.ceil(( targetSize / 2 - offTarget) / pointAreaSize);
            totalScore = totalScore + pointResult.result;
            arwHeadHit = intersectionPoint_uvw;
            console.log('Target hit. Result: ', pointResult.result, ' points.');
        } else {
            console.log('Ground hit.');
            pointResult.result = 0;
            let distToGroundAtRel;
            
            distToGroundAtRel = (cameraHeight + arwHeadAtRel_uvw[1]);
            time = timeAtHeight(distToGroundAtRel, arwAngAtRel_dh, v0)[0];
            groundHit_dh = arrowMotion(arwHeadAtRel_dh, arwAngAtRel_dh, v0, [time]);
            groundHit_dh = groundHit_dh[0];
            groundHit_uvw = arwPlnToPerspective(groundHit_dh);
            arwHeadHit = groundHit_uvw;
        }
        hitTime = time;
        pointResults.push(pointResult);

    };
//

// Calculation of arrowHead and arrowEnd positions at a given time

    let startTime;
    let arwHeadDiv;
    let arwEndDiv;    
    
    function animateArrow (startPoint, hitTime, arrowId) {
        let timeStep = (1 / animation_fps);
        let animFrameCount = Math.ceil(hitTime/timeStep);
        let timeArray = series(0, hitTime, animFrameCount);
        let arwHeadTrajectory_dh = arrowMotion(arwHeadAtRel_dh, arwAngAtRel_dh, v0, timeArray);
        // console.log(timeArray);
        
        // let arwEndTrajectory_dh = arrowMotion(rightHand_dh, arwAngAtRel_dh, v0, timeArray);
        let arwHead;
        let arwEnd;
        let arwShaft;
        let uniqueArrowId = arrowId;
        
        let arwHeadTrajectory = [];
        let arwEndTrajectory = [];
        let arwShaftTrajectory = [];

        for (i = 0; i < arwHeadTrajectory_dh.length;) {
            arwHead = Object.values ( arwPlnToPerspective ( arwHeadTrajectory_dh [i] ) );
            arwHeadTrajectory.push ( arwHead );

            // Here we'll calculate arrow vector at a given frame.
            let arwVec = setVectorMagnitude( velocityVec(v0, arwAngAtRel_dh, timeArray[i]), (arwLng * (-1)) ) ;
            arwEnd = move (Object.values(arwHeadTrajectory_dh [i]), arwVec);
            arwEnd = Object.values ( arwPlnToPerspective ( {d: arwEnd[0], h: arwEnd[1]} ) );
            arwEndTrajectory.push ( arwEnd );

            i++;
        };        

        if (sceneState = 'arwFlight') {
            let i=0;

            // We need to create AH, AE, L inside a unique div:              
                let arrowDiv = createElementFromHTML(
                    `<div id="arrow-${uniqueArrowId}">
                    </div>`);
                arrowAnimations.append(arrowDiv);                
                let currentArrowDiv = document.getElementById(`arrow-${uniqueArrowId}`);
                let scorePosition = imagePlaneToScreen ( perspectiveToImagePlane (arwEnd, imagePlaneDepth) );
                currentArrowDiv.append(
                    createElementFromHTML(`<div id="arrow-head-${uniqueArrowId}"></div>`) ,
                    createElementFromHTML(`<div id="arrow-end-${uniqueArrowId}"></div>`) ,
                    createElementFromHTML(`<div id="arrow-shaft-${uniqueArrowId}"></div>`) ,
                    createElementFromHTML(`<div id="arrow-points-${uniqueArrowId}" class="hit-score" style="top: ${scorePosition.Ys-16}px; left: ${scorePosition.Xs-13}px"></div>`) ,
                );
            //

            let animation = setInterval ( function () {
                i = i+1;           
                
                if (i >= animFrameCount) {
                    clearInterval(animation);
                    displayScore (uniqueArrowId);
                    arrowHit (uniqueArrowId);
                    return;
                }              
                
                let arrowHeads = document.getElementById(`arrow-head-${uniqueArrowId}`);
                let arrowEnds = document.getElementById(`arrow-end-${uniqueArrowId}`);
                let arrowShafts = document.getElementById(`arrow-shaft-${uniqueArrowId}`);
                    

                display(arwHeadTrajectory[i], arrowHeads, 'arrow-head', 250 , false);
                arwHead = pointOnScreen;
                arwHeadDiv = pointOnScreenDiv;
                
                display(arwEndTrajectory[i], arrowEnds, 'arrow-end', 250 , false);
                arwEnd = pointOnScreen;
                arwEndDiv = pointOnScreenDiv;

                line (arwEnd, arwHead, 2, arrowShafts, 'arrow-shaft' );

                
                
            }, (timeStep * slowMoFactor * 1000));
        }

        
        
    }

//

// Display score at the point where arrow hit

    function displayScore (arrowId) {
        let i = arrowId;
        let div = document.getElementById(`arrow-points-${arrowId}`);
        div.innerHTML = pointResults[i].result;
    }

//

// Display a special effect when 10 is hit

    function displayExplosion_10 (arrowId) {
        let i = arrowId;
        if (pointResults[i].result >= 10) {
            explosion_10.style.opacity = `100%`;
            setTimeout(() => {
                explosion_10.style.opacity = `0%`;
            }, "400")
        } else {
            return;
        };
    }

//

// TRIGGER EVENT //////////////////////////////

    function arrowHit (uniqueArrowId) {
        sceneState = 'arwStopped';
        score.innerHTML = `Score: ${totalScore}`;
        displayScore (uniqueArrowId);
        displayExplosion_10(uniqueArrowId);
        // console.log(pointResults)
        // currentHit.innerHTML = `${pointResult}`

        // let scoreDiv = createElementFromHTML(
        //     `<div id="arrow-score-${uniqueArrowId}" class="hit-score" style="">
        //     </div>`);
        // stationaryArrows.appendChild(arrowDiv);
        // let currentArrowDiv = document.getElementById(`stationary-arrow-${uniqueArrowId}`);
        // currentArrowDiv.append(createElementFromHTML(arwEndDiv) , createElementFromHTML(arrowLine) );


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
