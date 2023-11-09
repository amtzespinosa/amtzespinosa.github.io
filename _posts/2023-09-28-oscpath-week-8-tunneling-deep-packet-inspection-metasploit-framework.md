---
title: "OSCPath Week 8: Tunneling Through Deep Packet Inspection (DPI) and The Metasploit Framework"
author: alex
date: Thu  28 Sep 19:05:19 CEST 2023
categories: [OSCP]
tags: [oscp, learning path]
img_path: /assets/img/posts/2023-09-07-oscpath-week-5/
---

> The part regarding tunneling will be mainly theory and concepts that will be later applied during our engagements but I will try to make the Metasploit part a bit more practical and provide some exercises.

Welcome to week 8 of this OSCP Prep series. This week we will be covering **tunneling through Deep Packet Inspection (DPI) and the Metasploit Framework**. You'll get a better understanding of how tunneling works and a grasp of the potential of such a legendary tool: **Metasploit**. 

> **DISCLAIMER** 
>
> All the information I provide is for educational purposes only and I am no liable of any bad use or damage caused directly or indirectly using this information.
{: .prompt-danger }

## What will we be covering this week?

1. Tunneling Through Deep Packet Inspection (DPI)
2. The Metasploit Framework

**Practice**

- [Metasploitable 3](https://github.com/rapid7/metasploitable3)

## Tunneling Through Deep Packet Inspection

**Deep Packet Inspection** (DPI) is a network security technique that examines network traffic at a granular level, analyzing packet contents, headers, and payloads to identify and potentially block malicious traffic. While DPI serves crucial security functions, **it can also be used for censorship and surveillance**. As a result, finding ways to tunnel through DPI and bypass its restrictions has become essential in various cybersecurity contexts.

Tunneling offers a solution by encapsulating one type of network traffic within another. This technique enables the circumvention of DPI systems designed to detect and block specific types of traffic. In this post, we'll explore tunneling methods, ways to detect and bypass DPI detection, and how tunneling is a valuable tool for penetration testers.

### Tunneling Methods

#### HTTP Tunneling

HTTP tunneling involves encapsulating network traffic within HTTP requests and responses. Several tools are available for this purpose, including *Chisel*, *Ncat*, and *AutoSSH*.

Example with Chisel:

```bash
# Start a Chisel server on the target system
chisel server -p 8080 --reverse

# Create a Chisel client to connect to the server
chisel client <server>:8080 R:8080:localhost:80
```

#### DNS Tunneling

DNS tunneling is a method of encapsulating traffic within DNS packets so that it can bypass DPI. DNS is a protocol that is used to resolve domain names to IP addresses. DNS packets are typically very small, so they can be easily hidden in other traffic.

To tunnel traffic through DPI using DNS, the traffic is first encapsulated in a DNS packet. This means that the traffic is prefixed with a DNS header and footer. The DNS packet is then routed through the DPI device. Because the packet is formatted as a DNS packet, the DPI device is likely to allow it to pass through.

DNS tunneling is a stealthy method for bypassing DPI because it is difficult to detect. DNS packets are typically very small and simple, so they are difficult to distinguish from legitimate DNS traffic. Additionally, DPI devices often have difficulty inspecting DNS traffic because it is often encrypted.

DNS tunneling can also be used for malicious purposes. For example, attackers can use DNS tunneling to exfiltrate data from organizations or to launch attacks against other organizations.

Here are some tools that can be used for DNS tunneling:

- *dnscat2*

#### SSL/TLS Tunneling

SSL/TLS tunneling is a method of encrypting traffic so that it can bypass DPI. SSL/TLS is a cryptographic protocol that is used to secure web traffic. **It works by creating an encrypted tunnel between two devices, which prevents attackers from intercepting the traffic.**

To tunnel traffic through DPI using SSL/TLS, the traffic is first encapsulated in an SSL/TLS connection. This means that the traffic is encrypted using the SSL/TLS protocol. The SSL/TLS connection is then routed through the DPI device. Because the traffic is encrypted, the DPI device cannot inspect the contents of the traffic.

SSL/TLS tunneling is a common way to bypass DPI because it is widely supported and difficult to detect. Most devices and applications support SSL/TLS connections, so it is easy to encapsulate traffic in an SSL/TLS tunnel. Additionally, DPI devices often have difficulty inspecting encrypted traffic, so it is difficult for them to detect SSL/TLS tunneling.

Here is an example of how SSL/TLS tunneling could be used:

1. A user wants to access a website that is blocked by their organization's firewall.
2. The user uses a VPN to connect to a server in another country.
3. The VPN server encapsulates the user's traffic in an SSL/TLS tunnel.
4. The user's traffic is then routed through the firewall and to the website.
5. The website responds to the user's request, and the VPN server encapsulates the response in an SSL/TLS tunnel.
6. The user's traffic is then routed back to the user through the firewall.

Because the user's traffic is encrypted inside the SSL/TLS tunnel, the firewall cannot inspect the contents of the traffic. Therefore, the user is able to access the website that was previously blocked.

### Detecting and Bypassing DPI Detection

DPI systems can be configured to detect and block tunneling traffic. To evade detection, consider the following techniques:

**obfs4**

obfs4 is a tool that adds obfuscation to traffic, making it difficult for DPI systems to identify the tunneling traffic. Obfuscation techniques can vary but often involve altering packet headers or payloads.

### Pentesting with Tunneling

Tunneling is a valuable tool for penetration testers, offering numerous applications in various scenarios:

**1. Bypassing Firewalls**

Tunneling can be used to bypass firewalls and gain access to networks that are otherwise inaccessible. A penetration tester can use tunneling to circumvent a firewall and penetrate a target network for further analysis.

**2. Exfiltrating Data**

Once access to a target network is established, tunneling can be employed to exfiltrate data without detection. Penetration testers can utilize tunneling to stealthily retrieve data from the target network.

**3. Evading Detection**

Tunneling can also help penetration testers evade detection by security systems, such as Intrusion Detection Systems (IDS) or Intrusion Prevention Systems (IPS). By using tunneling, they can conduct their activities without triggering alarms.

### Additional Tips for Tunneling in Pentesting

- **Diversify Tunneling Methods**: Use a variety of different tunneling methods and tools to make it more challenging for DPI systems to detect and block your traffic.
- **Stay Updated:** Keep your tunneling tools and methods up to date. DPI systems are continually evolving, and new techniques may be required to bypass the latest detection mechanisms.
- **Recognize Limitations:** Tunneling is not a perfect solution, and there is no guarantee that it will always bypass DPI systems. Awareness of its limitations is essential.

### Conclusion

Tunneling through DPI is a powerful technique in the arsenal of penetration testers and cybersecurity professionals. It enables access to networks and data that might otherwise be restricted or monitored. By mastering tunneling methods and staying current with the latest evasion techniques, professionals can effectively navigate through DPI and strengthen their cybersecurity posture.

Disclaimer: It's important to note that the use of tunneling techniques may be subject to legal and ethical considerations, and they should only be employed in authorized and responsible security testing or research environments.

## The Metasploit Framework

The Metasploit Framework is an open-source penetration testing platform that provides a wide range of tools and resources for developing, testing, and executing exploits. It is one of the most popular penetration testing tools in the world, and it is used by security professionals of all skill levels.

The Metasploit Framework includes a variety of features that make it a valuable tool for penetration testers:

- **A large database of exploits:** The Metasploit Framework includes a database of over 20,000 exploits for a wide range of vulnerabilities. This database is updated regularly with new exploits, so penetration testers can always be sure that they are using the latest tools.
- **A powerful exploit engine:** The Metasploit Framework includes a powerful exploit engine that can be used to execute exploits on a variety of targets. The exploit engine is easy to use and can be customized to meet the needs of the penetration tester.
- **A variety of post-exploitation modules:** The Metasploit Framework includes a variety of post-exploitation modules that can be used to gain access to systems, collect information, and escalate privileges. These modules are essential for penetration testers who want to thoroughly test the security of a system.

The Metasploit Framework is a powerful tool that can be used to perform a variety of penetration testing tasks. It is a valuable tool for security professionals of all skill levels.

Here are some examples of how the Metasploit Framework can be used:

- **To identify vulnerabilities:** The Metasploit Framework can be used to identify vulnerabilities in systems by executing exploits. If an exploit is successful, it indicates that the system is vulnerable to the exploit.
- **To test the security of systems:** The Metasploit Framework can be used to test the security of systems by executing exploits and trying to gain access to the system. This can help organizations to identify and fix vulnerabilities before they are exploited by attackers.
- **To develop exploits:** The Metasploit Framework can be used to develop new exploits for vulnerabilities. This can help security researchers to stay ahead of the curve and develop tools to protect against new threats.

![Metasploit](https://docs.rapid7.com/api/docs/file/product-documentation__master/metasploit/images/Screen_Shot_2020-03-17_at_12.20.39_PM.png)

### Setting up the Metasploit Framework

To set up the Metasploit Framework, you will need to install Ruby and the Metasploit Framework itself. You can install Ruby from the Ruby website and install the Metasploit Framework from the Metasploit website. But if you are using **Kali Linux**, everything is already installed.

Once you have installed the Metasploit Framework, you need to start the Metasploit console. To do this, open a terminal window and type the following command:

```bash
msfconsole
```
### Working with the Metasploit console

The Metasploit console is the main interface for the Metasploit Framework. It provides a number of commands that you can use to interact with the framework.

To list the available commands, type the following command:

```bash
help
```
To get help with a specific command, type the following command:

```bash
help <command>
```

### Auxiliary modules

Auxiliary modules are Metasploit modules that do not execute a payload. Instead, they perform other tasks, such as gathering information or exploiting vulnerabilities to gain access to a system.

To run an auxiliary module, type the following command:

```bash
use <module>
```

Once you have selected a module, you can configure the module by setting options. To see a list of the available options, type the following command:

```bash
show options
```

To set an option, type the following command:

```bash
set <option> <value>
```

To run the module, type the following command:

```bash
run
```

### Exploit modules

Exploit modules are Metasploit modules that execute a payload. This payload can be used to gain access to a system, collect information, or escalate privileges.

To run an exploit module, type the following command:

```bash
use <module>
```

Once you have selected a module, you can configure the module by setting options. To see a list of the available options, type the following command:

```bash
show options
```

To set an option, type the following command:

```bash
set <option> <value>
```

To run the module, type the following command:

```bash
exploit
```

### Staged vs non-staged payloads

Staged payloads are payloads that are executed in two stages. The first stage is a small piece of code that is injected into the target system. The second stage is the full payload, which is downloaded from the attacker's system.

Non-staged payloads are payloads that are executed in a single stage. The full payload is injected into the target system and executed immediately.

**Meterpreter payload:**

Meterpreter is a powerful post-exploitation payload that provides a wide range of features for interacting with the target system. Meterpreter can be used to collect information, escalate privileges, and execute commands.

**Executable payloads:**

Executable payloads are payloads that are executed as native code on the target system. This makes them more difficult to detect and remove than other types of payloads.

### Core Meterpreter post-exploitation features

**Meterpreter** includes a number of core features that can be used to interact with the target system. These features include:

- **File system access:** Meterpreter can be used to access the target system's file system. This allows you to read, write, and delete files.
- **Process management:** Meterpreter can be used to manage the target system's processes. This allows you to start, stop, and kill processes.
- **Registry manipulation:** Meterpreter can be used to manipulate the target system's registry. This allows you to add, modify, and delete registry keys.
- **Command execution:** Meterpreter can be used to execute arbitrary commands on the target system. This allows you to perform a wide range of tasks, such as installing software or running scripts.

### Post-exploitation modules

Post-exploitation modules are Metasploit modules that extend the functionality of **Meterpreter**. These modules can be used to perform a variety of tasks, such as exploiting new vulnerabilities, gathering more information, and escalating privileges further.

To run a post-exploitation module, type the following command:

```bash
meterpreter > load <module>
```

**Pivoting with Metasploit:**

Pivoting is a technique that allows you to use a compromised system to gain access to other systems on the network. Metasploit includes a number of features that can be used to pivot, such as port forwarding and SOCKS tunneling.

**Resource scripts:**

Resource scripts are Metasploit scripts that can be used to automate common tasks.

And we can test all of this thanks to **Metasploitable 3**, the testing enviroment developed by **Rapid7** - the Metasploit developers. There will be a post on how to set it up and how to use it. In the meanwhile, you should get familiar with **Searchsploit** and **msfvenom** as we will use them both as well.