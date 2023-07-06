---
title: PicoCTF - General Skills in CTF's Walkthrough
author: alex
date: Thu  6 Jul 09:59:03 CEST 2023
categories: [PicoCTF,Walkthroughs]
tags: [picoctf, ctf, walkthroughs]
img_path: /assets/img/2023-07-06-picoctf-general-skills-walkthrough/
image:
  path: picoctf.png
  alt: picoCTF Logo.
---

**picoCTF** is a free computer security education program with original content built on a capture-the-flag framework created by security and privacy experts. And **picoGym** is a noncompetitive practice space where you can explore and solve challenges from previously released picoCTF competitions. And here is where you can learn the basics and practice with fun challenges. It also hay playlists and today we are going through the **General Skills in CTF's** playlists.

## General Skills in CTF's I

Very basic and easy challenges. From binary, hex and decimal translation to basic commands an tools used in CTFs. You'll use:

<kbd>Google</kbd><kbd>cat</kbd><kbd>./filetoexecute</kbd><kbd>Python</kbd><kbd>Netcat</kbd>

## Problem Set 1

### Warm Up

**Description:** If I told you a word started with 0x70 in hexadecimal, what would it start with in ASCII? 

Just translate 0x07 (binary) into ASCII and you'll get letter **p**.

**Flag:** picoCTF{p}

### 2Warm

**Description:** Can you convert the number 42 (base 10) to binary (base 2)? 

Translate 42 into binary and you'll get **101010**.

**Flag:** picoCTF{101010}

### Warmed Up

**Description:** What is 0x3D (base 16) in decimal (base 10)?

Translate 0x3D into decimal and you'll get **61**.

**Flag:** picoCTF{61}

## Problem Set 2

### Obedient Cat

