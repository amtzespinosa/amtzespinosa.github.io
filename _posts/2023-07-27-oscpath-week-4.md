---
title: OSCPath - Week 4
author: alex
date: Thu 27 Jul 10:56:33 CEST 2023
categories: [OSCP]
tags: [oscp, learning path]
---



> **DISCLAIMER** 
>
> All the information I provide is for educational purposes only and I am no liable of any bad use or damage caused directly or indirectly using this information.
{: .prompt-danger }

## What will we be covering this week?

1. Locating Public Exploits
2. Customizing and Fixing Exploits

**Exercises**

- ExploitDB
- Exploit Frameworks
- SearchSploit
- Nmap NSE Scripts
- Fixing the Exploit
    - Changing the Overflow Buffer
    - Troubleshooting the "index out of range" Error
- Cross-Compiling Exploit Code

**Practice**

For practice, almost any VM would do the job. Here are the VMs I will be exploiting:

- **[Kioptrix #3]()** 
- **[Kioptrix #4]()**
- **[FristiLeaks]()**

## 1. Locating Public Exploits

Before we start our search for exploits, I might say a **word of caution**. 

> **FAKE EXPLOITS** 
>
> Quite often, malicious hackers release fake exploits into the wild, with the purpose of compromising, or otherwise harming, anyone running this code.
{: .prompt-danger }

Please, be careful when running an exploit you didn't make yourself. Always try to use exploits from reliable sources like **ExploitDB** and **SecurityFocus** vulnerability archives. The exploits on these sites usually undergo close examination, and are not published if deemed fake. **Github** is another place to find exploits but they are not examined, always check in the **Issues** section for warnings, **Pull Requests** and so on...

If you want to know more about exploit development, useful when customizing and fixing exploits, I recommend you the book **Hacking: The Art Of Exploitation**.

Said so, let's begin finding good exploits in the wild.

### [ExploitDB](https://www.exploit-db.com/)

The **Exploit Database** is maintained by Offensive Security, and provides an online and offline (SearchSploit) copy of all the archived exploits it contains. 

### Exploit Frameworks

**Exploitation frameworks**, such as Metasploit, and Canvas, are designed to detect and exploit software and hardware vulnerabilities in target systems. Later, we will cover the most famous exploitation framework, **Metasploit**. 

### SearchSploit

ExploitDB archive is present in Kali Linux and accesible with **SearchSploit**, and has some useful search features. 

Try running on your Kali VM `searchsploit slmail`. Once you get the list of available exploits with the *slmail* string on it, try to locate them: `locate /643.c`. Then you'll get the file path of the exploit.

### Nmap NSE Scripts

We have already talked about the **Nmap Scripting Engine** for enumeration but it can be also used for exploitation purposes. You can find NSE exploits **[here](https://nmap.org/nsedoc/categories/exploit.html)**. The Nmap tool is not really meant to be an exploitation tool so the amount of NSE exploits is small. 

## 2. Customizing and Fixing Exploits

Due to varying development environments, vulnerable software versions, and different software patches, it is understandable that many (if not most) of the public exploits found on the Internet will not work straight out of the box. We’ll find everything from wrong offsets, return addresses intended for different operating systems or patch levels, and bad code.

> **ONE SHOT EXPLOITS** 
>
> In addition to this mess, many exploits might be one shots, meaning that if the exploit is unsuccessful, the service will crash, and will not be available for further exploitation attempts until it is restarted, or until the machine is rebooted.
{: .prompt-warning }

### Setting Up a Development Environment

For the reasons above, we will never run an exploit without first examining its code and understanding its inner workings. Once we have done that, we will set up a small development environment which matches the operating system version and vulnerable software version, in order to test and improve existing exploits. Once we are fairly certain that our fixed exploit will work on the target machine, we can then proceed to launch it against it.

### Dealing with Various Exploit Code Languages

Exploit code can come in all forms. From **Python**, **Perl** and **Ruby** scripts, to **C** or **C++**. And, to further complicate things, languages such as **C** and **C++** have different flavors between Linux/Unix and Windows, and this **code is often not cross-compatible**. For example, in our previous search for additional SLMail exploits, in the **ExploitDB** archive, we found several results.

### Cross-Compiling Exploit Code

Sometimes the code directives will indicate that the code should be compiled in a Windows environment. Fortunately, **Kali Linux has a Windows cross compiler**, which we can use for this task, called **mingw**. If not already installed, we can install it using the command: `apt-get install mingw-w64`. Once installed we can use the mingw cross compiler to compile this code into a Windows PE executable, and then run this executable on Kali Linux using **wine**.

This is all the theory for this week. Later we will be setting up an enviroment to test all of this and learn, by practice, how to deal with exploits errors and how to fix them.