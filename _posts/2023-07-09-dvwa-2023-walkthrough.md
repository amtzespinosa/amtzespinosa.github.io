---
title: DVWA 2023 Edition
author: alex
date: Thu  6 Jul 16:15:48 CEST 2023
categories: [DVWA,Walkthroughs]
tags: [dvwa, ctf, walkthroughs, web hacking]
img_path: /assets/img/posts/2023-07-09-dvwa-2023-walkthrough/
image:
  path: dvwa.png
  alt: DVWA Logo.
---

**Damn Vulnerable Web Application** (DVWA for short) is an application for testing web apps security vulnerabilities. It is built using **PHP** and **MySQL** -- a pretty common couple in web app development. If you want more info about this amazing resource that still very relevant today, check its **[official repo](https://github.com/digininja/DVWA)**.

The post will be divided into each vulnerability and each vulnerability into the four levels of security provided by DVWA: **Low**, **Medium**, **High** and **Impossible**. Let's get DVWA running in our Kali Linux VM: `sudo dvwa-start`. In case you don't have DVWA installed, run: `sudo apt install dvwa`

## Brute Force

Let's start with the **brute force** side of this web app pentesting training tool. **Brute force** is an attack that works by trying various combinations of symbols, words, or phrases. The purpose of it is to guess a password, combination of username/password, directory or whatever the attacker wants to find out. Usually, to accomplish this, big dictionaries are used.

There are many tools and dictionaries you can use. It doesn't matter if you use Hydra, Burp Suite, JohnTheRipper or rockyou.txt. I will be using **Burp Suite** as we are testing a web app and it's a pretty simple tool to use for this purpose. I have two files I will use as dictionaries: *common-users.txt* to brute force users and *10k-common-pass.txt* to brute force passwords.

### Low

With the **Low** level there are no security measures against brute force attacks so it should be easy and pretty straight forward to compromise the web app.

> **NOTE:** As this is not a Burp Suite tutorial I will take for granted that you know how to use Burp Suite.

Once we are on the Login (Brute Force) page we can turn on the proxy on our browser and the *proxy > intercept* on Burp Suite to **intercept de GET request** and send it to *intruder*. We can use some dummy credentials. Try to login with **user** and **pass**. 

![DVWA Intercept Request](/intercept.png)

Once we intercept the request, it's time to send it to the *intruder* and use a **Cluster Bomb Attack** to brute force. Now we have to load the files for the brute force: 
- **Payload set 1** > *common-users.txt*
- **Payload set 2** > *10k-common-pass.txt*

![DVWA Set Cluster Bomb Attack](/attack.png)

Once the attack is running the only thing we have to do is check for the response size as a valid login response will be bigger (in this case) than an invalid credentials response. Once we get the candidate, our last step should be going back to the *proxy* tab and **change the username and password on the original request** for the found ones and forward the request to log in sucessfully.

![DVWA Check for Response Size Change](/check.png)

### Medium

The process for the **Medium** level of security is the same. The only difference is the 2 delay between requests. This means more it would take more time to test the same amount of combinations so, if you have a huge dictionary like *rockyou.txt* and the password is at the end of the file, it will take ages to find the combination.

### High

Here I got a bit of controversy. Googling around I found **[this article](https://bughacking.com/dvwa-ultimate-guide-first-steps-and-walkthrough/#Brute_Force)** that states: *With the High difficulty we get a CSRF token with each of the requests. As every time it is unique combination of characters, we have no chance of guessing it.* I am OK with that: CSRF tokens are pretty difficult to guess. However I greatly disagree with the following statement: *And without a valid CSRF token, brute force attack becomes useless, as each of the responses has the same length.*

![DVWA High Security Brute Force](/high.png)

Here's a screenshot (not the best PoC -- but does the job) where you can see **the result of brute forcing DVWA with High security**. You can see the level of security (bottom left corner) and the response size (Burp Suite window). Try it yourself and you'll see how response size changes as expected.

### Impossible

**Same as for High security level.** Here's another screenshot that proves my point but this time the response size of the correct credentials is smaller than the response with invalid credentials. I might be running a newer version of DVWA or Burp Suite where this inconvenient has been solved.

![DVWA Impossible Security Brute Force](/impossible.png)

That's all covering **DVWA Brute Force.** Hope you had fun although is pretty simple and straight forward to compromise even the **Impossible security level.**