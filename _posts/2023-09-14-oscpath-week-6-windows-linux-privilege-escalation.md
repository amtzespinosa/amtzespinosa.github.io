---
title: "OSCPath Week 6: Windows and Linux Privilege Escalation"
author: alex
date: Thu  14 Sep 19:05:19 CEST 2023
categories: [OSCP]
tags: [oscp, learning path]
img_path: /assets/img/posts/2023-09-07-oscpath-week-5/
---

Welcome to week 6 of this OSCP Prep series. This week we will be covering a very important topic: **Privilege Escalation**. A significant part of the exam focuses on privilege escalation, where you must elevate your access privileges on target machines. In this detailed guide, we will explore **Windows and Linux privilege escalation techniques**, providing step-by-step instructions, command-line examples, and practical insights to help you succeed in the OSCP exam.

> **DISCLAIMER** 
>
> All the information I provide is for educational purposes only and I am no liable of any bad use or damage caused directly or indirectly using this information.
{: .prompt-danger }

## What will we be covering this week?

1. Windows Privilege Escalation
2. Linux Privilege Escalation

**Practice**

For the Linux part, almost any **boot-to-root** VM would do the job. You can find as well CTFs where you have to compromise a **Windows** machine. In my case, I will wait until I finish preparing/writing the next series of articles: **Enterprise Hacking: AD and Windows Exploitation**

## Windows Privilege Escalation Basics

Before diving into specific techniques, it's essential to grasp the fundamentals of Windows privilege escalation:

#### User Privileges

- **User Rights:** In Windows, privileges are permissions assigned to users or groups, determining what actions a user can perform.

```powershell
# List user privileges
whoami /priv
```

#### Enumeration

- **Situational Awareness:** Gathering information about the target system is a critical first step in privilege escalation.

```powershell
# Gather system information
systeminfo
```

- **Hidden in Plain View:** Attackers often hide in plain sight, manipulating the registry, hiding files, and manipulating the Windows environment.

```powershell
# Modify a registry key
reg add HKLM\Software\MyApp /v EvilValue /t REG_SZ /d "MaliciousData"
```

> **INFORMATION GOLDMINE:** *PowerShell*
>
> PowerShell is a powerful tool for extracting sensitive data and escalating privileges.
{: .prompt-tip }

```powershell
# Execute a PowerShell script
powershell.exe -exec bypass -c "Get-Process"
```

- **Automated Enumeration:** Tools like **PowerView** and **BloodHound** are invaluable for identifying potential privilege escalation paths.

```powershell
# Enumerate shares
Get-NetShare

# Enumerate services
Get-Service | Where-Object {$_.StartType -eq 'Auto' -and $_.Status -eq 'Running'}
```

### Privilege Escalation Techniques

#### Service Binary Hijacking

**Service Binary Hijacking** involves replacing or modifying the executable file of a Windows service, exploiting insecure service configurations to execute code with elevated privileges.

- Step 1: **Identify Vulnerable Services**

```powershell
# List services with weak permissions
Get-Service | Where-Object {$_.StartType -eq 'Auto' -and $_.Status -eq 'Running'}
```

- Step 2: **Replace the Service Binary**

```powershell
# Overwrite a service binary
Copy-Item C:\Malicious\malware.exe C:\Windows\System32\service.exe -Force
```

#### Service DLL Hijacking

**DLL Hijacking** targets dynamic-link library files used by Windows services. Attackers replace these DLLs with malicious versions to execute code with higher privileges.

- Step 1: **Identify Vulnerable Services**

```powershell
# List services loading DLLs
Get-Service | Where-Object {$_ | ForEach-Object { sc.exe qc $_.Name | Select-String "BINARY_PATH_NAME" -Context 0,1 } }
```

- Step 2: **Replace the DLL**

```powershell
# Replace a DLL
Copy-Item C:\Malicious\evil.dll C:\Program Files\Service\evil.dll -Force
```

#### Unquoted Service Paths

**Unquoted Service Paths** are a common misconfiguration in Windows services. Attackers exploit this vulnerability to execute arbitrary code with elevated privileges.

- Step 1: **Identify Unquoted Service Paths**

```powershell
# Identify unquoted service paths
Get-WmiObject -Query "SELECT * FROM Win32_Service WHERE (PathName LIKE '% %') AND (NOT (PathName LIKE '\"%\"%'))"
```

- Step 2: **Exploit the Unquoted Service Path**

