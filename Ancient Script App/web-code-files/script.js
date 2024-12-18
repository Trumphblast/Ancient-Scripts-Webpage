const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

const colorPicker = document.getElementById('colorPicker');
const penSize = document.getElementById('penSize');
const clearButton = document.getElementById('clearCanvas');
const undoButton = document.getElementById('undo');
const redoButton = document.getElementById('redo');
const downloadButton = document.getElementById('download');

let drawing = false;
let paths = [];
let undonePaths = [];

// Start drawing
canvas.addEventListener('mousedown', (e) => {
  drawing = true;
  const path = {
    color: colorPicker.value,
    size: penSize.value,
    points: [{ x: e.offsetX, y: e.offsetY }]
  };
  paths.push(path);
  undonePaths = []; // Clear redo history on new draw action
});

// Draw on mouse move
canvas.addEventListener('mousemove', (e) => {
  if (!drawing) return;
  const path = paths[paths.length - 1];
  path.points.push({ x: e.offsetX, y: e.offsetY });
  redraw();
});

// Stop drawing
canvas.addEventListener('mouseup', () => (drawing = false));
canvas.addEventListener('mouseleave', () => (drawing = false));

// Redraw the canvas with all paths
function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  paths.forEach((path) => {
    ctx.strokeStyle = path.color;
    ctx.lineWidth = path.size;
    ctx.lineCap = 'round';
    ctx.beginPath();
    path.points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      }
    });
  });
}

// Clear canvas
clearButton.addEventListener('click', () => {
  paths = [];
  undonePaths = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Undo functionality
undoButton.addEventListener('click', () => {
  if (paths.length > 0) {
    undonePaths.push(paths.pop());
    redraw();
  }
});

// Redo functionality
redoButton.addEventListener('click', () => {
  if (undonePaths.length > 0) {
    paths.push(undonePaths.pop());
    redraw();
  }
});

// Download canvas as an image
downloadButton.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'drawing.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});