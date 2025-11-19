precision mediump float;

uniform float uTime;
uniform vec2 uMouse;

varying vec2 vUv;

void main() {
    vUv = uv;

    // Position initiale du vertex
    vec3 newPosition = position;

    // Distance du mouse → influence
    float distMouse = distance(uv, uMouse);

    // Intensité de l'effet liquide
    float intensity = (1.0 - distMouse) * 0.15;

    // Déformation organique en fonction du temps
    float waveX = sin((uv.y + uTime * 0.8) * 10.0) * 0.03;
    float waveY = cos((uv.x + uTime * 0.6) * 10.0) * 0.03;

    // Mix entre les deux effets
    float liquid = waveX + waveY;

    // Influence de la souris (plus fort près du pointeur)
    liquid *= intensity;

    // Applique la déformation à la géométrie
    newPosition.z += liquid * 0.12;


    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
