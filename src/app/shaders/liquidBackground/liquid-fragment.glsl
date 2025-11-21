uniform sampler2D uTexture;    
uniform sampler2D uSimTexture; 
varying vec2 vUv;

void main() {

    vec4 data = texture2D(uSimTexture, vUv);

    vec2 distortion = 0.3 * data.zw;
    vec4 color = texture2D(uTexture, vUv + distortion);

    vec3 normal = normalize(vec3(-data.z * 2.0, 0.5, -data.w * 2.0));
    vec3 lightDir = normalize(vec3(-3.0, 10.0, 3.0));
    float specular = pow(max(0.0, dot(normal, lightDir)), 60.0) * 1.5;

    gl_FragColor = color + vec4(specular);
}