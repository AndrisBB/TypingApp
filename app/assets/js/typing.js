const MAX_FRAGMENTS = 32;

var fragments_list = [];
var fragment_count = 0;
var current_fragment = 0;

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
        console.log("tick");
        var fragment = document.createElement("span");
        fragment.textContent = text[i];
        fragments_list.push(fragment);
    }

    print_fragments();
}

function display_fragments()
{
    var fragments_div = document.getElementById("fragments_div");
    while(fragments_div.firstChild)
    {
        console.log("remove child span");
        fragments_div.removeChild(fragments_div.firstChild);
    }

    for(var i = 0; i < fragments_list.length; i++)
    {
        fragments_div.appendChild(fragments_list[i]);
    }
}

function move_cursor()
{
    var frags = document.getElementById("fragments_div").childNodes;

}

(function start()
{
    console.log("Typing.js start() ....");

    var text = "sample text";


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
})();
