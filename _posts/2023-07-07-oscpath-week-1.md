---
title: OSCPath - Week 1
author: alex
date: Thu  6 Jul 16:15:48 CEST 2023
categories: [OSCP Prep,Week 1]
tags: [oscp, learning path]
---

This week is an easy one for me as it covers topics I have already learnt by heart. It's always good to review them once in a while so this will help me to refresh some basic stuff and to learn a few new things as well. In my case, I have used Nessus in very few ocassions so this will help me sink and widen my knowled about it.

> **DISCLAIMER** 
>
> All the information I provide is for educational purposes only and I am no liable of any bad use or damage caused directly or indirectly using this information.
{: .prompt-danger }

## What will we be covering this week?

1. Report Writing for Penetration Testers
2. Information Gathering and Enumeration
    1. TCP/UDP Port Scanning Theory
3. Vulnerability Scanning
    1. How Vulnerability Scanners Work
    2. Types of Vulnerability Scans
    3. Things to consider in a Vulnerability Scan

**Exercises**

- Whois Enumeration
- Google Dorks
- Netcraft
- Port Scanning with Nmap and Netcat
- Working with NSE Scripts
- SMB, SMTP, SNMP Enumeration
- Nessus
- NSE Vulnerability Scripts

**Practice**

- **[Kioptrix #1](/posts/kioptrix-1-walkthrough/)** - includes report and OSCP-oriented report
- **[Kioptrix #2]()**
- **[Tr0ll]()**
- **[Lord Of The Root]()**
- **[Stapler: 1]()**

## 1. Report Writing for Penetration Testers 

Why don't we start with bureaucracy? *Yay!* 

Not even the amazing and exciting world of hacking is free of paperwork. As a penterster your job is not only hacking and getting into places - after the fun part you'll have to write a report. This report is a way to communicate your findings in a structured way so the Blue Team can fix them or the chiefs can take a decission on what the company should do.

And you may wonder: if it's the last step why learning it first? Answer: because I want to build a healthy methodology and get use to write reports so I will be writing an OSCP-like report for at least one of the VMs I hack into. And you should too. Not just to prepare for the OSCP but for your future.

So let's start with a very good video: **[How To Write A Penetration Testing Report](https://www.youtube.com/watch?v=NEz4SfjjwvU)** by **Hackersploit.** As he says, it's not the same a real world pentesting report and an OSCP-oriented pentesting report. **[Here](https://pentestreports.com/templates/)** you can download and compare some report templates.

As I am preparing for the OSCP I will have to use the **[template provided by OffSec.](https://pentestreports.com/templates/downloads/PWKv1-Report.docx)** But with a few additions the final result will get close to a real world pentesting report. 

Here are some extra resources for further reading:

- **[Penetration Testing Execution Standard](http://www.pentest-standard.org/index.php/Reporting)**
- **[SANS Whitepaper](https://www.sans.org/white-papers/33343/)** - a bit outdated but good as reference

## 2. Information Gathering and Enumeration

Now we get to the first stage of hacking: **reconnaissance.** Or information gathering and enumeration in this case. By far this is the most important part of any penetration testing and the one that would take longer so we better get good at it.

Information gathering can be passive and active and so I will split this section. If you want some additional material check out this video: **[Red Team Reconnaissance Techniques](https://www.youtube.com/watch?v=BWaGnsRirtU&t=161s&ab_channel=HackerSploit)**

### 2.1. Passive Information Gathering

**Passive Information Gathering** is the process of collecting information about your target using publicly available information. There are two approaches: manual approach and automated approach using info gathering tools. We will see both of them.

So let's learn about passive information gathering with some practice. Fire up your Kali Linux and let's begin!

> **USE OF THE INFORMATION** 
>
> Passive info gathering is completely legal as that info is publicly available. What you do with that info is up to you. You can do good or bad. Just don't do bad!
{: .prompt-warning }

#### Whois

**Whois** is a name for a TCP service, a tool, and a type of database. Whois databases contain name server, registrar, and, in some cases, full contact information about a domain name.

Here's a quick video by **HackerSploit** on how to use the *whois* tool: **[Whois Lookup](https://www.youtube.com/watch?v=12MITs5KK40&ab_channel=HackerSploit)**

**Exercise:**
1. Pick a target organization and use the *whois* tool in **Kali Linux** to identify the name servers of the target organization

#### Google Hacking

AKA **Google Dorking.** Here's a video that explains how you can find **A LOT** of stuff just using Google the right way: **[NetworkChuck's Google Hacking.](https://www.youtube.com/watch?v=hrVa_dhD-iA&ab_channel=NetworkChuck)** Practice all the stuff in the video and you'll have a solid foundation to start with. As a summary of the dorks: **site, inurl, intext, intitle, filetype.**

Now we know how to use Google to gather some information so I will be using Google to perform some information gathering following these exercises: 

**Exercises:**
2. Try to gather as much information as possible about the previous organization using Google
3. Try to find some juicy information/files using Google

Interesting resource: **[Google Hacking DB](https://www.exploit-db.com/google-hacking-database)** - here you can find a lot of searches you can perform in order to find juicy information with Google.

#### Netcraft

Netcraft can be used to indirectly find out information about web servers on the Internet, including the underlying operating system, web server version, and uptime graphs. 

I couldn't find any good resources about Netcraft except the **[official website](https://searchdns.netcraft.com/)** and page 90-91 of the **[OffSec PWK manual.](/assets/docs/Offensive_Security_Pentesting_with_Kali_(PWK).pdf)** 

**Exercise:**
4. Use **[Netcraft](https://searchdns.netcraft.com/)** to gather as much information about the previously chosen organization

#### Other Resources

There are many OSINT tools out there like **Maltego, theHarvester, Recon-ng, Sherlock...** But they are out of the scope of this post. **[Here](https://www.youtube.com/playlist?list=PLBf0hzazHTGPx4_jgz6wOJoj4cijSv1wW)**'s a really good list of videos by HackerSploit covering this topics.

> **OSINT**
>
> If you want to go deeper into Passive Information Gathering and OSINT check this **[Free OSINT Course by TCM Security](https://www.youtube.com/watch?v=qwA6MmbeGNo&t=1s&ab_channel=TheCyberMentor)** 
{: .prompt-tip }

### 2.2. Active Information Gathering

Once we have gathered enough information about our target, using open web resources, and other passive information gathering techniques, we can further gather relevant information from other, more specific services.

> **LEGAL SCOPE** 
>
> Some active info gathering may be illegal. Do not try it in targets you don't have permission to scan.
{: .prompt-danger }

Said so don't worry about practice as we will be using hosts made for this purpose. Here's a list of hosts you can legally scan:

- **Megacorpone** - OffSec provides us with a target: **megacorpone.com** (zone transfer enabled in *ns2*)
- **Zonetransfer** - A domain with zone transfer enabled: **zonetransfer.me**
- **[Scan Me](http://scanme.nmap.org/)** - Official service provided by nmap.org: **scanme.nmap.org**
- **Your own router/network** - If you are using internet at home go ahead and scan yourself
- **Any VMs in your fake CTF network**

#### DNS Enumeration and Zone Transfer

DNS is often a lucrative source for active information gathering. DNS offers a variety of information about public (and sometimes private!) organization servers, such as IP addresses, server names, and server functionality.

There is an interesting video by HackerSploit about DNS enumeration. It's quite old but still useful: **[DNS Enumeration And Zone Transfers](https://www.youtube.com/watch?v=EpfHhEGz35I&ab_channel=HackerSploit)**

**Exercises**

1. Find the DNS servers for the **megacorpone.com** domain
2. Write a small **Bash script** to attempt a zone transfer from megacorpone.com
3. Use *dnsrecon* to attempt a zone transfer from megacorpone.com

#### Port Scanning

Port scanning is the **process of checking for open TCP or UDP ports on a remote machine.** That said, the active phase involves more direct interaction with the target servers. It is vital that we understand the implications of port scanning, as well as the impact that certain port scans can have on a network.

> **LEGAL SCOPE** 
>
> Port scanning is illegal in many countries and should not be performed outside our lab enviroment or on targets made for that purpose.
{: .prompt-danger }

- **Port Scanning with Nmap**

Here's a video about port scanning with Nmap: **[NetworkChuck's Nmap Scanning.](https://www.youtube.com/watch?v=4t4kBkMsDbQ&t=872s&ab_channel=NetworkChuck)** Nmap is a huge tool with plenty of possibilities - this is a basic usage video but enough for our purposes right now. The video also explains **TCP scans theory** and the **3-way handshake.**

If you want to know more about Nmap, I recommend you to check **[HackerSploit's Nmap Series.](https://www.youtube.com/playlist?list=PLBf0hzazHTGM8V_3OEKhvCM9Xah3qDdIx)** This is gold and will give you solid knowledge about this tool.

**Exercises**

1. Use **nmap** to conduct a ping sweep of your target IP range and save the output to a file, so that you can grep for hosts that are online.
2. Scan the IPs you found in exercise 1 for open webserver ports. **Use nmap to find the web server and operating system versions.**
3. Explore the various command line options that nmap offers while scanning an online host you discovered within your target IP range. Monitor the bandwidth usage changes for the different options. Weigh the use of collecting as much information as possible against the resources it takes to gather it.

- **Port Scanning with Netcat**

**Netcat** is another powerful tool although I have never use it for port scanning. I have used it for reverse shells and to send strings to specific ports (you'll see what I mean in future VMs and CTFs). But let's see how we can perfom a port scan with this **TCP/IP swiss army knife.**

Here's a good and quick video about **[Port Scanning with Netcat](https://www.youtube.com/watch?v=CKiw0JYHrwQ&ab_channel=ITProTV)** by **ITProTV.** As we can see it's not as easy and straight forward as with Nmap.

We will actually need to write a **little Bash script:**

```bash
for i in $(seq 1 65535); do nc -nvz -w 1 127.0.0.1 $i 2>&1; done | grep -v "refused"
```

#### Working with NSE Scripts

The **Nmap Scripting Engine (NSE)** allows users to write simple scripts in order to automate various networking tasks. HackerSploit has a fantastic **[Introduction to Nmap Scripting Engine (NSE)](https://www.youtube.com/watch?v=ceGywKe8RnY&list=PLBf0hzazHTGM8V_3OEKhvCM9Xah3qDdIx&index=22&ab_channel=HackerSploit)** video.

We will use this feature in the next section during **SMB, SMTP and SNMP Enumeration.**

#### Enumeration 

**Enumeration** is used to gather more information that helps cybersecurity teams **identify system weaknesses and map out the network’s attack surface.** It is considered a crucial part of the penetration testing process as it provides an insight into metrics and outcomes that are directly used to craft exploits and test the system’s security flaws.

We have already covered **DNS Enumeration** and now we are covering **SMB, SMTP and SNMP Enumeration.**

- **SMB Enumeration**

The **Server Message Block** protocol’s security track record has been poor for over a decade. That's why an open SMB port in the Nmap output makes me cry tears of joy!

We could use **Nmap NSE** to enumerate SMB but we should know the basic and specific commands for it as well. So we will be using the following tools: **smbclient** and **nbtscan.** 

**HackerSploit** has a really good video that shows the basics of SMB Enumeration: **[NetBIOS and SMB Enumeration.](https://www.youtube.com/watch?v=1kFKlseU3jQ&ab_channel=ElevateCyber)**

You can also check the tool **enum4linux** that comes preinstalled with Kali. It basically wraps **smbclient, rpcclient, net** and **nmblookup** tools so, instead of checking one by one, you can just do it with one tool.

Now if you want to know how to enumerate SMB with Nmap you can watch this video: **[SMB Enumeration with Nmap](https://www.youtube.com/watch?v=5kLPfVsOxzY&ab_channel=HackerSploit)**

- **SMTP Enumeration**

In certain vulnerable configurations, mail servers can also be used to gather information about a host or network. **SMTP** supports several important commands, such as *VRFY* and *EXPN*. These can often be abused to verify existing users on a mail server, which can later aid the attacker.

For SMTP Enumeration we are going to use Nmap NSE. I leave you here a video by HackerSploit about **[SMTP Enumeration with Nmap.](https://www.youtube.com/watch?v=72D7kV8Q8lE&ab_channel=HackerSploit)**

- **SNMP Enumeration**

Over the years, **Simple Network Management Protocol (SNMP)** has been a poorly understood protocol by many network administrators. This often results in SNMP misconfigurations, which resulted in dramatic information leakages.

I have never faced the need for SNMP Enumeration and I can't find any resources that can teach this properly so let's leave it for the pages 132-135 of the **[OffSec's PWK Manual](/assets/docs/Offensive_Security_Pentesting_with_Kali_(PWK).pdf)** 

#### Other resources

I'm not going to dive very deep into **Living off the Land Techniques** right now. If you want more info about this **Tactics, Techniques and Procedures (TTPs)**, **[here](https://darktrace.com/blog/living-off-the-land-how-hackers-blend-into-your-environment)** is a good article. Feel free to further investigate yourself about this topic.

## 3. Vulnerability Scanning

**Vulnerability scanning** is the process of using automated tools to discover and identify vulnerabilities in a network. We will be using two tools for this task: **Nmap with NSE** and **Nessus.**

First let's comprehend how vulnerability scanners work with a video which is part of a highly recommended series about Nessus by our friend **HackerSploit:** **[Introduction to Vulnerability Scanning.](https://www.youtube.com/watch?v=fG7HhqEJbTs&ab_channel=HackerSploit)** This video doesn't apply just to Nessus but to all other vulnerability scanners.

And before we continue with Nessus let's have a quick look on how to perform **[Vulnerability Scanning with Nmap and NSE.](https://www.youtube.com/watch?v=W0KRYkZppIw&ab_channel=HackerSploit)**

> **NETWORK OVERLOAD** 
>
> Mass vulnerability scans can generate a great amount of traffic and, in some cases, this can result in **Denial of Service** on many network devices. Caution must be exercised.
{: .prompt-warning }

Ok, now it's time to get Nessus up and running. With the following two videos we will have Nessus installed and configured and we will be able to perform our first vulnerability scan:

- **[Installing and Configuring Nessus](https://www.youtube.com/watch?v=wf3XQcHT6aw&list=PLBf0hzazHTGOepimcP15eS6Y-aR4m6ql3&index=48&ab_channel=HackerSploit)**
- **[Host Discovery and Vulnerability Scanning with Nessus](https://www.youtube.com/watch?v=TA1rCRyHRsM&list=PLBf0hzazHTGOepimcP15eS6Y-aR4m6ql3&index=49&ab_channel=HackerSploit)**

And that's all the theory and exercises for this first week. There's a lot of knowledge that needs to sink in and a few hands on exercises would help. **Now it's time to hack our way into some VMs.**