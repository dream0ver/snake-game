const { app, BrowserWindow } = require("electron");
const path = require("node:path");

const createWindow = () => {
  const win = new BrowserWindow({
    maximizable: false,
    minimizable: false,
    webPreferences: {
      devTools: false,
    },
  });

  win.loadFile("index.html");
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
