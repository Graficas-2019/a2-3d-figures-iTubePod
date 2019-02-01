/*
    Hector Mauricio Gonzalez Coello
    A01328258
    ITC
*/
var projectionMatrix;

var shaderProgram, shaderVertexPositionAttribute, shaderVertexColorAttribute, 
    shaderProjectionMatrixUniform, shaderModelViewMatrixUniform;

var duration = 5000; // ms

// Attributes: Input variables used in the vertex shader. Since the vertex shader is called on each vertex, these will be different every time the vertex shader is invoked.
// Uniforms: Input variables for both the vertex and fragment shaders. These do not change values from vertex to vertex.
// Varyings: Used for passing data from the vertex shader to the fragment shader. Represent information for which the shader can output different value for each vertex.
var vertexShaderSource =    
    "    attribute vec3 vertexPos;\n" +
    "    attribute vec4 vertexColor;\n" +
    "    uniform mat4 modelViewMatrix;\n" +
    "    uniform mat4 projectionMatrix;\n" +
    "    varying vec4 vColor;\n" +
    "    void main(void) {\n" +
    "		// Return the transformed and projected vertex value\n" +
    "        gl_Position = projectionMatrix * modelViewMatrix * \n" +
    "            vec4(vertexPos, 1.0);\n" +
    "        // Output the vertexColor in vColor\n" +
    "        vColor = vertexColor;\n" +
    "    }\n";

// precision lowp float
// This determines how much precision the GPU uses when calculating floats. The use of highp depends on the system.
// - highp for vertex positions,
// - mediump for texture coordinates,
// - lowp for colors.
var fragmentShaderSource = 
    "    precision lowp float;\n" +
    "    varying vec4 vColor;\n" +
    "    void main(void) {\n" +
    "    gl_FragColor = vColor;\n" +
    "}\n";

function initWebGL(canvas)
{
    var gl = null;
    var msg = "Your browser does not support WebGL, " +
        "or it is not enabled by default.";
    try 
    {
        gl = canvas.getContext("experimental-webgl");
    } 
    catch (e)
    {
        msg = "Error creating WebGL Context!: " + e.toString();
    }

    if (!gl)
    {
        alert(msg);
        throw new Error(msg);
    }

    return gl;        
 }

