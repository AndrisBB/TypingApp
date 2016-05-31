const electron = require('electron');
const ipc = electron.ipcRenderer;

const MAX_FRAGMENTS_LENGTH = 16;

var text = [];

var words_list = [];
var fragment_count = 0;
var current_fragment = null;
var cursor = 0;


const Alert = {
    DANGER: 0,
    WARNING: 1,
    SUCCESS: 2,
    INFO: 3,
};

/*
const KeyMap = {
    192: "path11",
    49: "path13",
    50:
    51:
    52:
    53:
    54:
    55:
    56:
    57:
};
*/

function display_alert(type, message)
{
    let alert_panel = document.getElementById("alert_column");
    let alert = document.createElement("div");
    if(type == Alert.DANGER)
    {
        alert.setAttribute("class", "alert alert-danger alert-dismissible");
        let strong = document.createElement("strong");
        strong.innerText = "DANGER!" + String.fromCharCode(160);
        alert.appendChild(strong);
    }
    else if(type == Alert.WARNING)
    {
        alert.setAttribute("class", "alert alert-warning alert-dismissible");
        let strong = document.createElement("strong");
        strong.innerText = "WARNING!" + String.fromCharCode(160);
        alert.appendChild(strong);
    }
    else if(type == Alert.SUCCESS)
    {
        alert.setAttribute("class", "alert alert-success alert-dismissible");
        let strong = document.createElement("strong");
        strong.innerText = "SUCCESS!" + String.fromCharCode(160);
        alert.appendChild(strong);
    }
    else
    {
        alert.setAttribute("class", "alert alert-info alert-dismissible");
        let strong = document.createElement("strong");
        strong.innerText = "INFO!" + String.fromCharCode(160);
        alert.appendChild(strong);
    }
    alert.setAttribute("role", "alert");

    let msg = document.createElement("span");
    msg.innerText = message;
    alert.appendChild(msg);


    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("class", "close");
    button.setAttribute("data-dismiss", "alert");
    button.setAttribute("aria-label", "Close");

    let span = document.createElement("span");
    span.setAttribute("aria-hidden", "true");
    span.innerText = "X"

    button.appendChild(span);
    alert.appendChild(button);

    alert_panel.appendChild(alert);
}

// -----------------------------------------------------------------------------
// PORT FUNCTIONS
// -----------------------------------------------------------------------------
function request_port_list()
{
    // Clear ports list
    let port_sel = document.getElementById("port_sel");
    while(port_sel.firstChild)
    {
        port_sel.removeChild(port_sel.firstChild);
    }
    ipc.send("get_port_list", current_fragment);
}

function port_connect()
{
    var port_sel = document.getElementById("port_sel");
    var port = port_sel.options[port_sel.selectedIndex].text;

    if(text == null)
    {
        display_alert(Alert.DANGER, "Please select port!");
    }
    else
    {
        let btn = document.getElementById("open_btn");
        btn.setAttribute("class", "btn btn-primary disabled");
        btn.disabled = true;
        ipc.send("connect", port);
    }
}

function port_disconnect()
{
    console.log("port_disconnect();");

    let btn = document.getElementById("open_btn");
    btn.setAttribute("class", "btn btn-success disabled");
    btn.disabled = true;
    ipc.send("disconnect");
}

// -----------------------------------------------------------------------------
// KEYBOARD
// -----------------------------------------------------------------------------

function highlight_key(keycode)
{
    let key = document.getElementById("keyboard_svg").getSVGDocument().getElementById("path" + keycode);
    if(key != null)
    {
        key.style.setProperty("fill","#786534");
    }
}

function release_key(keycode)
{
    let key = document.getElementById("keyboard_svg").getSVGDocument().getElementById("path" + keycode);
    if(key != null)
    {
        key.style.setProperty("fill","#97c5d5");
    }
    //var key = document.getElementById(KeyMap[value]);
    //key.style = "fill:#97c5d5;stroke:#202326;stroke-width:0"
}

function clear_fragments()
{
    let fragments_div = document.getElementById("fragments_div");
    while(fragments_div.firstChild)
    {
        fragments_div.removeChild(fragments_div.firstChild);
    }
    fragment_count = 0;
    current_fragment = null;
    cursor = 0;
}

function add_fragment(text)
{
    let fragments_div = document.getElementById("fragments_div");
    for(let i = 0; i < text.length; i++)
    {
        let fragment = document.createElement("span");
        fragment.textContent = text[i];
        fragments_div.appendChild(fragment);
        console.log("add_fragment() : Fragment added ... " + text[i]);
    }
}

