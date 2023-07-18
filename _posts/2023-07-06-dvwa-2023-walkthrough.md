---
title: DVWA 2023 Edition
author: alex
date: Thu 6 Jul 08:15:48 CEST 2023
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

## XSS (DOM)

Our first real web vulnerability is going to be **Cross Site Scripting (XSS)**. There are are three types of XSS and we are going to exploit them all but let's start with DOM XSS.

**Document Object Model (DOM) XSS** happens because of the modification of a DOM environment by the client-side script. 

Knowing this, let's begin!

### Low

To test the page, we can select one of the *language* options. Now, as we can see, the URL changes. If we change the URL from `?default=English` to `?default=aaaaaaa`, the string will be included as one of the options -- this means it's vulnerable (we already knew but anyway I get excited!)

![DVWA Low Security XSS Test](/low-dom-xss-test.png)

And now we change the URL to `?default=<script>alert(1)</script>`. It may get partially URL-encoded and changed to `?default=<script>alert(1)<%2Fscript>`: insist! Change `%2F` to `/` and an alert will pop up.

![DVWA Low Security DOM XSS](/low-dom-xss-poc.png)

In a real scenario we would use a malicious script instead of this naive `alert()`.

### Medium

This level is a bit different as we can't evocate the script directly so we have to find a way to bypass this restriction. In this cases, we can usually execute the malicious script indirectly causing an error.

This one consists in using a legal piece of code containing an error with `alert()` as the code to execute in case of that error: `?default=English</option></select><img src="foo" onerror="alert(1)">`.

Adding that to the URL will tell the page to load an `img` from a non-existent source what will cause an error. And, as you can see, we are executing the script once that error happens.

![DVWA Medium Security DOM XSS](/medium-dom-xss-poc.png)

Another thing I found by mistake while trying to find the right script is this "out-of-nowhere" information display adding this to the URL: `?default=English</option><img src="foo" onerror="alert(1)>`.

![DVWA Medium Security XSS Info](/info-disclosed.png)

That little modification makes the page display some information that I don't know if it's intended to be displayed there. 

### High

Although exploiting this level of security should be harder, it is not. It is as simple as the low level but with a little mod: `?default=#<script>alert(1)</script>`. Note the `#` before our script.

![DVWA Medium Security DOM XSS](/high-dom-xss-poc.png)

And this is the last level of security we can exploit in DVWA.

### Impossible

I haven't found any way to exploit the impossible level yet!

## XSS (Reflected)

This injection is not persistent and one of the examples of how this can be exploited is when the user is tricked to click on a malicious link or, as in this case, by submitting a malicious script in a non-sanitized input field that reflects the input in the page.

### Low

To compromise this section, we only have to submit `<script>alert(1)</script>` in the input field.

![DVWA Low Security Reflected XSS](/low-reflected-xss-poc.png)

### Medium 

To compromise this section, we only have to submit `</option><img src="foo" onerror="alert(1)>` in the input field. Just like we did with the DOM XSS. There is another way and it's using capital letters: `<SCRIPT>alert(1)</SCRIPT>`

![DVWA Medium Security Reflected XSS](/low-reflected-xss-poc.png)

### High

To compromise the high security level, we can use `</option><img src="foo" onerror="alert(1)>`. 

![DVWA High Security Reflected XSS](/high-reflected-xss-poc.png)

### Impossible

I haven't found any way to exploit the impossible level yet!

## XSS (Stored)

Stored XSS is permanently stored on the website and malicious scripts can be executed every time user visits the page. 

Let's get to it!

### Low

To compromise this section, we only have to submit `<script>alert(1)</script>` in the message field and whatever in the name field.

![DVWA Low Security Stored XSS](/low-stored-xss-poc.png)

### Medium 

To compromise this section, we have to submit `<img src="foo" onerror="alert(1)>` in the name field but we have a length limit. We can bypass that limit with **Burp Suite**.

![DVWA Medium Security Stored XSS](/medium-stored-xss-burp.png)

As you can see, I have replaced the name input text with the payload. By clicking forward twice, the alert will appear.

![DVWA Medium Security Stored XSS](/medium-stored-xss-poc.png)

### High

To compromise the high security level, we can use the same process as before! 

### Impossible

I haven't found any way to exploit the impossible level yet!
