import { useEffect, useRef } from 'react';

/**
 * Interactive WebGL Fluid Simulation Background
 * Based on Navier-Stokes fluid dynamics (Pavel Dobryakov's algorithm),
 * tuned for the portfolio's dark luxury theme (Cyan, Violet, Indigo, Magenta).
 *
 * Features:
 * - Fixed background canvas with pointer-events: none (scrolling & clicks pass through)
 * - Fades in only AFTER scrolling past the Hero section
 * - GPU sleep / throttle while on Hero to preserve battery & performance
 * - Dynamic pointer & touch interaction everywhere on screen
 * - Auto-orbiting Lissajous ribbons when cursor is idle
 * - Initial multi-colored burst on load
 */
export default function FluidSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const CONFIG = {
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: 512,
      DENSITY_DISSIPATION: 0.985,  // Color trail persistence
      VELOCITY_DISSIPATION: 0.98, // Velocity persistence
      PRESSURE: 0.8,
      PRESSURE_ITERATIONS: 20,
      CURL: 30,                   // Vorticity/swirls strength
      SPLAT_RADIUS: 0.35,
      SPLAT_FORCE: 6000,
      COLOR_PALETTE: [
        { r: 0.0, g: 0.92, b: 1.0 },   // Neon Cyan
        { r: 0.62, g: 0.28, b: 1.0 },  // Electric Violet
        { r: 0.35, g: 0.42, b: 1.0 },  // Royal Indigo
        { r: 0.98, g: 0.18, b: 0.65 }, // Vivid Magenta
      ],
      AUTO_ORBIT_SPEED: 0.0016,
      AUTO_ORBIT_RADIUS: 0.38,
      IDLE_TIMEOUT: 1000,            // ms before auto-orbit engages
    };

    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    let animId = 0;
    let isPastHero = false;

    // WebGL Init
    const params: WebGLContextAttributes = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    };
    gl = (canvas.getContext('webgl2', params) || canvas.getContext('webgl', params)) as
      | WebGLRenderingContext
      | WebGL2RenderingContext
      | null;

    if (!gl) return;

    const isWebGL2 = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
    let halfFloat: any;
    let supportLinearFiltering: any;

    if (isWebGL2) {
      gl.getExtension('EXT_color_buffer_float');
      supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
    } else {
      halfFloat = gl.getExtension('OES_texture_half_float');
      supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
    }

    gl.clearColor(0.0, 0.0, 0.0, 0.0);

    const halfFloatType: number = isWebGL2
      ? (gl as WebGL2RenderingContext).HALF_FLOAT
      : halfFloat
      ? halfFloat.HALF_FLOAT_OES
      : gl.FLOAT;

    function supportRenderTextureFormat(
      context: WebGLRenderingContext | WebGL2RenderingContext,
      internalFormat: number,
      format: number,
      type: number
    ) {
      const texture = context.createTexture();
      context.bindTexture(context.TEXTURE_2D, texture);
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST);
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST);
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
      context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);
      context.texImage2D(context.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

      const fbo = context.createFramebuffer();
      context.bindFramebuffer(context.FRAMEBUFFER, fbo);
      context.framebufferTexture2D(context.FRAMEBUFFER, context.COLOR_ATTACHMENT0, context.TEXTURE_2D, texture, 0);
      const status = context.checkFramebufferStatus(context.FRAMEBUFFER);
      context.deleteTexture(texture);
      context.deleteFramebuffer(fbo);
      return status === context.FRAMEBUFFER_COMPLETE;
    }

    function getSupportedFormat(
      context: WebGLRenderingContext | WebGL2RenderingContext,
      internalFormat: number,
      format: number,
      type: number
    ): { internalFormat: number; format: number } {
      if (!supportRenderTextureFormat(context, internalFormat, format, type)) {
        switch (internalFormat) {
          case (context as any).R16F:
            return getSupportedFormat(context, (context as any).RG16F, (context as any).RG, type);
          case (context as any).RG16F:
            return getSupportedFormat(context, (context as any).RGBA16F, context.RGBA, type);
          default:
            return { internalFormat: context.RGBA, format: context.RGBA };
        }
      }
      return { internalFormat, format };
    }

    const ext = {
      formatRGBA: isWebGL2
        ? getSupportedFormat(gl, (gl as any).RGBA16F, gl.RGBA, halfFloatType)
        : getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatType),
      formatRG: isWebGL2
        ? getSupportedFormat(gl, (gl as any).RG16F, (gl as any).RG, halfFloatType)
        : getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatType),
      formatR: isWebGL2
        ? getSupportedFormat(gl, (gl as any).R16F, (gl as any).RED, halfFloatType)
        : getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatType),
      halfFloatType,
      supportLinearFiltering,
    };

    // Shaders
    function compileShader(type: number, src: string): WebGLShader {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }

    function createProgram(vertexSrc: string, fragmentSrc: string): WebGLProgram {
      const p = gl!.createProgram()!;
      gl!.attachShader(p, compileShader(gl!.VERTEX_SHADER, vertexSrc));
      gl!.attachShader(p, compileShader(gl!.FRAGMENT_SHADER, fragmentSrc));
      gl!.linkProgram(p);
      return p;
    }

    const baseVertexShader = `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const clearShader = `
      precision mediump float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;
      void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
      }
    `;

    const splatShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
      }
    `;

    const advectionShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform float dt;
      uniform float dissipation;
      void main () {
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        gl_FragColor = dissipation * texture2D(uSource, coord);
        gl_FragColor.a = 1.0;
      }
    `;

    const divergenceShader = `
      precision mediump float;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `;

    const curlShader = `
      precision mediump float;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `;

    const vorticityShader = `
      precision highp float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
      }
    `;

    const pressureShader = `
      precision mediump float;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `;

    const gradientSubtractShader = `
      precision mediump float;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `;

    const displayShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
        float a = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(c, a);
      }
    `;

    interface FBO {
      texture: WebGLTexture;
      fbo: WebGLFramebuffer;
      width: number;
      height: number;
      attach: (id: number) => number;
    }

    interface DoubleFBO {
      width: number;
      height: number;
      texelSizeX: number;
      texelSizeY: number;
      read: FBO;
      write: FBO;
      swap: () => void;
    }

    function createFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number): FBO {
      gl!.activeTexture(gl!.TEXTURE0);
      const texture = gl!.createTexture()!;
      gl!.bindTexture(gl!.TEXTURE_2D, texture);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, param);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, param);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

      const fbo = gl!.createFramebuffer()!;
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
      gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, texture, 0);
      gl!.viewport(0, 0, w, h);
      gl!.clear(gl!.COLOR_BUFFER_BIT);

      return {
        texture,
        fbo,
        width: w,
        height: h,
        attach(id: number) {
          gl!.activeTexture(gl!.TEXTURE0 + id);
          gl!.bindTexture(gl!.TEXTURE_2D, texture);
          return id;
        },
      };
    }

    function createDoubleFBO(
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ): DoubleFBO {
      let fbo1 = createFBO(w, h, internalFormat, format, type, param);
      let fbo2 = createFBO(w, h, internalFormat, format, type, param);
      return {
        width: w,
        height: h,
        texelSizeX: 1.0 / w,
        texelSizeY: 1.0 / h,
        get read() {
          return fbo1;
        },
        set read(value) {
          fbo1 = value;
        },
        get write() {
          return fbo2;
        },
        set write(value) {
          fbo2 = value;
        },
        swap() {
          const temp = fbo1;
          fbo1 = fbo2;
          fbo2 = temp;
        },
      };
    }

    const clearProg = createProgram(baseVertexShader, clearShader);
    const splatProg = createProgram(baseVertexShader, splatShader);
    const advectionProg = createProgram(baseVertexShader, advectionShader);
    const divergenceProg = createProgram(baseVertexShader, divergenceShader);
    const curlProg = createProgram(baseVertexShader, curlShader);
    const vorticityProg = createProgram(baseVertexShader, vorticityShader);
    const pressureProg = createProgram(baseVertexShader, pressureShader);
    const gradSubProg = createProgram(baseVertexShader, gradientSubtractShader);
    const displayProg = createProgram(baseVertexShader, displayShader);

    const quadVBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadVBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    const filter = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
    let density = createDoubleFBO(
      CONFIG.DYE_RESOLUTION,
      CONFIG.DYE_RESOLUTION,
      ext.formatRGBA.internalFormat,
      ext.formatRGBA.format,
      ext.halfFloatType,
      filter
    );
    let velocity = createDoubleFBO(
      CONFIG.SIM_RESOLUTION,
      CONFIG.SIM_RESOLUTION,
      ext.formatRG.internalFormat,
      ext.formatRG.format,
      ext.halfFloatType,
      filter
    );
    let divergence = createFBO(
      CONFIG.SIM_RESOLUTION,
      CONFIG.SIM_RESOLUTION,
      ext.formatR.internalFormat,
      ext.formatR.format,
      ext.halfFloatType,
      gl.NEAREST
    );
    let curl = createFBO(
      CONFIG.SIM_RESOLUTION,
      CONFIG.SIM_RESOLUTION,
      ext.formatR.internalFormat,
      ext.formatR.format,
      ext.halfFloatType,
      gl.NEAREST
    );
    let pressure = createDoubleFBO(
      CONFIG.SIM_RESOLUTION,
      CONFIG.SIM_RESOLUTION,
      ext.formatR.internalFormat,
      ext.formatR.format,
      ext.halfFloatType,
      gl.NEAREST
    );

    function renderQuad(target: FBO | null) {
      if (target == null) {
        gl!.viewport(0, 0, gl!.drawingBufferWidth, gl!.drawingBufferHeight);
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
      } else {
        gl!.viewport(0, 0, target.width, target.height);
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, target.fbo);
      }
      gl!.bindBuffer(gl!.ARRAY_BUFFER, quadVBO);
      gl!.vertexAttribPointer(0, 2, gl!.FLOAT, false, 0, 0);
      gl!.enableVertexAttribArray(0);
      gl!.drawArrays(gl!.TRIANGLE_FAN, 0, 4);
    }

    function splat(x: number, y: number, dx: number, dy: number, color: { r: number; g: number; b: number }) {
      gl!.useProgram(splatProg);
      gl!.uniform1i(gl!.getUniformLocation(splatProg, 'uTarget'), velocity.read.attach(0));
      gl!.uniform1f(gl!.getUniformLocation(splatProg, 'aspectRatio'), canvas!.width / canvas!.height);
      gl!.uniform2f(gl!.getUniformLocation(splatProg, 'point'), x, y);
      gl!.uniform3f(gl!.getUniformLocation(splatProg, 'color'), dx, dy, 0.0);
      gl!.uniform1f(gl!.getUniformLocation(splatProg, 'radius'), CONFIG.SPLAT_RADIUS / 100.0);
      renderQuad(velocity.write);
      velocity.swap();

      gl!.uniform1i(gl!.getUniformLocation(splatProg, 'uTarget'), density.read.attach(0));
      gl!.uniform3f(gl!.getUniformLocation(splatProg, 'color'), color.r, color.g, color.b);
      renderQuad(density.write);
      density.swap();
    }

    function triggerBurst(count = 7) {
      for (let i = 0; i < count; i++) {
        const color = CONFIG.COLOR_PALETTE[i % CONFIG.COLOR_PALETTE.length];
        const x = 0.2 + 0.6 * Math.random();
        const y = 0.2 + 0.6 * Math.random();
        const dx = (Math.random() - 0.5) * CONFIG.SPLAT_FORCE;
        const dy = (Math.random() - 0.5) * CONFIG.SPLAT_FORCE;
        splat(x, y, dx, dy, color);
      }
    }

    function step(dt: number) {
      gl!.disable(gl!.BLEND);

      // 1. Curl
      gl!.useProgram(curlProg);
      gl!.uniform2f(gl!.getUniformLocation(curlProg, 'texelSize'), velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(gl!.getUniformLocation(curlProg, 'uVelocity'), velocity.read.attach(0));
      renderQuad(curl);

      // 2. Vorticity Confinement
      gl!.useProgram(vorticityProg);
      gl!.uniform2f(gl!.getUniformLocation(vorticityProg, 'texelSize'), velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(gl!.getUniformLocation(vorticityProg, 'uVelocity'), velocity.read.attach(0));
      gl!.uniform1i(gl!.getUniformLocation(vorticityProg, 'uCurl'), curl.attach(1));
      gl!.uniform1f(gl!.getUniformLocation(vorticityProg, 'curl'), CONFIG.CURL);
      gl!.uniform1f(gl!.getUniformLocation(vorticityProg, 'dt'), dt);
      renderQuad(velocity.write);
      velocity.swap();

      // 3. Divergence
      gl!.useProgram(divergenceProg);
      gl!.uniform2f(gl!.getUniformLocation(divergenceProg, 'texelSize'), velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(gl!.getUniformLocation(divergenceProg, 'uVelocity'), velocity.read.attach(0));
      renderQuad(divergence);

      // 4. Pressure Solve (Jacobi iterations)
      gl!.useProgram(clearProg);
      gl!.uniform1i(gl!.getUniformLocation(clearProg, 'uTexture'), pressure.read.attach(0));
      gl!.uniform1f(gl!.getUniformLocation(clearProg, 'value'), CONFIG.PRESSURE);
      renderQuad(pressure.write);
      pressure.swap();

      gl!.useProgram(pressureProg);
      gl!.uniform2f(gl!.getUniformLocation(pressureProg, 'texelSize'), velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(gl!.getUniformLocation(pressureProg, 'uDivergence'), divergence.attach(1));
      for (let i = 0; i < CONFIG.PRESSURE_ITERATIONS; i++) {
        gl!.uniform1i(gl!.getUniformLocation(pressureProg, 'uPressure'), pressure.read.attach(0));
        renderQuad(pressure.write);
        pressure.swap();
      }

      // 5. Gradient Subtract
      gl!.useProgram(gradSubProg);
      gl!.uniform2f(gl!.getUniformLocation(gradSubProg, 'texelSize'), velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(gl!.getUniformLocation(gradSubProg, 'uPressure'), pressure.read.attach(0));
      gl!.uniform1i(gl!.getUniformLocation(gradSubProg, 'uVelocity'), velocity.read.attach(1));
      renderQuad(velocity.write);
      velocity.swap();

      // 6. Advect Velocity
      gl!.useProgram(advectionProg);
      gl!.uniform2f(gl!.getUniformLocation(advectionProg, 'texelSize'), velocity.texelSizeX, velocity.texelSizeY);
      gl!.uniform1i(gl!.getUniformLocation(advectionProg, 'uVelocity'), velocity.read.attach(0));
      gl!.uniform1i(gl!.getUniformLocation(advectionProg, 'uSource'), velocity.read.attach(0));
      gl!.uniform1f(gl!.getUniformLocation(advectionProg, 'dt'), dt);
      gl!.uniform1f(gl!.getUniformLocation(advectionProg, 'dissipation'), CONFIG.VELOCITY_DISSIPATION);
      renderQuad(velocity.write);
      velocity.swap();

      // 7. Advect Dye (Density)
      gl!.uniform2f(gl!.getUniformLocation(advectionProg, 'texelSize'), density.texelSizeX, density.texelSizeY);
      gl!.uniform1i(gl!.getUniformLocation(advectionProg, 'uVelocity'), velocity.read.attach(0));
      gl!.uniform1i(gl!.getUniformLocation(advectionProg, 'uSource'), density.read.attach(1));
      gl!.uniform1f(gl!.getUniformLocation(advectionProg, 'dissipation'), CONFIG.DENSITY_DISSIPATION);
      renderQuad(density.write);
      density.swap();

      // 8. Render to screen with screen alpha blending
      gl!.useProgram(displayProg);
      gl!.uniform1i(gl!.getUniformLocation(displayProg, 'uTexture'), density.read.attach(0));
      gl!.enable(gl!.BLEND);
      gl!.blendFunc(gl!.ONE, gl!.ONE_MINUS_SRC_ALPHA);
      renderQuad(null);
    }

    interface Pointer {
      id: number;
      x: number;
      y: number;
      dx: number;
      dy: number;
      moved: boolean;
      color: { r: number; g: number; b: number };
    }

    const pointers: Pointer[] = [];
    let lastPointerTime = performance.now();
    let orbitAngle = 0;

    function getPointer(id: number): Pointer {
      let p = pointers.find((x) => x.id === id);
      if (!p) {
        p = {
          id,
          x: 0,
          y: 0,
          dx: 0,
          dy: 0,
          moved: false,
          color: CONFIG.COLOR_PALETTE[pointers.length % CONFIG.COLOR_PALETTE.length],
        };
        pointers.push(p);
      }
      return p;
    }

    function updatePointer(p: Pointer, clientX: number, clientY: number) {
      const rect = canvas!.getBoundingClientRect();
      const nx = (clientX - rect.left) / rect.width;
      const ny = 1.0 - (clientY - rect.top) / rect.height;
      p.dx = (nx - p.x) * CONFIG.SPLAT_FORCE;
      p.dy = (ny - p.y) * CONFIG.SPLAT_FORCE;
      p.x = nx;
      p.y = ny;
      p.moved = Math.abs(p.dx) > 0.1 || Math.abs(p.dy) > 0.1;
      lastPointerTime = performance.now();
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isPastHero) return;
      const p = getPointer(-1);
      updatePointer(p, e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isPastHero) return;
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const p = getPointer(touch.identifier);
        updatePointer(p, touch.clientX, touch.clientY);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!isPastHero) return;
      for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const p = getPointer(touch.identifier);
        p.color = CONFIG.COLOR_PALETTE[Math.floor(Math.random() * CONFIG.COLOR_PALETTE.length)];
        updatePointer(p, touch.clientX, touch.clientY);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });

    function updateAutoOrbit(dt: number) {
      orbitAngle += CONFIG.AUTO_ORBIT_SPEED * dt * 1000;
      const x = 0.5 + Math.cos(orbitAngle) * CONFIG.AUTO_ORBIT_RADIUS;
      const y = 0.5 + Math.sin(orbitAngle * 2.0) * (CONFIG.AUTO_ORBIT_RADIUS * 0.55);

      const prevX = 0.5 + Math.cos(orbitAngle - 0.05) * CONFIG.AUTO_ORBIT_RADIUS;
      const prevY = 0.5 + Math.sin((orbitAngle - 0.05) * 2.0) * (CONFIG.AUTO_ORBIT_RADIUS * 0.55);

      const dx = (x - prevX) * CONFIG.SPLAT_FORCE * 1.5;
      const dy = (y - prevY) * CONFIG.SPLAT_FORCE * 1.5;

      const palIdx = Math.floor(orbitAngle * 0.4) % CONFIG.COLOR_PALETTE.length;
      const color = CONFIG.COLOR_PALETTE[palIdx];

      splat(x, y, dx, dy, color);
    }

    // Scroll Observer: Smooth Fade In & Out after Hero
    const handleScroll = () => {
      const hero = document.getElementById('hero');
      const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : window.innerHeight;
      const startFade = Math.max(0, heroBottom - window.innerHeight * 0.5);
      const endFade = heroBottom - window.innerHeight * 0.1;
      const scrollY = window.scrollY || window.pageYOffset;

      if (scrollY <= startFade) {
        isPastHero = false;
        canvas.style.opacity = '0';
        canvas.style.visibility = 'hidden';
      } else if (scrollY >= endFade) {
        isPastHero = true;
        canvas.style.opacity = '1';
        canvas.style.visibility = 'visible';
      } else {
        isPastHero = true;
        const progress = (scrollY - startFade) / (endFade - startFade);
        canvas.style.opacity = Math.max(0, Math.min(1, progress)).toString();
        canvas.style.visibility = 'visible';
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.floor(window.innerWidth * dpr);
      const height = Math.floor(window.innerHeight * dpr);
      if (canvas!.width !== width || canvas!.height !== height) {
        canvas!.width = width;
        canvas!.height = height;
      }
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    triggerBurst(8);

    let lastTime = performance.now();
    function loop(now: number) {
      animId = requestAnimationFrame(loop);

      const dt = Math.min((now - lastTime) / 1000, 0.033) || 0.016;
      lastTime = now;

      // Only perform compute & draw when past Hero
      if (!isPastHero) return;

      for (let i = 0; i < pointers.length; i++) {
        const p = pointers[i];
        if (p.moved) {
          p.moved = false;
          splat(p.x, p.y, p.dx, p.dy, p.color);
        }
      }

      if (now - lastPointerTime > CONFIG.IDLE_TIMEOUT) {
        updateAutoOrbit(dt);
      }

      step(dt);
    }

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="fluid-canvas"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 h-full w-full select-none"
      style={{
        opacity: 0,
        visibility: 'hidden',
        transition: 'opacity 0.4s ease-out',
      }}
    />
  );
}
