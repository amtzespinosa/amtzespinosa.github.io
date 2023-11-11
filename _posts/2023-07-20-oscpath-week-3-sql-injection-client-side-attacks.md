---
title: "OSCPath Week 3: SQL Injection and Client-side Attacks"
author: alex
date: Thu 20 Jul 10:56:33 CEST 2023
categories: [OSCP]
tags: [oscp, learning path]
---

Third week of the OSCP learning path! In this week we are going deeper into **Web Application Pentesting**. I recommend paying special attention to this week and the previous one as the number web apps keep growing everyday and so their vulnerabilities -- and so **Bug Bounty programs**! This week covers 2 main topics: **SQL Injection and Client-side Attacks.**

> **DISCLAIMER** 
>
> All the information I provide is for educational purposes only and I am no liable of any bad use or damage caused directly or indirectly using this information.
{: .prompt-danger }

## What will we be covering this week?

1. SQL Injection Attacks
2. Client-side Attacks

**Exercises**

- Blind SQL Injections
- Automating the Attack
- Information Gathering
- Client Fingerprinting
- Preparing the Attack
- Installing Microsoft Office
- Leveraging Microsoft Word Macros
- Obtaining Code Execution via Windows Library Files

**Practice**

Instead of VMs, I will be using vulnerable web apps as practice.

- **[DVWA](/posts/dvwa-2023-walkthrough/)** 
- **[bWAPP](/posts/bwapp-2023-walkthrough/)**

If you want to try other vulnerable web apps, here's a list of some of them:

- **[OWASP's Vulnerable Web Apps Directory](https://owasp.org/www-project-vulnerable-web-applications-directory/)**

For the **Windows** part of the practice I will be installing the OS on a VM and play around. You can check all the practice on its own post.

## 1. SQL Injections Attacks

**SQL Injection** is a common web vulnerability found in dynamic sites that is caused by unsanitized user input, which is then passed on to a database. These types of vulnerabilities can lead to database information leakage and, depending on the environment, could also lead to complete server compromise.

To learn and practice all the SQL basics I have used **[PortSwigger's learning path.](https://portswigger.net/web-security/sql-injection)** 

### SQL Theory and Database Types

To check all the theory I recommend you to go straight to **PortSwigger**. There are plenty of videos on YouTube as well. Here are some videos from basic to advance:

- **[NetworkChuck's SQLi Tutorial for Beginners](https://www.youtube.com/watch?v=2OPVViV-GQk&t=379s)**
- **[David Bombal ft. Rana Khalil Beginner to Advance SQLi](https://youtu.be/yusJWttsD5o)**

And any other video by **[Rana Khalil](https://www.youtube.com/@RanaKhalil101)** covering SQLi will be useful.

As you may see, there are different SQL databeses types that slightly differ one another. The most common pair you'll probably find when testing web apps is **MySQL** + **PHP** so it would be a smart decission to learn them. Although there might be some differences between databases types when querying, they all follow similar basic structures.

### Manual SQL Exploitation

First we need to know if any SQL vulnerability is present. We can do so by submitting some queries:

- Submitting the **single quote character** `'` and looking for errors or other anomalies.
- Submitting some **SQL-specific syntax** that evaluates to the original value of the entry point, and to a different value, and looking for systematic differences in the resulting application responses.
- Submitting **Boolean conditions** such as OR 1=1 and OR 1=2, and looking for differences in the application's responses.
- Submitting **payloads designed to trigger time delays** when executed within a SQL query, and looking for differences in the time taken to respond.
- Submitting **OAST payloads** designed to trigger an out-of-band network interaction when executed within a SQL query, and monitoring for any resulting interactions.

Once we know thay a vulnerability exists, we can start performing some exploitation. I would recommend you to cover both the PortSwigger's labs and the OSCP manual I mentioned in **[My OSCPath post](/posts/oscpath-oscp-certification-guide/)**.

According to the OSCP Syllabus we should understand:

- **[UNION SQLi](https://portswigger.net/web-security/sql-injection/union-attacks)**
- **[Error SQLi](https://portswigger.net/web-security/sql-injection/blind#error-based-sql-injection)**
- **[Blind SQLi](https://portswigger.net/web-security/sql-injection/blind)**

### Manual and Automated Code Execution

As well as being able to exploit **MSSQL Databases with xp_cmdshell** (more about this in it's own post about **MS Exploitation**) we should know how to automate SQLi with **SQLmap**. Here's a video on how to automate SQLi:

- **[SQLi with SQLmap](https://youtu.be/nVj8MUKkzQk)**

## 2. Client-Side Attacks

These section is mainly focused on Microsoft Exploitation so it will be very short as I will only be covering **Target Reconnaissance**. The rest will have its own post! 

**Client-Side** attacks are probably the most insidious form of remote attack. A client side attack involves exploiting a weakness in client software, such as a browser, in order to gain access to a machine.

### Information Gathering

The issue with client side attacks, from an attacker’s standpoint, is that the enumeration of the victim client software cannot be done easily. Therefore, the secret to success in client side attacks is once again **information gathering**. We can gather information about an unreachable target, or client software, **passively** or **actively**.

#### Passive Information Gathering

One of the best methods is searching **Google** for known target's external IPs, and eventually you may come across a site that collects user agent data from certain affiliate sites, and then makes it public. This way you may find the browser used and the OS os the machine and taylor an exploit for it.

#### Active Information Gathering

This is any action that involves **direct contact** with the target organization or its users, such as placing a phone call and impersonating a company support technician of a frustrated client, in an attempt to extract useful information from the person on the other side of the line.

This could also involve sending an initial email to the target, with hope for a response, or a link click, that would lead the victim’s browser to a page that enumerates the user’s
browser version, and installed extensions.

#### Social Engineering in Client-Side Attacks

As most client side attacks require some form of interaction with the target (requiring the target to click on a link, open an email, run an attachment, open a document, etc), supporting this operation with social engineering efforts can greatly increase your chances of success. I recommend you to read teh book **Social Engineering: The Art of Human Hacking** to learn a bit more about this topic.

### Leveraging Client Fingerprinting

Client or browser fingerprinting is a tracking and identification method websites use to associate individual browsing sessions with one site visitor. Using Javascript, a lot of data can be collected about a user’s web browser and device. Here's a project that showcases this: **[FingerprintJS](https://github.com/fingerprintjs/fingerprintjs)**. I have even built my own based on it, you can check it here: **[Fingerprinter](/projects/fingerprinter)**. 

We can obviously use all this data to gather information about the client and, as mentioned before, taylor an exploit, phising campaign, etc...

That's it for this week. It may look a bit contentless but almost all the things should be learnt by doing so I am preparing a specific lab for this matter!
