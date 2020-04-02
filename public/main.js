let old;
let match_result = 0;

const button_info = [];
button_info["def"] = {color: "danger", result: -1};
button_info["draw"] = {color: "secondary", result: 0};
button_info["win"] = {color: "success", result: 1};

const start = () => {
    old = [
        parseName($("#sel1").val()),
        parseName($("#sel2").val()),
        parseName($("#sel3").val()),
        parseName($("#sel4").val()),
        parseName($("#sel5").val())
    ];
    document.getElementById("date").value = dateToString(new Date());
    $("#btn_send").click(() => {
        const match = {
            id: null,
            players: [
                parseName(getValue(1)),
                parseName(getValue(2)),
                parseName(getValue(3)),
                parseName(getValue(4)),
                parseName(getValue(5)),
            ],
            result: match_result,
            map: $("#selMap").val(),
            date: "02/04/21"
        };
        console.log(match);
        $.post("http://localhost:8080/match", match, function(res){
            if(res==='Match received!') {
                alert("sent");
            }
        });
    });

    $("#sel1").change((evt) => {
        changeOthers(1, evt.target.value);
    });
    $("#sel2").change((evt) => {
        changeOthers(2, evt.target.value);
    });
    $("#sel3").change((evt) => {
        changeOthers(3, evt.target.value);
    });
    $("#sel4").change((evt) => {
        changeOthers(4, evt.target.value);
    });
    $("#sel5").change((evt) => {
        changeOthers(5, evt.target.value);
    });
}

const setResult = (id) => {
    setButton("def", true);
    setButton("draw", true);
    setButton("win", true);
    setButton(id, false);
    match_result = button_info[id].result;
}

const setButton = (id, outline) => {
    document.getElementById("btn_"+id).className = "btn btn" + (outline ? "-outline" : "") + "-" + button_info[id].color;
}

const changeOthers = (n, name) => {
    for(i = 0; i < 5; i++) {
        let idx = i+1;
        if(idx == n) continue;
        if($("#sel" + idx).val() == name) {
            $("#sel" + idx).val(old[n-1]);
        }
    }
    old[n-1] = name;
    console.log(old);
}

const getValue = (n) => {
    return $("#sel" + n).val();
}

const parseName = (name) => {
    if(name == "(Guiri)") name = "";
    return name 
}

const dateToString = (date) => {
    const d = date.getDate();
    const m = date.getMonth()+1;
    const y = date.getFullYear();
    return (y > 9 ? y : "0" + y) + "-" + (m > 9 ? m : "0" + m) + "-" + (d > 9 ? d : "0" + d);
}

window.onload = start;