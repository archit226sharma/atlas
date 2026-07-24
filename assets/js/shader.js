/**
 * CodeAtlas WebGL Ambient Grid Shader
 * Performant background canvas animation for hero section
 */
(function () {
  function initShader() {
    const canvas = document.getElementById('shader-canvas');
    if (!canvas) return;

    function syncSize() {
      const parent = canvas.parentElement || document.body;
      const w = parent.clientWidth || window.innerWidth;
      const h = parent.clientHeight || window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(syncSize).observe(canvas.parentElement || document.body);
    }
    syncSize();

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      canvas.style.display = 'none';
      return;
    }

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;

      void main() {
        vec2 uv = v_texCoord;
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        
        // Dark grid calculation
        vec2 grid = fract(uv * 32.0);
        float line = smoothstep(0.0, 0.04, grid.x) * smoothstep(1.0, 0.96, grid.x) *
                     smoothstep(0.0, 0.04, grid.y) * smoothstep(1.0, 0.96, grid.y);
        
        vec3 gridColor = vec3(0.12, 0.13, 0.16) * (1.0 - line);
        vec3 bgColor = vec3(0.075, 0.075, 0.088);
        
        // Mouse glow interaction
        vec2 mouseUv = u_mouse / u_resolution;
        float dist = distance(st, mouseUv);
        float mouseGlow = smoothstep(0.4, 0.0, dist) * 0.12;
        
        // Subtle flowing ambient glow
        float wave = sin(uv.x * 3.0 + u_time * 0.4) * cos(uv.y * 3.0 + u_time * 0.3) * 0.04;
        
        vec3 accentGlow = vec3(0.13, 0.77, 0.36) * (mouseGlow + wave * 0.5);
        
        gl_FragColor = vec4(mix(bgColor, gridColor, 0.4) + accentGlow, 1.0);
      }
    `;

    function compileShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertShader = compileShader(gl.VERTEX_SHADER, vs);
    const fragShader = compileShader(gl.FRAGMENT_SHADER, fs);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1
    ]), gl.STATIC_DRAW);

    const posAttr = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    window.addEventListener('mousemove', function (e) {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        mouse.x = e.clientX - rect.left;
        mouse.y = rect.height - (e.clientY - rect.top);
      }
    });

    let animId;
    function render(t) {
      syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(render);
    }

    render(0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShader);
  } else {
    initShader();
  }
})();