function initViewport(gl, canvas)
{
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function initGL(canvas)
{
    // Create a project matrix with 45 degree field of view
    projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 10000);
}
// TO DO: Create the functions for each of the figures.
function createDodecahedron(gl, translation, rotationAxis1, rotationAxis2)
{    
    var buffer;
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    var verts = [
        1.8,    0.0,    0.8,	
    	1.8,    0.0,    -0.8,	
    	1.0,    1.0,    1.0,		
    	1.0,    1.0,    -1.0,		
    	0.8,    1.8,    0.0,	

        0.0,    -0.8,   1.8,	
		1.0,    -1.0,   1.0,		
		0.0,    0.8,    1.8,	
    	1.8,    0.0,    0.8,	
    	1.0,    1.0,    1.0,		

        -1.0,   1.0,    1.0,		
    	0.0,    0.8,    1.8,	
    	-0.8,   1.8,    0.0,	
    	1.0,    1.0,    1.0,		
    	0.8,    1.8,    0.0,	

        -0.8,   1.8,    0.0,	
    	0.8,    1.8,    0.0,	
    	-1.0,   1.0,    -1.0,	
    	1.0,    1.0,    -1.0,		
    	0.0,    0.8,    -1.8,		

        1.0,    -1.0,    1.0,		
    	0.8,    -1.8,    0.0,	
    	1.8,    0.0,     0.8,	
    	1.0,    -1.0,    -1.0,	
    	1.8,    0.0,     -0.8,	

        0.0,    -0.8,   -1.8,	
    	0.0,    0.8,    -1.8,		
    	1.0,    -1.0,   -1.0,	
    	1.0,    1.0,    -1.0,		
    	1.8,    0.0,    -0.8,	
    	
        -1.8,   0.0,    -0.8,
    	-1.0,-  1.0,    -1.0,		
    	-1.0,   1.0,    -1.0,	
    	0.0,    -0.8,   -1.8,	
    	0.0,    0.8,    -1.8,		

        -0.8,   1.8,    0.0,	
    	-1.0,   1.0,    -1.0,	
    	-1.0,   1.0,    1.0,		
    	-1.8,   0.0,    -0.8,	
    	-1.8,   0.0,    0.8,	

        0.0,    -0.8,    1.8,	
    	0.0,    0.8,     1.8,	
    	-1.0,   -1.0,    1.0,	
    	-1.0,   1.0,     1.0,		
    	-1.8,   0.0,     0.8,	

        0.0,    -0.8,   1.8,	
    	-1.0,   -1.0,   1.0,	
    	1.0,    -1.0,   1.0,		
    	-0.8,   -1.8,   0.0,	
    	0.8,    -1.8,   0.0,	

        1.0,    -1.0,   -1.0,	
    	0.8,    -1.8,   0.0,	
    	0.0,    -0.8,   -1.8,	
    	-0.8,   -1.8,   0.0,	
    	-1.0,   -1.0,   -1.0,		

        -1.8,    0.0,   -0.8,	
    	-1.0,   -1.0,   -1.0,		
    	-1.8,    0.0,    0.8,	
    	-0.8,   -1.8,    0.0,	
    	-1.0,    -1.0,   1.0		
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    var colorsArray =[
        [0.0, 0.0, 1.0, 1.0],
        [0.0, 1.0, 0.0, 1.0],
        [1.0, 0.0, 0.0, 1.0],
        [1.0, 1.0, 0.0, 1.0],
        [0.0, 1.0, 1.0, 1.0],
        [1.0, 0.0, 1.0, 1.0],
        [1.0, 1.0, 1.0, 1.0],
        [0.5, 0.5, 0.0, 1.0],
        [0.5, 1.0, 1.0, 1.0],
        [1.0, 1.0, 0.0, 1.0],
        [0.0, 1.0, 0.5, 1.0],
        [1.0, 1.0, 0.5, 1.0]
    ];

    var colorsVertex = [];

    for (const color of colorsArray) 
    {
        for (var j=0; j < 5; j++)
            colorsVertex = colorsVertex.concat(color);
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorsVertex), gl.STATIC_DRAW);

    var dodecahedronIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, dodecahedronIndexBuffer);
    //index array by faces
    var index = [
       0,1,3,       0,3,4,      0,2,4,
       5,6,8,       5,8,9,      5,7,9,
       10,11,13,    10,13,14,   10,12,14,
       15,16,18,    15,18,19,   15,17,19,
       20,21,23,    20,23,24,   20,22,24,
       25,26,28,    25,28,29,   25,27,29,
       30,31,33,    30,33,34,   30,32,34,
       35,36,38,    35,38,39,   35,37,39,
       40,41,43,    40,43,44,   40,42,44,
       45,46,48,    45,48,49,   45,47,49,
       50,51,53,    50,53,54,   50,52,54,
       55,56,58,    55,58,59,   55,57,59
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);
    
    var dodecahedron = {    buffer:buffer, colorBuffer:colorBuffer, indices:dodecahedronIndexBuffer,
                            vertSize:3, nVerts:verts.length, colorSize:4, nColors: verts.length,
                            nIndices:index.length, primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(),
                            currentTime : Date.now()};

    mat4.translate(dodecahedron.modelViewMatrix, dodecahedron.modelViewMatrix, translation);

    dodecahedron.update = function()
    {
        var now = Date.now();
        var deltat = now - this.currentTime;
        this.currentTime = now;
        var speed = deltat / duration;
        var angle = Math.PI * 2 * speed;

        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis1);
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis2);
    };
    
    return dodecahedron;
}
function createPyramid(gl, translation, rotationAxis)
{    
    var buffer;
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    var numOfFaces = 5;
    var verts = [];
    
    //start drawing pyramid
    verts.push(Math.cos(1 *2* Math.PI/numOfFaces), -1.0,  Math.sin(1 *2* Math.PI/numOfFaces));
    verts.push(0.0,  1.0,  0.0);
    for(var i = 2; i<=5; i++)
    {
        verts.push(Math.cos(i *2* Math.PI/numOfFaces), -1.0,  Math.sin(i *2* Math.PI/numOfFaces));
        verts.push(Math.cos(i *2* Math.PI/numOfFaces), -1.0,  Math.sin(i *2* Math.PI/numOfFaces));
        verts.push(0.0,  1.0,  0.0,);
    }
    verts.push(Math.cos(1 *2* Math.PI/numOfFaces), -1.0,  Math.sin(1 *2* Math.PI/numOfFaces));
    verts.push(Math.cos(1 *2* Math.PI/numOfFaces), -1.0,  Math.sin(1 *2* Math.PI/numOfFaces));
    verts.push(0.0,  1.0,  0.0);
    for(var i = 2; i<=5; i++)
    {
        verts.push(Math.cos(i *2* Math.PI/numOfFaces), -1.0,  Math.sin(i *2* Math.PI/numOfFaces));
        verts.push(Math.cos(i *2* Math.PI/numOfFaces), -1.0,  Math.sin(i *2* Math.PI/numOfFaces));
        verts.push(0.0,  1.0,  0.0,);
    }
    verts.push(Math.cos(1 *2* Math.PI/numOfFaces), -1.0,  Math.sin(1 *2* Math.PI/numOfFaces));

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    var colorsArray = [
        [1.0, 0.0, 0.0, 1.0],
        [0.0, 1.0, 0.0, 1.0],
        [0.0, 0.0, 1.0, 1.0],
        [1.0, 0.0, 0.0, 1.0],
        [1.0, 1.0, 0.0, 1.0],
        [0.0, 1.0, 1.0, 1.0],
        [1.0, 0.0, 1.0, 1.0],        
        [1.0, 0.0, 0.0, 1.0],
    ];

    var colorsVertex = [];
    
    for (const color of colorsArray) 
    {
        for (var j=0; j < 3; j++)
            colorsVertex = colorsVertex.concat(color);
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorsVertex), gl.STATIC_DRAW);

    var pBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pBuffer);

    var index = [
        0,1,2,
        3,4,5,
        6,7,8,
        9,10,11,
        12,13,14,
        15,16,17,
        18,19,20,
        21,22,23
    ];

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);
    
    var pyramid = {
        buffer:buffer, colorBuffer:colorBuffer, indices:pBuffer,
        vertSize:3, nVerts:verts.length, colorSize:4, nColors: verts.length, nIndices:index.length,
        primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()};

    mat4.translate(pyramid.modelViewMatrix, pyramid.modelViewMatrix, translation);

    pyramid.update = function()
    {
        var now = Date.now();
        var deltat = now - this.currentTime;
        this.currentTime = now;
        var speed = deltat / duration;
        var angle = 3* speed * Math.PI;

        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
    };
    
    return pyramid;
}

