---
layout: page
icon: fas fa-terminal
order: 1
---

Here's a list of all the VMs I have compromised so far! The difficulty is the one said by the owner of the machine and not me. There's also a list of the PicoCTF and OverTheWire challenges I've solved and the walkthroughs of other vulnerable web applications like DVWA, bWAPP and others...

## VMs

|    | **Walkthrough**                                              | **OS**          | **Difficulty** | **Report**                        | **Download**                                                           |
|:---|:-------------------------------------------------------------|:----------------|:---------------|:---------------------------------:|:-----------------------------------------------------------------------|
| 1. | **[Kioptrix #1](/posts/kioptrix-1-walkthrough/)**            | Linux           | Easy           |  | **[Vulnhub](https://www.vulnhub.com/entry/kioptrix-level-1-1,22/)**    |
| 2. | **[Kioptrix #2](/posts/kioptrix-2-walkthrough/)**            | Linux           | Easy           |  | **[Vulnhub](https://www.vulnhub.com/entry/kioptrix-level-11-2,23/)**   |
| 1. | **[Kioptrix #3](/posts/kioptrix-3-walkthrough/)**            | Linux           | Easy           |  | **[Vulnhub](https://www.vulnhub.com/entry/kioptrix-level-12-3,24/)**    |
| 2. | **[Kioptrix #4](/posts/kioptrix-4-walkthrough/)**            | Linux           | Easy           |  | **[Vulnhub](https://www.vulnhub.com/entry/kioptrix-level-13-4,25/)**   |
| 3. | **[Tr0ll: 1](/posts/tr0ll-walkthrough/)**                    | Linux           | Easy           |  | **[Vulnhub](https://www.vulnhub.com/entry/tr0ll-1,100/)**              |
| 4. | **[Lord Of The Root](https://github.com/amtzespinosa/lord-of-the-root-walkthrough)** | Linux           | Easy           |  | **[Vulnhub](https://www.vulnhub.com/entry/lord-of-the-root-101,129/)** |
| 5. | **[Stapler: 1](/posts/stapler-walkthrough/)**                | Linux           | Easy-Medium    |  | **[Vulnhub](https://www.vulnhub.com/entry/stapler-1,150/)**            |

## Web Apps

### DVWA

| **Vulnerability** | **Tools**    | **Security Up To** | **Walkthrough**                                                       |
|:------------------|:-------------|:-------------------|:----------------------------------------------------------------------|
| **Brute Force**   | Burp Suite   | Impossible         | **[DVWA Brute Force](/posts/dvwa-2023-walkthrough/#brute-force)**     |
| **DOM XSS**       | JavaScript   | High               | **[DVWA DOM XSS](/posts/dvwa-2023-walkthrough/#xss-dom)**             |
| **Reflected XSS** | JavaScript   | High               | **[DVWA Reflected XSS](/posts/dvwa-2023-walkthrough/#xss-reflected)** |
| **Stored XSS**    | JavaScript   | High               | **[DVWA Stored XSS](/posts/dvwa-2023-walkthrough/#xss-stored)**       |

### bWAPP

| **Vulnerability**         | **Security Up To** | **Walkthrough**                                                                                   |
|:--------------------------|:-------------------|:--------------------------------------------------------------------------------------------------|
| **OS Command Injection**  | Medium             | **[bWAPP OS Command Injection](/posts/bwapp-2023-walkthrough/#os-command-injection)**             |
| **Directory Traversal**   | High               | **[bWAPP Directory Traversal](/posts/bwapp-2023-walkthrough/#directory-traversal---directories)** |
| **Local File Inclusion**  | Low                | **[bWAPP LFI](/posts/bwapp-2023-walkthrough/#local-file-inclusion)**                              |
| **Remote File Inclusion** | Low                | **[bWAPP RFI](/posts/bwapp-2023-walkthrough/#remote-file-inclusion)**                             |
| **File Upload**           | High               | **[bWAPP File Upload](/posts/bwapp-2023-walkthrough/#file-upload)**                               |

## Challenges

### PicoCTF

| **Walkthrough**                                                             | **# of Challenges** |
|:----------------------------------------------------------------------------|:--------------------|
| **[General Skills in CTF's](/posts/picoctf-general-skills-walkthrough/)**   | 19                  |
| **[Low Level Binary Intro](/posts/picoctf-general-skills-walkthrough/)**    | 46                  |
| **[Forensics in CTFs](/posts/picoctf-forensics-in-ctf-walkthrough/)**       | 17                  |

<br>
<div style="display: inline-flex; box-shadow: 2px 2px 8px 4px #91919188; border-radius: 15px; padding: 10px; background-color: #d8d8d8; width: 100%;">

    <img src="../assets/img/pages/monero.png" alt="Monero" class="monero" style="height:120px; width:120px; vertical-align: middle; margin: 20px; margin-left: 10px;">

    <div style="width:80%; margin: 10px;">
        <p style="font-size: 25px; vertical-align: auto; color: #000000b9;"><b>Support my content!</b></p>
        <p>
            <b>Monero wallet:</b>
            <a href="../assets/img/pages/donate.png">8AZz1VxWDQr1oQ3bxgKZHF2GzJQjFjW1K4BY4h3JmnLyQ9wpt1MADKNVuDAnyN814sZfahkpd4zNxKe2bqLPjW9XRjmExiQ</a>
        </p>
    </div>
</div>
<style>
    .monero {
        display: none;
    }
</style>