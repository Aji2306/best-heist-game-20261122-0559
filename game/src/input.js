// Input handling (Keyboard & Mouse)

export const Input = {
  keys: {},
  mouse: { x: 0, y: 0, clicked: false, rightClicked: false },

  init(canvas) {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (['Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      this.mouse.x = (e.clientX - rect.left) * scaleX;
      this.mouse.y = (e.clientY - rect.top) * scaleY;
    });

    canvas.addEventListener('mousedown', (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      this.mouse.x = (e.clientX - rect.left) * scaleX;
      this.mouse.y = (e.clientY - rect.top) * scaleY;
      if (e.button === 0) this.mouse.clicked = true;
      if (e.button === 2) this.mouse.rightClicked = true;
    });

    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  },

  clearFrame() {
    this.mouse.clicked = false;
    this.mouse.rightClicked = false;
  }
};
