---
title: picoCTF - Forensics in CTFs Walkthrough
author: alex
date: Wed 19 Jul 12:34:53 CEST 2023
categories: [PicoCTF,Walkthroughs]
tags: [picoctf, ctf, walkthroughs]
img_path: /assets/img/posts/2023-07-19-picoctf-forensics-in-ctf-walkthrough/
image:
  path: picoctf.png
  alt: picoCTF Logo.
---

In this playlist, we will be learning some **forensic skills for CTFs**. It's a good playlist if you want to train your attention to details as the majority of the flags require this skill.

## Forensics in CTFs I

Very basic and easy challenges. You'll use:

<kbd>exiftool</kbd><kbd>grep</kbd><kbd>strings</kbd><kbd>cat</kbd><kbd>base64</kbd>

### information

**Description:** Files can always be changed in a secret way. Can you find the flag? [cat.jpg](https://mercury.picoctf.net/static/e5825f58ef798fdd1af3f6013592a971/cat.jpg)

In this cases, the first thing I check is the `strings` of the picture. If I don't find anything there I try my luck with the image metadata: `exiftool cat.jpg`. And we get a weird string: `cGljb0NURnt0aGVfbTN0YWRhdGFfMXNfbW9kaWZpZWR9`.

Passing that string through `base64`: `echo "cGljb0NURnt0aGVfbTN0YWRhdGFfMXNfbW9kaWZpZWR9" | base64 -d`, we get the flag.

**Flag:** picoCTF{the_m3tadata_1s_modified}

### Glory of the Garden

**Description:** This [garden](https://jupiter.challenges.picoctf.org/static/43c4743b3946f427e883f6b286f47467/garden.jpg) contains more than it seems.

As always, `strings` first combined with `grep` to show the flag in the case it is hidden here: `strings garden.jpg | grep "picoCTF"`. And there we go, we got the flag.

**Flag:** picoCTF{more_than_m33ts_the_3y3657BaB2C}

### Enhance!

**Description:** Download this image file and find the flag. 
- [Download image file](https://artifacts.picoctf.net/c/102/drawing.flag.svg)

Starting with `strings drawing.flag.svg` we can see something in the last few lines thart look like the flag: `F { 3 n h 4 n` and `c 3 d _ d 0 a 7 5 7 b f }`. Putting this together and looking in the lines above, we get the flag.

I don't know if there is a more efficient way of solving this but I did it this way!

**Flag:** picoCTF{3nh4nc3d_d0a757bf}

## Forensics in CTFs II

The following challenges are kind of focused in reverse engineering and are a bit harder but not difficult. You'll use:

<kbd>gunzip</kbd><kbd>mmls</kbd><kbd>nc</kbd><kbd>srch_strings</kbd><kbd>binwalk</kbd><kbd>find</kbd><kbd>cat</kbd><kbd>fls</kbd><kbd>icat</kbd>

### Sleuthkit Intro

**Description:** Download the disk image and use `mmls` on it to find the size of the Linux partition. Connect to the remote checker service to check your answer and get the flag. Note: if you are using the webshell, download and extract the disk image into `/tmp` not your home directory.

- [Download disk image](https://artifacts.picoctf.net/c/164/disk.img.gz)
- Access checker program: `nc saturn.picoctf.net 52472`

First we need to decompress the file with `gunzip disk.img.gz`. Once we have the disk image we can use `mmls disk.img` to see the length in sectors: `0000202752`.

Now if we connect with `nc saturn.picoctf.net 52472` we are prompted to enter that number. Doing so, we'll get the flag.

**Flag:** picoCTF{mm15_f7w!}

### Disk, disk, sleuth!

**Description:** Use `srch_strings` from the sleuthkit and some terminal-fu to find a flag in this disk image: [dds1-alpine.flag.img.gz](https://mercury.picoctf.net/static/626ea9c275fbd02dd3451b81f9c5e249/dds1-alpine.flag.img.gz)

This one is pretty easy as we have the instructions in the description. After decompressing the file with `gunzip` we can follow the instructions: `srch_strings dds1-alpine.flag.img | grep "picoCTF"`. And we get the flag.

**Flag:** picoCTF{f0r3ns1c4t0r_n30phyt3_a6f4cab5}

### Disk, disk, sleuth! II

**Description:** All we know is the file with the flag is named `down-at-the-bottom.txt`... Disk image: [dds2-alpine.flag.img.gz](https://mercury.picoctf.net/static/aed64c508175df5fe23207c10e0e47e5/dds2-alpine.flag.img.gz)

First we have to decompress the file to work with it: `gunzip dds2-alpine.flag.img.gz`. Now we can start with the reverse engineering: `binwalk -e dds2-alpine.flag.img`. Once we have the folder we can look for the file: `find ./ -name "down-at-the-bottom.txt"`.

Once we get the file path we can use `cat` to show the flag: `cat ./_dds2-alpine.flag.img.extracted/ext-root/root/down-at-the-bottom.txt`. And we get the flag.

**Flag:** picoCTF{f0r3ns1c4t0r_n0v1c3_f5565e7b}

### Sleuthkit Apprentice

**Description:** Download this disk image and find the flag. Note: if you are using the webshell, download and extract the disk image into `/tmp` not your home directory.

- [Download compressed disk image](https://artifacts.picoctf.net/c/137/disk.flag.img.gz)

Let's start decompressing the file: `gunzip disk.flag.img.gz`. Using `binwalk` here was useless as it thew me an error so I decided to navigate the files using `fls`. First we need to know the offset: `mmls disk.flag.img`. Now we can start navigating the files: 

- `fls -o 0000360448 disk.flag.img`
- `fls -o 0000360448 disk.flag.img 1995`
- `fls -o 0000360448 disk.flag.img 3981`
- `fls -o 0000360448 disk.flag.img 2371`

One we know where the file is, we can use `icat` to see the content: `icat -o 0000360448 disk.flag.img 2371`. And there is the flag.

**Flag:** picoCTF{by73_5urf3r_adac6cb4}

## Forensics in CTFs III

Very basic and easy challenges focused in file extensions and steg. You'll use:

<kbd>file</kbd><kbd>mv</kbd><kbd>zsteg</kbd>

### extensions

**Description:** This is a really weird text file [TXT](https://jupiter.challenges.picoctf.org/static/e7e5d188621ee705ceeb0452525412ef/flag.txt)? Can you find the flag?

If we use `file` to know the type of file we are working with, it will say we are dealing with a `.png` file. So, let's change the extension: `mv flag.txt flag.png`. If we open the resulting image we will se it is the flag.

**Flag:** picoCTF{now_you_know_about_extensions}

### St3g0

**Description:** Download this image and find the flag.

- [Download image](https://artifacts.picoctf.net/c/215/pico.flag.png)

Using `zsteg` to extract the info from the `.png` file will result in getting the flag: `zsteg -a -v pico.flag.png | grep "picoCTF"`

**Flag:** picoCTF{7h3r3_15_n0_5p00n_96ae0ac1}

### What Lies Within

**Description:** There's something in the [building](https://jupiter.challenges.picoctf.org/static/011955b303f293d60c8116e6a4c5c84f/buildings.png). Can you retrieve the flag?

Same as before: `zsteg -a -v buildings.png | grep "picoCTF"`

**Flag:** picoCTF{h1d1ng_1n_th3_b1t5}

## Forensics in CTFs IV

Very basic and easy challenges focused on `wireshark`. You'll use:

<kbd>wireshark</kbd><kbd>CyberChef</kbd><kbd>ROT13</kbd><kbd>steghide</kbd><kbd>cat</kbd>

### Packets Primer

**Description:** Download the packet capture file and use packet analysis software to find the flag.

- [Download packet capture](https://artifacts.picoctf.net/c/194/network-dump.flag.pcap)

First we have to open the file with `wireshark`: `wireshark network-dump.flag.pcap`. Once we have it open, we only need to look for the flag in the captured packets.

**Flag:** picoCTF{p4ck37_5h4rk_ceccaa7f}

### Wireshark doo dooo do doo...

**Description:** Can you find the flag? [shark1.pcapng](https://mercury.picoctf.net/static/81c7862241faf4a48bd64a858392c92b/shark1.pcapng).

Repeating the previous operation: `wireshark shark1.pcapng`. Once the file is open, let's start digging. If you follow the **TCP Stream** you'll find in the 5th stream something that looks like the flag. Use the filter `tcp.stream eq 5`.

We get something we are already familiar with: `cvpbPGS{c33xno00_1_f33_h_qrnqorrs}`. Heading to **CyberChef** and applying some `ROT13` on it will get us the flag.

**Flag:** picoCTF{p33kab00_1_s33_u_deadbeef}

### Trivial Flag Transfer Protocol

**Description:** Figure out how they moved the [flag](https://mercury.picoctf.net/static/fb24ddcfaf1e297be525ba7474964fa5/tftp.pcapng).

Let's open the file: `wireshark tftp.pcapng`. Digging in the streams we can see that some files have been uploaded. We can retrieve those files with `File > Export Objects > Save All`. Having a look to the text files, we can see some text that is asking for some `ROT13`. And we will get: 

- From `instructions.txt` - TFTP DOESNT ENCRYPT OUR TRAFFIC SO WE MUST DISGUISE OUR FLAG TRANSFER. FIGURE OUT A WAY TO HIDE THE FLAG AND I WILL CHECK BACK FOR THE PLAN
- From `plan` - I USED THE PROGRAM AND HID IT WITH-DUE DILIGENCE. CHECK OUT THE PHOTOS

Opening the `program.deb` file we can see it actually is `steghide` -- a program for steganography. Due to the weird way of writing the `plan`, I guessed that `DUEDILIGENCE` was the passphrase. Trying `steghide extract -sf picture3.bmp` in all the pictures we find that the third one outputs a `flag.txt`. We only need to `cat flag.txt` to get the flag.

**Flag:** picoCTF{h1dd3n_1n_pLa1n_51GHT_18375919}