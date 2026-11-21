"use client"
// Halftone Dots, adapted from the supplied 21st.dev Shader Builder component.
// Paper Shaders: https://shaders.paper.design/halftone-dots (Apache-2.0).
// The truncated source is repaired; inactive colour/cursor effects are omitted.
// Static by default for this page. Optional animation pauses offscreen/in background.
import { useEffect, useRef } from 'react'

const VERT = `attribute vec2 a_position;
void main(){gl_Position=vec4(a_position,0.0,1.0);}`
const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec3 u_colors[8];
uniform vec4 u_scene;
uniform vec4 u_shape;
uniform vec4 u_surface;
uniform vec4 u_finish;
uniform vec4 u_transform;
uniform vec4 u_space;
#define u_resolution u_scene.xy
#define u_time u_scene.z
#define u_colorCount u_scene.w
#define u_scale u_shape.x
#define u_intensity u_shape.y
#define u_paramA u_shape.z
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define u_seed u_transform.x
#else
#define u_seed mod(u_transform.x,31.0)
#endif
float hash21(vec2 p){
#ifndef GL_FRAGMENT_PRECISION_HIGH
p=mod(p,31.0);
#endif
p=fract(p*vec2(234.34,435.345));p+=dot(p,p+34.23);return fract(p.x*p.y);
}
float grainHash(vec2 p){vec3 p3=fract(vec3(p.xyx)*0.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);return mix(mix(hash21(i),hash21(i+vec2(1.,0.)),u.x),mix(hash21(i+vec2(0.,1.)),hash21(i+vec2(1.,1.)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+vec2(17.,9.2);a*=.5;}return v;}
vec3 palette(float x){float n=max(u_colorCount-1.,1.),f=clamp(x,0.,1.)*n;vec3 col=u_colors[0];for(int i=0;i<7;i++){if(float(i)<n)col=mix(col,u_colors[i+1],smoothstep(0.,1.,clamp(f-float(i),0.,1.)));}return col;}
vec3 shade(vec2 p,float t){float cells=13.+u_intensity*42.;vec2 grid=p*cells,id=floor(grid),local=fract(grid)-.5;if(mod(id.y,2.)>.5)local.x+=.5;local.x=fract(local.x+.5)-.5;float source=fbm(p*2.1+vec2(t*.025,-t*.018)+u_seed);source=mix(source,.5+.5*sin(p.x*2.7+p.y*1.9),.35);float radius=(.08+source*.36)*mix(.55,1.45,u_paramA);float grain=(hash21(id+u_seed)-.5)*u_intensity*.08;float mask=1.-smoothstep(radius-.055,radius+.025,length(local)+grain);return mix(u_colors[0],palette(source),mask);}
void main(){vec2 uv=gl_FragCoord.xy/u_resolution;vec2 p=(gl_FragCoord.xy-.5*u_resolution)/min(u_resolution.x,u_resolution.y);p*=u_scale;p+=u_space.xy;vec3 col=shade(p,u_time);col=(col-.5)*u_surface.y+.5+u_surface.z;col+=(grainHash(gl_FragCoord.xy+vec2(u_seed*17.,u_seed*31.))-.5)*u_finish.w;gl_FragColor=vec4(clamp(col,0.,1.),1.);}
`
const UNIFORMS = {
  colors: [.0666667,.3215686,.8313725,.9803922,.9803922,.9803922,.9803922,.9803922].flatMap(c => [c,c,c]),
  colorCount: 4, scale: 1.260, intensity: .350, paramA: .280, detail: 1.824,
  contrast: 1.005, grain: .042, seed: 1, timeScale: .575,
}

export function ShaderBackground({ className, animated = false }: { className?: string; animated?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false })
    if (!gl) return // Parent's silver gradient remains the fallback.
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, source); gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); return null }
      return shader
    }
    const vertex = compile(gl.VERTEX_SHADER, VERT), fragment = compile(gl.FRAGMENT_SHADER, FRAG)
    if (!vertex || !fragment) { if (vertex) gl.deleteShader(vertex); if (fragment) gl.deleteShader(fragment); return }
    const program = gl.createProgram()
    if (!program) { gl.deleteShader(vertex); gl.deleteShader(fragment); return }
    gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program)
    gl.deleteShader(vertex); gl.deleteShader(fragment)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { gl.deleteProgram(program); return }
    gl.useProgram(program)
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    const uniform = (name: string) => gl.getUniformLocation(program, name)
    gl.uniform3fv(uniform('u_colors'), new Float32Array(UNIFORMS.colors))
    gl.uniform4f(uniform('u_shape'), UNIFORMS.scale, UNIFORMS.intensity, UNIFORMS.paramA, 0)
    gl.uniform4f(uniform('u_surface'), UNIFORMS.detail, UNIFORMS.contrast, 0, 1)
    gl.uniform4f(uniform('u_finish'), 0, 0, 0, UNIFORMS.grain)
    gl.uniform4f(uniform('u_transform'), UNIFORMS.seed, 0, 0, 0)
    gl.uniform4f(uniform('u_space'), 0, 0, 0, 0)
    const scene = uniform('u_scene')
    let raf = 0, inView = true, disposed = false, lost = false
    const start = performance.now()
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    function requestRender() { if (!disposed && !lost && inView && document.visibilityState === 'visible' && !raf) raf = requestAnimationFrame(render) }
    function render(now: number) {
      raf = 0
      if (disposed || lost || !inView || document.visibilityState !== 'visible') return
      const bounds = canvas!.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 1.5)
      const ratio = Math.min(1, Math.sqrt(1_000_000 / Math.max(1, bounds.width * bounds.height * dpr * dpr)))
      const width = Math.max(1, Math.round(bounds.width * dpr * ratio)), height = Math.max(1, Math.round(bounds.height * dpr * ratio))
      if (canvas!.width !== width || canvas!.height !== height) { canvas!.width = width; canvas!.height = height; gl!.viewport(0,0,width,height) }
      gl!.uniform4f(scene,width,height,animated && !reduced.matches ? (now-start)/1000*UNIFORMS.timeScale : 0,UNIFORMS.colorCount)
      gl!.drawArrays(gl!.TRIANGLES,0,3)
      if (animated && !reduced.matches) requestRender()
    }
    const resize = new ResizeObserver(requestRender); resize.observe(canvas)
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; if (inView) requestRender(); else { cancelAnimationFrame(raf); raf = 0 } }); observer.observe(canvas)
    const visibility = () => { cancelAnimationFrame(raf); raf = 0; requestRender() }
    const onLost = (event: Event) => { event.preventDefault(); lost = true; cancelAnimationFrame(raf); raf = 0 }
    canvas.addEventListener('webglcontextlost', onLost)
    document.addEventListener('visibilitychange', visibility)
    reduced.addEventListener('change', visibility)
    requestRender()
    return () => { disposed = true; cancelAnimationFrame(raf); resize.disconnect(); observer.disconnect(); canvas.removeEventListener('webglcontextlost', onLost); document.removeEventListener('visibilitychange', visibility); reduced.removeEventListener('change', visibility); gl.deleteBuffer(buffer); gl.deleteProgram(program) }
  }, [animated])
  return <canvas ref={canvasRef} className={className} aria-hidden="true"/>
}
