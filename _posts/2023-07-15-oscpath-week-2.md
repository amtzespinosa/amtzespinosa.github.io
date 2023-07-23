---
title: OSCPath - Week 2
author: alex
date: Sat 15 Jul 10:56:33 CEST 2023
categories: [OSCP]
tags: [oscp, learning path]
---

Second week of the OSCP learning path! In this week we are taking our first steps into **Web Application Pentesting**. I recommend paying special attention to this week and the following as the number web apps keep growing everyday and so their vulnerabilities -- and so **Bug Bounty programs**! I haven't found many videos covering web topics in a structured manner as the previous week but I have tried my best to supply you with as many resources I have found and tested.

> **DISCLAIMER** 
>
> All the information I provide is for educational purposes only and I am no liable of any bad use or damage caused directly or indirectly using this information.
{: .prompt-danger }

## What will we be covering this week?

4. Introduction to Web Applications Attacks
5. Common Web Application Attacks

**Exercises**

- Security Testing with Burp Suite
- Enumerating and Abusing APIs
- Privilege Escalation via XSS
- Absolute vs Relative Paths
- Identifying and Exploiting Directory Traversals
- Encoding Special Characters
- Local File Inclusion (LFI)
- PHP Wrappers
- Remote File Inclusion (RFI)
- Using Executable Files
- Using Non-Executable Files
- OS Command Injection

**Practice**

Instead of VMs, I will be using vulnerable web apps as practice.

- **[DVWA](/posts/dvwa-2023-walkthrough/)** 
- **[bWAPP](/posts/bwapp-2023-walkthrough/)**

If you want to try other vulnerable web apps, here's a list of some of them:

- **[OWASP's Vulnerable Web Apps Directory](https://owasp.org/www-project-vulnerable-web-applications-directory/)**

## 1. Introduction to Web Applications Attacks

### Methodology and Vulnerabilities

To learn about web application testing we can start **[here](https://owasp.org/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/00-Introduction_and_Objectives/README)**. This is the **OWASP's Web Security Testing Guide**, a very detailed guide about web security. I know it's quite a long guide but for now we only need point 4 as an introduction.

After reading this we will have a better understanding about webapp pentesting. Now we need to know the **[OWASP Top 10](https://owasp.org/Top10/)** - the 10 most common web application vulnerabilities. Here's the list simplified (2023):

1. Broken Access Control
2. Cryptographic Failures
3. Injection
4. Insecure Design
5. Security Misconfiguration
6. Vulnerable and Outdated Components
7. Identification and Authentication Failures
8. Software and Data Integrity Failures
9. Security Logging and Monitoring Failures
10. Server Side Request Forgery (SSRF)

### Tools

The most common tool used for web app testing is **Burp Suite**. Although it's not the only one it's probably the one you're gonna use the most. If you want to know more about a similar tool but **open source**, check the **[OWASP Zed Attack Proxy](https://www.zaproxy.org/)** tool.

Here's a good video by the great **John Hammond** on **[How to Use Burp Suite Community Edition](https://www.youtube.com/watch?v=G3hpAeoZ4ek&t=1423s)** (free).

### Enumeration

Before we can start exploiting a web app we have to perform some enumeration. **The Cyber Mentor** has a really good playlist about enumeration and exploitation: **[Web App Testing](https://www.youtube.com/playlist?list=PLLKT__MCUeixCoi2jtP2Jj8nZzM4MOzBL)**

> **NOTE:** 
> 
> I don't know why but OffSec places **Cross-Site Scripting (XSS)** inside *Introduction to Web Applications Attack*. I am gonna put it under the next section as it has more sense in my opinion. 

Now let's dive into the most common attacks.

## 2. Common Web Application Attacks

To cover this entire section I will be taking **[PortSwigger's Web Security Learning Path](https://portswigger.net/web-security/learning-path)**. Here you can find the explanation of all this common attacks and labs to practice them. I would recommend you check **[Rana Khalil's YouTube Channel](https://www.youtube.com/@RanaKhalil101)** for further information about the labs and the vulnerabilities covered.

> **TIP**
> 
> Use all this simple labs to start building a web app testing cheat sheet. It would be useful in a future!
{: .prompt-tip }

I am following the steps described **[here](https://portswigger.net/web-security/certification/how-to-prepare#step-1-complete-one-lab-from-every-topic)**. I'm mixing both **PortSwigger** and **OffSec** Guides so we will cover just 5 types of attack this week:

### Cross-Site Scripting (XSS)

Simply put, **XSS is one of the most important vulnerabilities out there**. It's both incredibly common and extremely powerful, especially when used as part of a wider exploit chain. This is a huge topic, with plenty of labs for complete beginners and seasoned pros alike.

To learn the basics and perform some easy XSS I would be using **PortSwigger Academy**. **[Here](https://portswigger.net/web-security/cross-site-scripting)** you can find the XSS section with some fairly easy labs.

### Directory Traversal

**Directory traversal** (also known as file path traversal) is a web security vulnerability that allows an attacker to read arbitrary files on the server that is running an application. 

To learn the basics and perform some easy directory traversal I would be using **PortSwigger Academy**. **[Here](https://portswigger.net/web-security/file-path-traversal)** you can find the Directory Traversal section with some fairly easy labs.

### File Inclusion Vulnerabilities 

First, we should learn the **difference between File Inclusion and Directory Traversal vulnerabilities:**

**Directory Traversal** is when a server allows an attacker to read a file or directories outside of the normal web server directory. **Local File Inclusion (LFI)** allows an attacker the ability to include an arbitrary file in the web server to be executed locally. And **Remote File Inclusion (RFI)** is an attack targeting vulnerabilities in web applications that dynamically reference external scripts.

PortSwigger doesn't have File Inclussion labs as in July 2023 but here are some resources I found useful:

- Elevate Cyber's **[LFI for OSCP](https://www.youtube.com/watch?v=2qhdGyfk6iA)**
- Loi Liang Yang's **[RFI Explanation and Demonstration](https://www.youtube.com/watch?v=jG5FENEbGEg)**

- **[Advanced Local and Remote File Inclusion - PHP Wrappers](https://www.youtube.com/watch?v=cPSYuodIq9s)**

### File Upload Vulnerabilities 

Back to PortSwigger! **[Here](https://portswigger.net/web-security/file-upload)**'s the **File Upload** section. Pay special attention to this section as it is very useful -- you'll prove this true while hacking VMs.

File upload vulnerabilities are when a web server allows users to upload files to its filesystem without sufficiently validating things like their name, type, contents, or size. Failing to properly enforce restrictions on these could mean that even a basic image upload function can be used to upload arbitrary and potentially dangerous files instead.

### Command Injection 

**[Here](https://portswigger.net/web-security/os-command-injection)**'s the **OS Command Injection** section from PortSwigger. 

OS command injection (also known as shell injection) is a web security vulnerability that allows an attacker to execute arbitrary operating system (OS) commands on the server that is running an application, and typically fully compromise the application and all its data.

By now, that's all for this second week. I think that **PortSwigger's Learning Path** only scratches the surface of Web App Testing so maybe I will need further reading and practice about the topics. Anyway, it's a really good starting point! Check **[my posts about Web App Testing](https://amtzespinosa.github.io/pwned!/#web-apps)** to learn how to exploit all this vulnerabilities.