function add_fragments()
{
    // Add new fragments
    let space_left = MAX_FRAGMENTS_LENGTH;
    while(space_left > 0)
    {
        console.log("add_fragments() : Spaces left ... " + space_left);
        console.log("add_fragments() : Check next word ... " + words_list[0]);
        if(words_list[0].length < space_left)
        {
            console.log("add_fragments() : Word will fit ...");
            if(space_left != MAX_FRAGMENTS_LENGTH)
            {
                add_fragment(" ");
                space_left--;
            }

            add_fragment(words_list[0]);
            space_left = space_left - words_list[0].length;
            words_list.splice(0, 1);
        }
        else
        {
            console.log("add_fragments() : Not enaught room for word ...");
            break;
        }
    }
    fragment_count = MAX_FRAGMENTS_LENGTH - space_left;
    console.log("add_fragments() : Fragments count ... " + fragment_count);
    current_fragment = document.getElementById("fragments_div").firstChild.innerText;
    select_fragment(cursor);
}

function select_fragment(index)
{
    var fragment = document.getElementById("fragments_div").childNodes[index];
    if(fragment != null)
    {
        fragment.style.fontSize = "96px";
        fragment.style.color = "red";
        fragment.style.textDecoration = "underline";
        current_fragment = fragment.innerText;

        ipc.send("cmd_pulse", current_fragment);
    }
}

function unselect_fragment(index)
{
    var fragment = document.getElementById("fragments_div").childNodes[index];
    if(fragment != null)
    {
        fragment.style.fontSize = "72px";
        fragment.style.color = "black";
        fragment.style.textDecoration = "none";
    }
}

function move_cursor()
{
    console.log("move_cursor() : Cursor val ... " + cursor);
    unselect_fragment(cursor);
    cursor++;

    if(cursor == fragment_count)
    {
        console.log("move_cursor() : End of line ... ");
        clear_fragments();
        add_fragments();
    }
    else
    {
        select_fragment(cursor);
    }
}

function reset()
{
    /*
    var input_text = document.getElementById("text_area").value;
    if(input_text.length == 0)
    {
        console.log("WARNING: TextArea is empty");
        return;
    }

    words_list = input_text.split(' ');
    console.log(words_list);

    clear_fragments();
    add_fragments();
    */
}

(function start()
{
    reset();

    // Get port list
    request_port_list();

    document.getElementById("refresh_btn").onclick = function(){
        request_port_list();
    };

    document.getElementById("open_btn").onclick = port_connect;

    document.getElementById("digit9_btn").onclick = function(){
        ipc.send("cmd_pulse", "a");
    };

    document.addEventListener("keydown", on_keydown, false);
    document.addEventListener("keyup", on_keyup, false);
    document.onkeypress = on_keypress;
})();



// ----------------------------------------------------------------------------
// EVENT HANDLERS
// ----------------------------------------------------------------------------

function on_keydown(event)
{
    var key = event.keyCode || event.which;
    var keychar = String.fromCharCode(key);

    //console.log("keypress_handler() : Fragmen val ... " + current_fragment.valueOf());
    console.log("keypress_handler() : Key DOWN key... " + key);
    //console.log("keypress_handler() : Key DOWN ... " + keychar.valueOf());

    highlight_key(key);

    //if(keychar.valueOf() == current_fragment.valueOf())
    //{
    //    console.log("HIT ...");
    //    move_cursor();
    //}
}

function on_keyup(event)
{
    var key = event.keyCode || event.which;
    var keychar = String.fromCharCode(key);

    //console.log("keypress_handler() : Fragmen val ... " + current_fragment.valueOf());
    //console.log("keypress_handler() : Key UP ... " + keychar.valueOf());

    release_key(key);

    //if(keychar.valueOf() == current_fragment.valueOf())
    //{
    //    console.log("HIT ...");
    //    move_cursor();
    //}
}

function on_keypress(event)
{
    var key = event.keyCode || event.which;

    //console.log("keypress_handler() : Key PRESS ... " + key);

    //release_key(keychar);
}

ipc.on("ports_list", (event, args) => {
    console.log("IPC: Port List received");

    if(args == null)
    {
        console.error("IPC: Received empty list");
    }
    else
    {
        args.forEach((port) => {
            let port_sel = document.getElementById("port_sel");
            let option = document.createElement("option");
            option.textContent = port.comName;
            port_sel.appendChild(option);
        });
    }


});

ipc.on("connected", (event, args) => {
    console.log("IPC: Connected to port");

    let btn = document.getElementById("open_btn");
    btn.disabled = false;
    btn.setAttribute("class", "btn btn-success");
    btn.innerText = "Close";
    btn.onclick = port_disconnect;

    display_alert(Alert.SUCCESS, "Successfully connected to port");
});

ipc.on("disconnected", (event, args) => {
    console.log("IPC: disconnected from port");

    let btn = document.getElementById("open_btn");
    btn.disabled = false;
    btn.setAttribute("class", "btn btn-primary");
    btn.innerText = "Open";
    btn.onclick = port_connect;
    display_alert(Alert.SUCCESS, "Successfully disconnected from port");
});

ipc.on("error", (event, args) => {
    display_alert(Alert.DANGER, args);
})
