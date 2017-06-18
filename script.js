(function() {
  
  var redraw = true;
  var canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  window.onresize = resizeWindow;
  resizeWindow();
  
  // from tutorial https://www.youtube.com/watch?v=XNbtwyWh9HA
  // will make a triangle
  
  // webgl instead of 2d context
  var gl = canvas.getContext('webgl');
  
  // shaders tell where to put things and what colour etc
  
  // vertex shader positions stuff
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, [
    // this stuff is NOT javascript but glsl instead
    'attribute vec2 position;', // vec2 = 2 floating point values because a position has both x and y
    'void main() {', // every shader needs a main()
      'gl_Position = vec4(position, 0.0, 1.0);', // position is coming from JS and is x,y so counts as 2 values, thus vec4 not vec3
    '}',
  ].join('\n'));
  gl.compileShader(vertexShader);
  
  // fragment shader colours stuff
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, [
    'precision highp float;', // what precision to use for floats
    'uniform vec4 color;', // uniform available to both shaders vec4 as 4 bits to it: r, g, b, a
    'void main() {',
      'gl_FragColor = color;', // color coming from JS
    '}'
  ].join('\n'));
  gl.compileShader(fragmentShader);
  
  // create our main program
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  
  // TODO: make polygons with any number of vertices instead
  var triangles = [
    // [x, y], [x, y], [x, y] for 3 points of triangle
    // (0,0) is centre, (-1,-1) bottom-left, (1,1) top-right
    [[-0.5, -0.5], [0.5, -0.5], [0.0, 0.5]],
    [[-0.8, 0.0], [-0.3, 0.0], [-0.4, 0.5]],
    [[0.8, 0.0], [0.3, 0.0], [0.4, 0.5]]
  ];
  
  // make a single flat Float32Array with all the triangles' vertices
  var vertices = [];
  triangles.forEach(function(triangle) {
    triangle.forEach(function(vertex) {
      vertices.push(vertex[0]); // x
      vertices.push(vertex[1]); // y
    });
  });
  // add the vertices for our triangles
  var vertices = new Float32Array(vertices);
  
  // make a buffer to send to the GPU
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  
  gl.useProgram(program);
  program.color = gl.getUniformLocation(program, 'color');
  gl.uniform4fv(program.color, [1, 1, 0, 1]); // r, g, b, a (TODO: except a doesn't actually seem to change opacity)
  
  program.position = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(program.position);
  gl.vertexAttribPointer(program.position, 2, gl.FLOAT, false, 0, 0);
  
  drawLoop();
  
  // our main draw loop
  function drawLoop() {
    if (redraw) {
      // console.log('drawing');
      // Clear the canvas with a colour
      gl.clearColor(Math.random(), Math.random(), Math.random(), 1); // r, g, b, a
      
      gl.viewport(0, 0, canvas.width, canvas.height); // in case window.resize
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2); // each point has both x,y thus /2
      
      redraw = false;
    }
    
    window.requestAnimationFrame(drawLoop);
  }
  
  // resized on window resize
  function resizeWindow() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    redraw = true;
  }
  
  window.gl = gl;
  
})();