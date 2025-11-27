export class Cursor {
  constructor() {
    this.init();
  }

  init() {
    const cursor = document.getElementById("cursor");
    let mouseX = 0,
      mouseY = 0;

    // On récupère la position exacte du pointeur, même en low FPS
    window.addEventListener("pointermove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Boucle ultra fluide
    function updateCursor() {
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      requestAnimationFrame(updateCursor);
    }

    updateCursor();

    // Rotation au hover des liens
    document.querySelectorAll("a").forEach((link) => {
      link.addEventListener("mouseenter", () => cursor.classList.add("rotate"));
      link.addEventListener("mouseleave", () =>
        cursor.classList.remove("rotate")
      );
    });
  }
}
