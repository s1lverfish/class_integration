//import excalidraw dynamically
import("./dist/main.bundle.js").then((module) => {
  const excalidrawPlugin = module.default;
  const openExcalidraw = () => {
    const excalidrawDiv = document.getElementById("root");
    excalidrawObject = new excalidrawPlugin(excalidrawDiv);
    excalidrawObject.openExcalidraw();
  };
  document.getElementById("openExcalidraw").onclick = openExcalidraw;
});

let excalidrawObject;

document.getElementById("openExcalidraw").onclick = () =>
  alert("Excalidraw Loading");

export const closeExcalidraw = () => {
  if (excalidrawObject) {
    excalidrawObject.closeExcalidraw();
    excalidrawObject = null;
  }
};

document.getElementById("closeExcalidraw").onclick = closeExcalidraw;

export const setStickerType = (type) => {
  if (!excalidrawObject) return;
  excalidrawObject.changeStickerType(type);
};

document.getElementById("rectangle").onclick = () =>
  setStickerType("rectangle");
document.getElementById("square").onclick = () => setStickerType("square");
document.getElementById("circle").onclick = () => setStickerType("circle");

document.getElementById("exportSticker").onclick = async () => {
  const container = document.getElementById("svgContainer");

  container.innerHTML = "";

  const svgElement = await excalidrawObject.exportSticker();

  svgElement.setAttribute("width", "350");
  svgElement.setAttribute("height", "350");
  svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");
  container.appendChild(svgElement);
};