**Description:** This file has a flag in plain sight (aka "in-the-clear"). [Download flag](https://mercury.picoctf.net/static/0e428b2db9788d31189329bed089ce98/flag).

Just download the document and open it or read it with `cat` command and you'll get the flag.

**Flag:** picoCTF{s4n1ty_v3r1f13d_2fd6ed29}

### Wave a flag

**Description:** Can you invoke help flags for a tool or binary? [This program](https://mercury.picoctf.net/static/f95b1ee9f29d631d99073e34703a2826/warm) has extraordinarily helpful information...

Execute the program with `./warm`and it will promt you: *Hello user! Pass me a -h to learn what I can do!* We pass now the `-h`: `./warm -h` and we get the flag.

**Flag:** picoCTF{b1scu1ts_4nd_gr4vy_f0668f62}

### convertme.py

**Description:** Run the Python script and convert the given number from decimal to binary to get the flag. [Download Python script](https://artifacts.picoctf.net/c/23/convertme.py)

Run the Python script and you'll get prompted to enter a number: *If 36 is in decimal base, what is it in binary base?* *Answer:* Translate 36 to binary and you'll get the answer: **0b100100** Submit the answer to get the flag.

**Flag:** picoCTF{4ll_y0ur_b4535_9c3b7d4d}

### what's a net cat?

**Description:** Using netcat (nc) is going to be pretty important. Can you connect to `jupiter.challenges.picoctf.org` at port `64287` to get the flag?

We just need to use Netcat to connect to a host with the command: `nc jupiter.challenges.picoctf.org 64287`

**Flag:** picoCTF{nEtCat_Mast3ry_284be8f7}

## General Skills in CTF's II

Very basic and easy challenges. From Netcat, ASCII reading and Python to a more advance use of `grep` and `find` commands. You'll use:

<kbd>Google</kbd><kbd>Netcat</kbd><kbd>unzip</kbd><kbd>cd</kbd><kbd>Python</kbd><kbd>cat</kbd><kbd>grep</kbd><kbd>find</kbd><kbd>chmod</kbd><kbd>strings</kbd>

## Problem Set 1

### Nice netcat

**Description:** There is a nice program that you can talk to by using this command in a shell: `$ nc mercury.picoctf.net 21135`, but it doesn't speak English...

When we execute the command we get back a bunch of numbers: `112 105 99 111 67...` To be ASCII numbers they have to be all made of three numbers so we must add 0 before every number that is made os two numbers: `112 105 099 111 067...`. Now if we translate it from ASCII to text, we get the flag.

**Flag:** picoCTF{g00d_k1tty!_n1c3_k1tty!_afd5fda4}

### Tab, Tab, Attack

**Description:** Using tabcomplete in the Terminal will add years to your life, esp. when dealing with long rambling directory structures and filenames: [Addadshashanammu.zip](https://mercury.picoctf.net/static/9689f2b453ad5daeb73ca7534e4d1521/Addadshashanammu.zip)

This one is pretty easy as we only need to download the file and unzip it: `unzip Addadshashanammu.zip`. And now the point is to navigate until the end of the directory using the `TAB` key. Only type `cd` and press `TAB` and once the directory is selected, press `ENTER`. Do this until you find an executable file and type `./`, press `TAB` and once the filename is completed press `ENTER` to execute it. Once done, you'll get the flag.

**Flag:** picoCTF{l3v3l_up!_t4k3_4_r35t!_2bcfb2ab}

### Python Wrangling

**Description:** Python scripts are invoked kind of like programs in the Terminal... Can you run [this Python script](https://mercury.picoctf.net/static/325a52d249be0bd3811421eacd2c877a/ende.py) using [this password](https://mercury.picoctf.net/static/325a52d249be0bd3811421eacd2c877a/pw.txt) to get [the flag](https://mercury.picoctf.net/static/325a52d249be0bd3811421eacd2c877a/flag.txt.en)?

Ok, let's get the password first: `cat pw.txt`. Now we can run the Python script: `python3 ende.py -d flag.txt.en`. And when prompted asking the password just paste the password and hit enter to get the flag.

**Flag:** picoCTF{4p0110_1n_7h3_h0us3_ac9bd0ff}

### Magicarp Ground Mission

**Description:** Do you know how to move between directories and read files in the shell? Start the container, `ssh` to it, and then `ls` once connected to begin. Login via `ssh` as `ctf-player` with the password, `a13b7f9d`. Additional details will be available after launching your challenge instance.

Once we launch the instance we can connect via ssh: `ssh ctf-player@venus.picoctf.net -p 60901`. Now it's just a matter of using `ls` command to list files and directories, `cat` to read files and `cd` to move around. The flag is divided in three parts: **1of3.flag.txt**, **2of3.flag.txt** and **3of3.flag.txt** and we have some instructions to find them.

**1of3.flag.txt** - picoCTF{xxsh_ **instructions-to-2of3.txt** - Next, go to the root of all things, more succinctly `/`

**2of3.flag.txt** - 0ut_0f_\/\/4t3r_ **instructions-to-3of3.txt** - Lastly, ctf-player, go home... more succinctly `~`

**3of3.flag.txt** - 71be5264}

**Flag:** picoCTF{xxsh_0ut_0f_\/\/4t3r_71be5264}

## Problem Set 2

### First Grep

**Description:** Can you find the flag in [file](https://jupiter.challenges.picoctf.org/static/495d43ee4a2b9f345a4307d053b4d88d/file)? This would be really tedious to look through manually, something tells me there is a better way.

We need to find the flag in a messy file. To do so, we can combine `cat` command and `grep` command: `cat file | grep "picoCTF"`. And we'll get the flag.

**Flag:** picoCTF{grep_is_good_to_find_things_dba08a45}

### First Find

**Description:** Unzip this archive and find the file named 'uber-secret.txt' 
- [Download zip file](https://artifacts.picoctf.net/c/501/files.zip)

Once we unzip the file we get a folder. To search for *uber-secret.txt* we can use the `find` command: `find ./files -name uber-secret.txt`. Once we get the path to the file, we can use `cat` to read it: `cat ./files/adequate_books/more_books/.secret/deeper_secrets/deepest_secrets/uber-secret.txt`.

**Flag:** picoCTF{f1nd_15_f457_ab443fd1}

### Big Zip

**Description:** Unzip this archive and find the flag.
- [Download zip file](https://artifacts.picoctf.net/c/505/big-zip-files.zip)

Now we need to use `grep` once again. To find the flag we need to search for a string inside all those files: `grep -rnw "./big-zip-files" -e "picoCTF"`. With this command we'll get the flag.

**Flag:** picoCTF{gr3p_15_m4g1c_ef8790dc}

## Problem Set 3

### Static ain't always noise

**Description:** Can you look at the data in this binary: [static](https://mercury.picoctf.net/static/0f6ea599582dcce7b4f1ba94e3617baf/static)? This [BASH script](https://mercury.picoctf.net/static/0f6ea599582dcce7b4f1ba94e3617baf/ltdis.sh) might help!

Now we need to process the binary *static* with the *ltdis.sh* script. First give permissions to *ltdis.sh* to be able to execute it: `chmod 777 ltdis.sh`. Now if we process the binary we get a *.txt* file: *static.ltdis.strings.txt*. To get the flag we can use `cat` command combined with `grep`: `cat static.ltdis.strings.txt | grep "picoCTF"` and we get the flag.

**Flag:** picoCTF{d15a5m_t34s3r_6f8c8200}

### strings it

**Description:** Can you find the flag in [file](https://jupiter.challenges.picoctf.org/static/5bd86036f013ac3b9c958499adf3e2e2/strings) without running it?

Now we need to use the `strings` command to print the sequences of printable characters in the file. And, of course, combined with `grep` to easily find the flag: `strings strings | grep "picoCTF"`.

**Flag:** picoCTF{5tRIng5_1T_827aee91}

### plumbing

**Description:** Sometimes you need to handle process data outside of a file. Can you find a way to keep the output from this program and search for the flag? Connect to `jupiter.challenges.picoctf.org 7480`.

For this last challenge we need to keep the output of connecting to `jupiter.challenges.picoctf.org 7480`. To do so we can connect and send the output to a text file: `nc jupiter.challenges.picoctf.org 7480 > output.txt`. This way we can now `cat` and `grep` the flag: `cat output.txt | grep "picoCTF"`.

**Flag:** picoCTF{digital_plumb3r_06e9d954}
