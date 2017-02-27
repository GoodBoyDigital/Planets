// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;
uniform vec2 uUVScale;

void main(void) {
    gl_FragColor = texture2D(texture, vTextureCoord * uUVScale);
}