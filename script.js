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
    const gameArea = document.getElementById('game-area');
    const debugPoints = document.getElementById('debug-points');
    const target = document.getElementById('point-area-1');
    const ground = document.getElementById('ground');
    const leftHand = document.getElementById('left-hand');

    let targetSize = 1.22;
    let targetDistance = 30;
    let targetHeight = 1.2;
    
    let debugMode;
    let leftHandPosition;
    let leftHandSize = getComputedStyle(leftHand).getPropertyValue('--left-hand-size');
        leftHandSize = leftHandSize.slice(0, -2);
        leftHandSize = Number(leftHandSize);
    let originPosition = {
        X: Number (getComputedStyle(target).getPropertyValue('left').slice(0, -2)),
        Y: Number (getComputedStyle(sky).getPropertyValue('height').slice(0, -2))
    }    
    
    // Player input
    let leftHandSet = {
        Xs:0,
        Ys:0,
    };
    let leftHandDistance = 1.4;
    let rightHandDistance = 0.7;
    
    // Debug mode - specific variables
    const testValues = 
        [0, 30, 0,
            10.800665, 30, 0,
            -10.800665, 30, 0,
            0, 30, 1.2,
            0.61, 30, 1.2,
            -0.61, 30, 1.2            
            ]
    
    // const testPoints = {id:0, u:0, v:10, w:-cameraHeight}

//


// Add event listeners
    debugToggle.addEventListener('click', toggle);
    gameArea.addEventListener('mousedown', leftHandAim);
//

// Debug mode toggle
    function toggle(e) {
        debugMode = debugToggle.checked
        if (debugMode === true) {
            debugStateLabel.innerHTML = `Debug: ON`;
            console.log('Debug: ON');
        } else {
            debugStateLabel.innerHTML = `Debug: OFF`;
            console.log('Debug: OFF');
        }
        return debugMode
    }
    console.log(debugMode);
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

    // console.log(pointArrayToObjects(testValues));

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
            
            /* IF w=0, the function doesn't work because of division by zero. FIX IT!
            if (input_w === 0){
                

            } else {
                
            }*/

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

        // function perspectiveToScreen (input_uvw) {
        //     //imagePlaneToScreen(
        //         perspectiveToImagePlane (input_uvw);
        //         //);
        // }



//

// Display function
    // This function takes as an input an array of perspective points,
    // it projects these points onto browser screen,
    // and assigns divs of a given class to them.

    let groundPts = pointArrayToObjects(testValues);
    // console.log(groundPts);
    
    function display (pointArray, divClass) {
        let pointCollection = '';
        for (let i = 0; i < (pointArray.length / 3); i++) {
            // I have coordinates of a point in perspective coordinates:
            let pointInPerspective = groundPts[i];
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
        debugPoints.innerHTML = pointCollection;        
    }

    display(testValues, 'test-point');
//

// Target size & position calculation

    // Target size calculation:
        targetSize;
        targetDistance;
        targetHeight;


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

// Left Hand Aim

    function leftHandAim(e) {
        leftHand.style.left = `${e.clientX-leftHandSize/2}px`;
        leftHand.style.top = `${e.clientY-leftHandSize/2}px`;
        leftHandSet.Xs = e.clientX;
        leftHandSet.Ys = e.clientY;
        console.log(leftHandSet);
       
        let ipCoordinates = {
            x: screenToImagePlane(leftHandSet).x,
            y: screenToImagePlane(leftHandSet).y,
            z: imagePlane.depth,
        }

        
        let ppCoordinates = {
            u: imagePlaneToPerspective(ipCoordinates, leftHandDistance).u,
            v: imagePlaneToPerspective(ipCoordinates, leftHandDistance).v,
            w: leftHandDistance,
        }

        let ipRtrnCoords = perspectiveToImagePlane(ppCoordinates, imagePlaneDepth);

        let scrnRtrnCoords = imagePlaneToScreen(ipRtrnCoords);
        
        if (debugMode === true) {
            leftHand.innerHTML = `
            <span class="debug-text">
                ${screen.name}:<br>
                ${e.clientX},<br>
                ${e.clientY}
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
        }

        return leftHandSet;
    }

    // leftHandAim();

//
