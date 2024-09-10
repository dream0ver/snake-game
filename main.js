const { app, BrowserWindow } = require("electron");
const path = require("path");

const createWindow = () => {
  const win = new BrowserWindow({
    maximizable: false,
    minimizable: false,
    icon: path.join(__dirname, "public", "assets", "icon", "favicon.ico"),
    webPreferences: {
      devTools: false,
    },
  });

  win.loadFile(path.join(__dirname, "public", "index.html"));
  win.setMenuBarVisibility(false);
  win.setTitle("Snake by dream0ver");
  win.setResizable(false);
  win.setContentSize(768, 768);
};

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
