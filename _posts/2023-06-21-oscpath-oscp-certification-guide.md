---
title: "My OSCPath: OSCP Certification Guide"
author: alex
date: Wed 28 Jun 14:19:21 CEST 2023
categories: [OSCP]
tags: [oscp, learning path]
img_path: /assets/img/posts/2023-06-21-oscpath/
image:
  path: oscp.png
  alt: OSCP Logo.
---

I have decided to get the OSCP certification and to post all my progress, study resources used and steps taken in this post so anybody interested can follow along or use it as a guide for their own path and, once I get my OSCP, I will probably turn all the posts into tutorials!

## Background

I’m not a newbie neither an expert. Let’s say I’m an intermediate level pentester looking for a step up in his career. I got my **CompTIA A+** years ago and recently got my CCST Networking and Cybersecurity. So for me the beginning of this OSCP learning path will serve as a refresher of the basics.

I have already solved many OSCP-like CTFs and hacking challenges but still there are many more to solve so I will post the write-ups and index all those posts **[here.]()**

## How this post will be organized

I have decided to structure the learning following the **12 week OSCP learning plan by OffSec** - you can find it **[here](https://help.offsec.com/hc/en-us/articles/15541765522196-OffSec-PEN-200-Learning-Plan-12-Week-#h_01H0KWJ0351T94C08S37WHCF0A).** This post will serve as an index/checklist and recap of the most important stuff of the entire process as well as an index for interesting material, resources and general guidelines.

Each week will have it’s own post for further explanation and assessment. And, if you take care of the considerations listed below, some points (at the beginning) won't be necessary.

## Considerations

### Note taking skills

Taking notes during pentesting is crucial. I have proven this true many times during CTFs, learning processes and Red Team engagements. In my case I will use this blog as my hierarchical note taking application but you can use whatever fits your needs. I normally use **Cherry**, the one that comes preinstalled with Kali Linux.

Some people neglects and don't pay attention to note taking and as a consecuence they utterly fail. I can't emphasize enough how impotant this skill is. If you wonder why, here are some reasons:

- **During CTFs:** CTFs and Vulnerable VMs are used to learn by practice and you'll learn a lot of stuff, commands and procedures that are easy to forget. If you want to keep track of your progress, you better take notes of everything that may come handy in future situations.
- **During learning:** at the beginning many concepts won't sink as fast or easily as others and I have found usefull writing things down for further and deeper study. And remember: all the theory you read would have to be applied in practical tests as well.
- **During real world engagements:** Red Team engagements may last weeks or even months and the job won't be done until you write a detailed report and collaborate with the Blue Team to solve the weaknesses found. Would you remember everything you did 3 months ago? Likely not so write down all your steps to replicate any process if needed.

### Fluency using Linux

This skill can be improved during the learning process but it would be better if you already have some basic Linux knowledge. If you are new to Linux, here are some resources that may come handy as an introduction:

- **[Networkchuck's Linux Course](https://www.youtube.com/playlist?list=PLIhvC56v63IJIujb5cyE13oLuyORZpdkL)** - Fun and beginner friendly
- **[HackerSploit's Linux Essentials for Ethical Hackers](https://www.youtube.com/watch?v=1hvVcEhcbLM)** - Focused on **Ethical Hacking**
- **[FreeCodecamp's Linux Crash Course](https://www.youtube.com/watch?v=ROjZy1WbCIA)** - Good if you are completely new to Linux

- **[TCM Kali Linux Course](https://www.youtube.com/watch?v=U1w4T03B30I)** - This video focuses on Kali Linux rather than any other distro. It is a really good starting point as we will be using **Kali Linux** during the learning path.

And to practice all of this, I recommend to solve the **[OverTheWire's Bandit challenges.](https://overthewire.org/wargames/bandit/)** This will as well introduce you to using SSH for remote connections.

### Previous knowledge

Although the OSCP is an entry-level certification, it covers a lot of stuff so it would be better to have some previous knowledge. As I said, I'm not new to IT and Pentesting and after reading the OSCP syllabus I would recommend to have some previous knowledge. 

> **SAVE MONEY!** You don't actually need the certifications but the knowledge they provide.
{: .prompt-tip }

If you are completely new to IT I would recommend you start with the CompTIA A+ as a basic IT foundation. As I said, you don't need the certification, only the knowledge. Here's a complete A+ course:

- **[CompTIA A+](https://www.youtube.com/watch?v=1CZXXNKAY5o)**

If you already have some basic IT knowledge I would go for the next 2 basic foundations:

- **[CompTIA Security+](https://www.youtube.com/watch?v=9Hd8QJmZQUc)**
- **Networking** (just go for one of them):
  - **[CompTIA Network+](https://www.youtube.com/watch?v=xmpYfyNmWbw)**
  - **[Cisco CCNA](https://www.youtube.com/playlist?list=PLxbwE86jKRgMpuZuLBivzlM8s2Dk5lXBQ)**

Another basic and necessary skill is programming. **Python, Golang, Bash, PHP, Perl...** There are hundreds of programming languages. Pick one to start with - I would recommend Python. Here are some resources to help you learn it:

- **[Cisco Python Essentials](https://skillsforall.com/course/python-essentials-1?courseLang=en-US)** - This will prepare you for the PCEP
- **[FreeCodecamp Python for Everybody](https://www.youtube.com/watch?v=8DvywoWv6fI)**

- **[Python for Hacking](https://www.thepythoncode.com/topic/ethical-hacking)** - Quite advance but highly recommended to learn how to build your own hacking tools

In my opinion this is the basic knowledge needed before going into Pentesting - if you want to be a good pentester. 

And to add a bit of extra knowledge prior the OSCP prep I would take a basic Ethical Hacking course. Here are the ones I have taken already:

- **[Cisco Introduction to Cybersecurity](https://skillsforall.com/course/introduction-to-cybersecurity?courseLang=en-US)** - Basic introductory course
- **[EC Council CEH Free Course](https://www.youtube.com/watch?v=Xtf_Nn4UX4k)**

- **[TCM Security Practical Ethical Hacking](https://academy.tcm-sec.com/p/practical-ethical-hacking-the-complete-course)** - **Highly recommended** as it covers some usually non-covered topics like **Active Directory** (it's not free, I got lucky and joined the course during a 24h. period when they were giving it away for free. Anyway, it's worth it)

In case you don't want to pay, you can find the first half of this course (which should be enough) for free on YouTube: **[Free Practical Ethical Hacking Course Part 1](https://www.youtube.com/watch?v=3FNYvj2U0HM&t=25366s&ab_channel=TheCyberMentor)**

If you want to simplify a little bit the path and just focus your attention to one knowledge provider that one should be **Cisco.**

In their online academy they offer, completely for free, their **[Cybersecurity Career Path](https://skillsforall.com/career-path/cybersecurity?courseLang=en-US)** **(covering security, networking and cybersecurity)** and two Python courses (one that prepares for the **PCEP** and the next one that prepares for the **PCAP**).

So, if you already have some basic IT knowledge, go the Cisco way and start hacking VMs. That should be enough to build a strong knowledge prior the OSCP.

### Practice enviroment

Practice is by far the most important aspect to master. You can apply all the theory you are learning while solving hacking challenges, CTFs, vulnerable VMs... 

**So building a practice lab is a must.** A practice lab is a secure environment where you can boot vulnerable machines and hack them without any risks of exposing those vulnerabilities to the wild wild web.

My lab consists in a bunch os Virtual Machines running in VirtualBox connected to a virtual intranet. Many of the resources above will guide you through the process setting up VirtualBox and VMs.

## OSCP: 12 week learning plan

In addition to this plan, we will be hacking into vulnerable VMs. I don't have a curated lists of VMs yet but I will once I'm done with the whole process. I aim for an average of **5 VMs weekly** what makes a total of 60 VMs at the end of the learning path.

If you want to check the official OffSec Syllabus for the course to make sure you are covering everything, **[here](https://www.offsec.com/wp-content/uploads/2023/03/pen-200-pwk-syllabus.pdf)** it is!

And I leave you as well the **[Offensive Security - Pentesting with Kali (PWK) pdf](/assets/docs/OSCP_Course.pdf)** as a guide of contents!

### **[Week 1](/posts/oscpath-week-1-report-writing-information-gathering-enumeration-vulnerability-scanning/)**

- [x] Report Writing for Penetration Testers
- [x] Information Gathering and Enumeration
- [x] Vulnerability Scanning 

I have omitted the first three topics of this week as they should have been covered already following the **[Considerations](#considerations)** listed above. OffSec proposes some exercises to practice all the theory learnt in those modules - and sure we will do them.

### **[Week 2](/posts/oscpath-week-2-web-application-attacks/)**

- [x] Introduction to Web Application Attacks
- [x] Common Web Application Attacks

### **[Week 3](/posts/oscpath-week-3-sql-injection-client-side-attacks/)**

- [x] SQL Injection Attacks
- [x] Client-side Attacks

### **[Week 4](/posts/oscpath-week-4-locating-fixing-public-exploits/)**

- [x] Locating Public Exploits
- [x] Fixing Exploits

### **[Week 5](/posts/oscpath-week-5-antivirus-evasion-password-attacks/)**

- [x] Antivirus Evasion
- [x] Password Attacks

### **[Week 6](/posts/oscpath-week-6-windows-linux-privilege-escalation/)**

- [x] Windows Privilege Escalation
- [x] Linux Privilege Escalation

### **[Week 7](/posts/oscpath-week-7-port-redirection-ssh-tunneling/)**

- [x] Port Redirection and SSH Tunneling

### **[Week 8]()**

- [x] Tunneling Through Deep Packet Inspection
- [x] The Metasploit Framework

### **[Week 9]()**

- [ ] Active Directory Introduction and Enumeration
- [ ] Attacking Active Directory Authentication

### **[Week 10]()**

- [ ] Lateral Movement in Active Directory

### **[Week 11]()**

- [ ] Assembling the Pieces

### **[Week 12]()**

- [ ] Exam Simmulation