function createOctahedron(gl, translation, rotationAxis)
{    
    var buffer;
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    var verts = [
    	0.0, 0.0, 0.9,
    	0.0, 0.9, 0.0,
    	0.9, 0.0, 0.0,

        0.0, 0.0, 0.9,
    	0.0, 0.9, 0.0,
    	-0.9, 0.0, 0.0,

        0.0, 0.0, 0.9,
    	0.0, -0.9, 0.0,
    	0.9, 0.0, 0.0,

        0.0, 0.0, 0.9,
    	0.0, -0.9, 0.0,
    	-0.9, 0.0, 0.0,

    	0.0, 0.0, -0.9,
    	0.0, 0.9, 0.0,
    	-0.9, 0.0, 0.0,

        0.0, 0.0, -0.9,
    	0.0, 0.9, 0.0,
    	0.9, 0.0, 0.0,

        0.0, 0.0, -0.9,
    	0.0, -0.9, 0.0,
    	-0.9, 0.0, 0.0,

        0.0, 0.0, -0.9,
    	0.0, -0.9, 0.0,
    	0.9, 0.0, 0.0,

       ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    var colorsArray = [
        [1.0, 0.0, 0.0, 1.0],	
        [0.0, 1.0, 0.0, 1.0],
        [1.0, 1.0, 0.0, 1.0],
        [0.0, 0.0, 1.0, 1.0],
        [1.0, 0.0, 1.0, 1.0],
        [0.0, 1.0, 1.0, 1.0],	
        [0.0, 1.0, 0.0, 1.0],
        [0.0, 0.0, 1.0, 1.0]	
    ];

    var colorsVertex = [];

    for (const color of colorsArray) 
    {
        for (var j=0; j < 3; j++)
            colorsVertex = colorsVertex.concat(color);
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorsVertex), gl.STATIC_DRAW);

    var octahedronIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, octahedronIndexBuffer);
    var octahedronIndices = [
        0, 1, 2,
        3, 4, 5,
        6, 7, 8,
        9, 10, 11,
        12, 13, 14,
        15, 16, 17,
        18, 19, 20,
        21, 22, 23
    ];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(octahedronIndices), gl.STATIC_DRAW);
    
    var octahedron = {
            buffer:buffer, colorBuffer:colorBuffer, indices:octahedronIndexBuffer,
            vertSize:3, nVerts:verts.length, colorSize:4, nColors: verts.length, nIndices:octahedronIndices.length,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()};

    mat4.translate(octahedron.modelViewMatrix, octahedron.modelViewMatrix, translation);
    var invertTranslation = false;
    octahedron.update = function()
    {
        var now = Date.now();
        var deltat = now - this.currentTime;
        this.currentTime = now;
        var fract = deltat / duration;
        var angle = Math.PI * 2 * fract;
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
        var translation = vec3.create();   

        //if object is moving up and hasnt collided with the top of the screen, it moves up
        if(this.modelViewMatrix[13] < 5 && invertTranslation)
        {
            vec3.set (translation, 0, 0.04, 0.0);
        }
        //if object hasn't collided with the bottom of the screen, it translates down
        else if(this.modelViewMatrix[13] > -5)
        {
            vec3.set (translation, 0, -0.04, 0.0);
            invertTranslation = 0;
        }
        
        else
        {
            invertTranslation = true;
        }
        mat4.translate (this.modelViewMatrix, this.modelViewMatrix, translation);
    };    
    return octahedron;
}

