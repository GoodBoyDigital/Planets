// sky.vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uRadius;

varying vec2 vTextureCoord;
varying vec3 vNormal;

void main(void) {
	mat4 matView = uViewMatrix;
	matView[3][0] = 0.0;
	matView[3][1] = 0.0;
	matView[3][2] = 0.0;

	vec3 position = aVertexPosition;
	position.xz *= uRadius;
	
    gl_Position = uProjectionMatrix * matView * vec4(position, 1.0);
    vTextureCoord = aTextureCoord;
    vNormal = aNormal;
}