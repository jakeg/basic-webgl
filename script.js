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
  
  // add the vertices for our triangles
  // (0,0) is centre, (-1,-1) bottom-left, (1,1) top-right
  var vertices = new Float32Array([
    // triangle 1
    -0.5, -0.5, // bottom left x, y
    0.5, -0.5, // bottom right x, y
    0.0, 0.5, // top x, y
    
    // triangle 2
    -0.8, 0.0, // bottom left x, y
    -0.3, 0.0, // bottom right x, y
    -0.4, 0.5, // top x, y
    
    // triangle 3
    0.8, 0.0, // bottom left x, y
    0.3, 0.0, // bottom right x, y
    0.4, 0.5 // top x, y
  ]);
  
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  
  gl.useProgram(program);
  program.color = gl.getUniformLocation(program, 'color');
  gl.uniform4fv(program.color, [1, 1, 0, 1]); // r, g, b, a (except a doesn't actually seem to change opacity)
  
  program.position = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(program.position);
  gl.vertexAttribPointer(program.position, 2, gl.FLOAT, false, 0, 0);
  
  drawLoop();
  
  // TODO: draw loop generally works but webgl probably needs to be told that the canvas is now a new size
  function drawLoop() {
    if (redraw) {
      // console.log('drawing');
      // Clear the canvas with a colour
      gl.clearColor(Math.random(), Math.random(), Math.random(), 1); // r, g, b, a
      
      gl.viewport(0, 0, canvas.width, canvas.height);
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