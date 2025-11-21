uniform sampler2D uPrevTexture; // La frame précédente (PingPong)
uniform vec2 uResolution;       // La taille de ta simulation (width, height)
uniform vec2 uMouse;            // Souris normalisée (0.0 à 1.0)
uniform vec2 uMouseVel;
uniform float uTime;            // Pour varier si besoin
uniform float uDelta;
uniform float uViscosity;
uniform float uDrag;
uniform float uSpring;
uniform float uRadius;
uniform float uForce;

varying vec2 vUv;



void main() {
    // 1. Calculer la taille d'un pixel en UV
    vec2 texel = 1.0 / uResolution;


    // 2. Lire l'état actuel au centre
    // .x = Pression (Hauteur de la vague)
    // .y = Vélocité (Vitesse verticale)
    vec4 data = texture2D(uPrevTexture, vUv);
    float pressure = data.x;
    float pVel = data.y;

    // 3. Lire les voisins (Haut, Bas, Gauche, Droite)
    float p_right = texture2D(uPrevTexture, vUv + vec2(texel.x, 0.0)).x;
    float p_left  = texture2D(uPrevTexture, vUv + vec2(-texel.x, 0.0)).x;
    float p_up    = texture2D(uPrevTexture, vUv + vec2(0.0, texel.y)).x;
    float p_down  = texture2D(uPrevTexture, vUv + vec2(0.0, -texel.y)).x;

    if(vUv.x <= texel.x) p_left = p_right;
    if(vUv.x >= 1.0 - texel.x) p_right = p_left;
    if(vUv.y <= texel.y) p_down = p_up;
    if(vUv.y >= 1.0 - texel.y) p_up = p_down;

    // Application de l'accélération à la vélocité

    pVel += uDelta * (-2.0 * pressure + p_right + p_left) / 4.0;
    pVel += uDelta * (-2.0 * pressure + p_up + p_down) / 4.0;

    // 5. Mise à jour de la pression
    pressure += uDelta * pVel;

    // 6. Application des forces de rappel et friction (Spring & Damping)
    pVel -= uSpring * uDelta * pressure;  // Force de rappel (élasticité)
    pVel *= 1.0 - uViscosity * uDelta; // Friction de mouvement
    pressure *= uDrag;                    // Friction de pression (évite l'infini)

    
    vec2 mouseUV = uMouse; // déjà en UV !

    if (uMouse.x > 0.0) {
        float dist = distance(vUv, uMouse);
        if(dist <= 0.02){
            float force = 1.0 - (dist / 0.02);
            pressure += force * uForce ;
        }
       
    }

   
    gl_FragColor = vec4(pressure, pVel, (p_right - p_left)/2.0, (p_up - p_down) / 2.0);
}