```powershell
# Place a malicious executable in the unquoted path
Copy-Item C:\Malicious\malware.exe "C:\Program Files\Unquoted Path\evil.exe"
```

#### Scheduled Tasks

Scheduled tasks are often overlooked but can provide an opportunity for privilege escalation. Pentesters analyze and manipulate scheduled tasks to gain elevated access.

- Step 1: **List Scheduled Tasks**

```powershell
# List scheduled tasks
schtasks /query /fo LIST /v
```

- Step 2: **Analyze and Modify Tasks**

```powershell
# Modify a scheduled task
schtasks /change /tn "TaskName" /ru "NT AUTHORITY\SYSTEM"
```

### Using Exploits

Exploiting known vulnerabilities is another way to escalate privileges on a Windows system. Attackers look for vulnerabilities in software, operating systems, or third-party applications that allow them to gain higher access levels.

- Step 1: **Search for Known Exploits**

```powershell
# Search for available exploits
msfconsole
search windows
```

Step 2: **Choose and Exploit**

```powershell
# Exploit a known vulnerability
use exploit/windows/smb/ms08_067_netapi
```

**Privilege escalation** is a crucial aspect of the OSCP exam, where you must navigate various Windows systems and elevate your access to gain root privileges. This guide has provided a comprehensive overview of Windows privilege escalation techniques, ranging from understanding privileges to exploiting service vulnerabilities. To succeed in the OSCP exam, practice these techniques thoroughly and expand your knowledge of privilege escalation in both Windows and Linux environments.

In the next part of this guide, we will delve into **Linux privilege escalation techniques**, equipping you with the knowledge needed to excel in the OSCP exam's Linux privilege escalation challenges.

## Linux Privilege Escalation Basics

Before diving into specific techniques, it's essential to grasp the fundamentals of Linux privilege escalation:

### Manual Enumeration

**Understanding the System:** Manual enumeration is the starting point for Linux privilege escalation. Examine system configurations, users, and groups.

```bash
# List system information
uname -a
```

**Inspecting User Trails:** Analyze user activities to identify privilege escalation opportunities, especially when users have more access than necessary.

```bash
# Check user login history
last
```

**Inspecting Service Footprints:** Services running on a Linux system can be potential targets for privilege escalation. Vulnerable services or configurations can be exploited to gain higher-level access.

```bash
# List services and their status
systemctl list-units --type=service
```

### Automated Enumeration

**Automated enumeration** tools like **LinEnum** and **Linux Exploit Suggester** simplify the identification of potential privilege escalation vectors. These tools scan the system for misconfigurations, weak file permissions, and vulnerable software.

```bash
# Run LinEnum for comprehensive enumeration
./LinEnum.sh
```

### Linux Privilege Escalation Techniques

#### Abusing Cron Jobs

Cron jobs can be manipulated or exploited for privilege escalation:

```bash
# Edit a user's crontab
crontab -e
```

#### Abusing Password Authentication

Weak or shared passwords are common vulnerabilities. Pentesters attempt to crack or guess passwords to gain access to user accounts with higher privileges.

```bash
# Brute-force SSH login
hydra -l <username> -P /path/to/wordlist.txt ssh://<target_IP>
```

#### Abusing Setuid Binaries and Capabilities

Setuid binaries and capabilities can be abused to execute commands with elevated permissions. Pentesters identify these binaries and determine if they can be exploited.

```bash
# List setuid binaries
find / -type f -perm -4000 2>/dev/null
```

#### Abusing Sudo

There are many ways to abuse sudo. One of the easiest ways to check th possibility to exploit sudo misconfigurations is to try to modify the sudoers file:

```bash
# Edit sudoers file
sudo visudo
```

#### Exploiting Kernel Vulnerabilities

Kernel vulnerabilities provide the highest level of privilege escalation on Linux. Attackers attempt to exploit these vulnerabilities to gain root access.

```bash
# Exploit a kernel vulnerability
searchsploit linux kernel
```

**Linux privilege escalation** is a critical aspect of the OSCP exam, where you must navigate Linux systems and elevate your access to root privileges. This guide has provided a comprehensive overview of Linux privilege escalation techniques, ranging from manual enumeration to exploiting kernel vulnerabilities. To succeed in the OSCP exam, practice these techniques thoroughly and expand your knowledge of privilege escalation in both Windows and Linux environments.

With the knowledge gained from this guide and dedicated practice, you are well-equipped to tackle the Linux privilege escalation challenges in the OSCP exam. In the next section of this guide, we will cover Windows privilege escalation techniques, completing your preparation for the exam.



