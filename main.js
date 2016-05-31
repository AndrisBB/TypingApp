const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const ipc = electron.ipcMain;

var serialport = require("serialport");
var port = null;
// var serialPort = new SerialPort("/dev/ttyUSB0", {
//   baudrate: 9600
// });

// serialPort.on("open", function ()
// {
//   console.log('open');
//   serialPort.write("Hello!", function(err, results) {
//     console.log('err ' + err);
//     console.log('results ' + results);
//   });
// });

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 1920, height: 1080})

    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/app/index.html`)

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
    })
}

function cmd_pulse_handler(event, args)
{
    var char = args.charAt(0);
    console.log(char);

    if(port != null)
    {
        port.write(char);
    }
    else
    {
        event.sender.send("error", "Port is not opened!");
    }
}


// ----------------------------------------------------------------------------
// EVENT HANDLERS
// ----------------------------------------------------------------------------

// Electron loaded event
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

ipc.on("cmd_pulse", cmd_pulse_handler);

ipc.on("get_port_list", (event, args) => {
    console.log("IPC: get_port_list");
    serialport.list(function (err, ports) {
        if(err)
        {
            return;
        }
        else
        {
            event.sender.send("ports_list", ports);
        }
     });
});

ipc.on("disconnect", (event, args) => {
    console.log("IPC: disconnect");

    if(port != null)
    {
        port.close((error)=>{
            if(error)
            {
                console.log("PORT: Close =>" + error);
            }
            else
            {
                console.log("PORT: Disconnected");
                event.sender.send("disconnected");
                port = null;
            }
        });
    }
});


ipc.on("connect", (event, args) => {
    console.log("IPC: connect");

    if(port != null)
    {
        port.close();
        port = null;
    }

    port = new serialport.SerialPort(args, {
       baudrate: 9600
    }, false);

    port.on("error", (error) => {
        console.error("PORT: " + error);
        event.sender.send("error", "Failed to write to port");
    });

    port.open((error) => {
        console.log("SERIAL: port opened " + args );
        console.log("SERIAL: " + error);
        event.sender.send("connected");
    });
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

console.log("Electron running ...");
