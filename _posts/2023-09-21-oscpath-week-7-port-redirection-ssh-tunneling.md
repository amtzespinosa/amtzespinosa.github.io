---
title: "OSCPath Week 7: Port Redirection and SSH Tunneling"
author: alex
date: Thu  21 Sep 19:05:19 CEST 2023
categories: [OSCP]
tags: [oscp, learning path]
img_path: /assets/img/posts/2023-09-07-oscpath-week-5/
---

Welcome to week 7 of this OSCP Prep series. This week we will be covering **port redirection and SSH tunneling** - two essential techniques in the realm of network security and penetration testing. This post delves deeply into the intricacies of port forwarding using tools like **Socat** and **SSH**, covering various types of port forwarding, and exploring tools such as **ssh.exe**, **Plink**, and **Netsh** to provide a comprehensive understanding of these techniques.

> **DISCLAIMER** 
>
> All the information I provide is for educational purposes only and I am no liable of any bad use or damage caused directly or indirectly using this information.
{: .prompt-danger }

## What will we be covering this week?

1. Port Redirection and SSH Tunneling
    - Port Forwarding with Socat
    - SSH Local Port Forwarding
    - SSH Dynamic Port Forwarding
    - SSH Remote Port Forwarding
    - SSH Remote Dynamic Port Forwarding
    - Using sshuttle
    - ssh.exe
    - Plink
    - Netsh

Port redirection and SSH tunneling are crucial concepts in the field of cybersecurity. They allow us to **manipulate network traffic**, **redirect it through secure channels**, and **bypass firewalls**. In this extensive guide, we will explore these techniques in detail, covering various methods and tools to perform port redirection and tunneling effectively.

## Port Forwarding with Socat

### Understanding Socat

**Socat** is a versatile network utility that can create bidirectional streams between two endpoints, including network connections, files, pipes, and more. Port forwarding with Socat is a powerful technique for manipulating network traffic.

**Use Case:** Redirecting Port 80 to 8080

```bash
# Redirect traffic from port 80 to port 8080 using Socat
socat TCP-LISTEN:80,fork TCP:localhost:8080
```

For a more detailed explanation and practical examples, you can refer to **[this Socat tutorial]()**.

## SSH Tunneling

SSH tunneling is a secure way to redirect traffic through an encrypted connection. It comes in several forms, each serving a unique purpose.

### SSH Local Port Forwarding

SSH local port forwarding allows you to redirect traffic from your local machine to a remote server through an SSH connection. This is useful for accessing services on a remote network securely.

**Use Case:** Accessing a Remote Database

```bash
# Forward local port 3306 to a remote MySQL server
ssh -L 3306:localhost:3306 user@remote-server
```

For a step-by-step guide and additional examples, you can follow **[this SSH Local Port Forwarding tutorial]()**.

### SSH Dynamic Port Forwarding

Dynamic port forwarding sets up a SOCKS proxy server on your local machine, which can be used to tunnel traffic to multiple destinations through a remote SSH server.

**Use Case:** Bypassing Network Restrictions

```bash
# Create a dynamic port forwarding SOCKS proxy on local port 8080
ssh -D 8080 user@remote-server
```

You can explore dynamic port forwarding further in **[this SSH Dynamic Port Forwarding guide]()**.

### SSH Remote Port Forwarding

SSH remote port forwarding allows you to redirect traffic from a remote server to your local machine. This can be useful for exposing local services to the internet securely.

**Use Case:** Exposing a Local Web Server

```bash
# Forward remote port 80 to a local web server
ssh -R 80:localhost:8080 user@remote-server
```

To delve deeper into remote port forwarding and its applications, you can refer to **[this SSH Remote Port Forwarding tutorial]()**.

### SSH Remote Dynamic Port Forwarding

**Remote Dynamic Port Forwarding** combines elements of both dynamic and remote port forwarding. It creates a SOCKS proxy on a remote server, allowing you to tunnel traffic from there to various destinations.

**Use Case:** Securely Browsing the Internet

```bash
# Create a remote dynamic port forwarding SOCKS proxy on remote port 8080
ssh -N -R 8080:localhost:1080 user@remote-server
```

For a comprehensive guide and practical examples, you can explore **[this SSH Remote Dynamic Port Forwarding tutorial]()**.

### Using sshuttle

**sshuttle** is a more user-friendly alternative to traditional SSH tunneling. It allows you to redirect traffic through an SSH connection without configuring individual ports.

**Use Case:** Redirect All Traffic Through SSH

```bash
# Redirect all traffic through an SSH connection using sshuttle
sshuttle -r user@remote-server 0/0
```

For a detailed walkthrough and usage examples, you can explore the **[sshuttle documentation]()**.

## Tools for Port Redirection and SSH Tunneling

### ssh.exe

**ssh.exe** is the OpenSSH client for Windows. It provides the same functionality as its Unix counterpart, allowing Windows users to perform SSH tunneling.

**Use Case:** Local Port Forwarding with ssh.exe

```powershell
# Perform local port forwarding using ssh.exe
ssh -L 3306:localhost:3306 user@remote-server
```

For a comprehensive guide to using ssh.exe on Windows, you can refer to the **[Microsoft documentation]()**.

### Plink

**Plink** is a command-line tool that comes with **PuTTY**. It allows you to create SSH tunnels and automate SSH connections.

**Use Case:** SSH Tunneling with Plink

```powershell
# Create an SSH tunnel using Plink
plink -L 8080:localhost:80 user@remote-server
```

For in-depth information on using Plink and its capabilities, you can explore the **[PuTTY documentation]()**.

### Netsh

**Netsh** is a Windows command-line utility for network configuration. While not a dedicated tunneling tool, it can be used to perform basic port redirection.

**Use Case:** Port Redirection with Netsh

```powershell
# Redirect traffic from port 80 to 8080 using Netsh
netsh interface portproxy add v4tov4 listenport=80 connectaddress=127.0.0.1 connectport=8080
```

To learn more about Netsh and its network configuration capabilities, you can refer to the **[Microsoft documentation]()**.

Port redirection and SSH tunneling are indispensable techniques for network security professionals and penetration testers. They offer a secure way to manipulate network traffic, bypass firewalls, and access remote services. In this comprehensive guide, we have explored various methods and tools for achieving port redirection and tunneling, from the versatile Socat to the secure SSH tunneling options and Windows-specific tools like ssh.exe, Plink, and Netsh.

By mastering these techniques and tools, you can enhance your network security skills and effectively navigate complex network environments, ultimately strengthening your ability to secure and protect critical assets.
