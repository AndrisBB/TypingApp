const electron = require('electron');
const ipc = electron.ipcRenderer;

const MAX_FRAGMENTS_LENGTH = 16;

var text = [];

var words_list = [];
var fragment_count = 0;
var current_fragment = null;
var cursor = 0;

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

function keypress_handler(event)
{
    var key = event.keyCode || event.which;
    var keychar = String.fromCharCode(key);

    console.log("keypress_handler() : Fragmen val ... " + current_fragment.valueOf());
    console.log("keypress_handler() : Key pressed ... " + keychar.valueOf());

    if(keychar.valueOf() == current_fragment.valueOf())
    {
        console.log("HIT ...");
        move_cursor();
    }
}

function reset()
{
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
}

(function start()
{


    reset();

    //update_fragments(line);
    //display_fragments();
    //select_fragment(cursor);

    var body = document.body.addEventListener("keypress", keypress_handler);
})();
