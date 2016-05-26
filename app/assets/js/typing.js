const MAX_FRAGMENTS = 32;

var fragments_list = [];
var fragment_count = 0;
var cursor = 0;

function print_fragments()
{
    console.log("print_fragments() .... ");
    for(var i = 0; i < fragments_list.length; i++)
    {
        console.log(fragments_list[i]);
    }
}

function update_fragments(text)
{
    fragments_list.length = 0;
    for(var i = 0; i < MAX_FRAGMENTS, i < text.length; i++)
    {
        //console.log("tick");
        var fragment = document.createElement("span");
        fragment.textContent = text[i];
        fragments_list.push(fragment);
    }

    //print_fragments();
}

function display_fragments()
{
    var fragments_div = document.getElementById("fragments_div");
    while(fragments_div.firstChild)
    {
        //console.log("remove child span");
        fragments_div.removeChild(fragments_div.firstChild);
    }

    for(var i = 0; i < fragments_list.length; i++)
    {
        fragments_div.appendChild(fragments_list[i]);
    }
}

function select_fragment(index)
{
    if(index < fragments_list.length)
    {
        var fragment = fragments_list[index];
        if(fragment != null)
        {
            fragment.style.fontSize = "96px";
            fragment.style.color = "red";
            fragment.style.textDecoration = "underline";
        }
    }
}

function unselect_fragment(index)
{
    if(index < fragments_list.length)
    {
        var fragment = fragments_list[index];
        if(fragment != null)
        {
            fragment.style.fontSize = "72px";
            fragment.style.color = "black";
            fragment.style.textDecoration = "none";
        }
    }
}

function move_cursor()
{
    unselect_fragment(cursor);
    cursor++;
    select_fragment(cursor);
}

function handle_keypress(event)
{
    var key = event.keyCode || event.which;

    console.log("keypress ...." + key);
    move_cursor();
}

(function start()
{
    console.log("Typing.js start() ....");

    var text = "sample text";

    update_fragments(text);
    display_fragments();
    select_fragment(cursor);
    //init_fragments();
    //set_fragments(text);

    //var len = text.length;
    //for (var i = 0; i < len; i++)
    //{
    //    console.log("Tick");
    //    var fragment = document.createElement("span");
    //    var character = document.createTextNode(text[i]);
    //    fragment.appendChild(character);
    //    fragments_div.appendChild(fragment);

    //    frags_array.push(fragment);
    //}

    //var frags = document.querySelector("#fragments_div").childNodes;
    //console.log(frags[1]);
    //frags[1].style.fontSize = "48px";
    //frags[1].style.color = "red";

    //console.log(frags_array[1]);
    //frags_array[1].style.fontSize = "48px";
    //frags_array[1].style.color = "red";
    var body = document.body.addEventListener("keypress", handle_keypress);
})();