function createShader(gl, str, type)
{
    var shader;
    if (type == "fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == "vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initShader(gl)
{
    // load and compile the fragment and vertex shader
    var fragmentShader = createShader(gl, fragmentShaderSource, "fragment");
    var vertexShader = createShader(gl, vertexShaderSource, "vertex");

    // link them together into a new program
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // get pointers to the shader params
    shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
    gl.enableVertexAttribArray(shaderVertexPositionAttribute);

    shaderVertexColorAttribute = gl.getAttribLocation(shaderProgram, "vertexColor");
    gl.enableVertexAttribArray(shaderVertexColorAttribute);
    
    shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
}

function draw(gl, objs) 
{
    // clear the background (with black)
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT);

    // set the shader to use
    gl.useProgram(shaderProgram);

    for(i = 0; i<objs.length; i++)
    {
        obj = objs[i];
        // connect up the shader parameters: vertex position, color and projection/model matrices
        // set up the buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
        gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
        gl.vertexAttribPointer(shaderVertexColorAttribute, obj.colorSize, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);

        gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
        gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, obj.modelViewMatrix);

        // Draw the object's primitives using indexed buffer information.
        // void gl.drawElements(mode, count, type, offset);
        // mode: A GLenum specifying the type primitive to render.
        // count: A GLsizei specifying the number of elements to be rendered.
        // type: A GLenum specifying the type of the values in the element array buffer.
        // offset: A GLintptr specifying an offset in the element array buffer.
        gl.drawElements(obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
    }
}

function run(gl, objs) 
{
    // The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint. The method takes a callback as an argument to be invoked before the repaint.
    requestAnimationFrame(function() { run(gl, objs); });
    draw(gl, objs);

    for(i = 0; i<objs.length; i++)
        objs[i].update();
}


