---
title: picoCTF - Low Level Binary Intro Walkthrough
author: alex
date: Thu  6 Jul 10:59:03 CEST 2023
categories: [PicoCTF,Walkthroughs]
tags: [picoctf, ctf, walkthroughs]
img_path: /assets/img/posts/2023-07-06-picoctf-low-level-binary-walkthrough/
image:
  path: picoctf.png
  alt: picoCTF Logo.
---

In this playlist, we are presented with Mochi’s Tale. We will be introduced to assembly, debuggers and some Python code that can be exploited in similar ways as assembly code. And there are two reasons why I'm completing this picoCTF playlist before others that are more focused on pentesting stuff:

1. I want to learn about reverse engineering and this looks like a nice intro material
2. I have a project in mind that requires reverse engineering

## Mochi's Tale

At first we are presented we this game. That's pretty much so far regarding this game.

![Mochi's Tale Game](/mochi.png)

## Warm Up

Very basic and easy challenges. From binary, hex and decimal translation to other basic commands. You'll use:

<kbd>CyberChef</kbd><kbd>cat</kbd><kbd>Python</kbd><kbd>Netcat</kbd>

### Obedient Cat

**Description:** This file has a flag in plain sight (aka "in-the-clear"). [Download flag](https://mercury.picoctf.net/static/0e428b2db9788d31189329bed089ce98/flag).

Just download the document and open it or read it with `cat` command and you'll get the flag.

**Flag:** picoCTF{s4n1ty_v3r1f13d_2fd6ed29}

### Warmed Up

**Description:** What is 0x3D (base 16) in decimal (base 10)?

Translate 0x3D into decimal and you'll get **61**.

**Flag:** picoCTF{61}

### ASCII Numbers

**Description:** Description Convert the following string of ASCII numbers into a readable string: 

```
0x70 0x69 0x63 0x6f 0x43 0x54 0x46 0x7b 0x34 0x35 0x63 0x31 0x31 0x5f 0x6e 
0x30 0x5f 0x71 0x75 0x33 0x35 0x37 0x31 0x30 0x6e 0x35 0x5f 0x31 0x6c 0x6c 
0x5f 0x74 0x33 0x31 0x31 0x5f 0x79 0x33 0x5f 0x6e 0x30 0x5f 0x6c 0x31 0x33 
0x35 0x5f 0x34 0x34 0x35 0x64 0x34 0x31 0x38 0x30 0x7d
```

To solve this challenge you can just go to **[CyberChef](https://gchq.github.io/CyberChef/)** and translate it with *From Hex* recipe.

**Flag:** picoCTF{45c11_n0_qu35710n5_1ll_t311_y3_n0_l135_445d4180}

### Picker I

**Description:** This service can provide you with a random number, but can it do anything else? Connect to the program with netcat: `$ nc saturn.picoctf.net 57630`. The program's source code can be downloaded [here](https://artifacts.picoctf.net/c/514/picker-I.py).

To solve this challenge you can use `cat` command to check the source code and see what else you can do. There's a function, *win()*, that prints the flag iin Hex. Once we have the Hex we can repeat the step in the previous challenge.

**Flag:** picoCTF{4_d14m0nd_1n_7h3_r0ugh_6e04440d}

## Intro to Assembly

The next set of challenges are not difficult but I found them a bit messy at the beginning as it is my first time with assembly. You'll use:

<kbd>Google</kbd><kbd>CyberChef</kbd><kbd>cat</kbd><kbd>Python</kbd><kbd>Calculator</kbd>

### Bit-O-Asm-1

**Description:** Can you figure out what is in the `eax` register? Put your answer in the picoCTF flag format: `picoCTF{n}` where n is the contents of the `eax` register in the decimal number base. If the answer was `0x11` your flag would be `picoCTF{17}`. Download the assembly dump [here](https://artifacts.picoctf.net/c/509/disassembler-dump0_a.txt).

`cat` the dump to see the code. As we can see, `eax` is replaced with `0x30`. Now we only need to translate that to decimal with CyberChef using *From Hex* + *To Decimal* as the recipe and will get the flag.

**Flag:** picoCTF{48}

### Bit-O-Asm-2

**Description:** Can you figure out what is in the `eax` register? Put your answer in the picoCTF flag format: `picoCTF{n}` where n is the contents of the `eax` register in the decimal number base. If the answer was `0x11` your flag would be `picoCTF{17}`. Download the assembly dump [here](https://artifacts.picoctf.net/c/510/disassembler-dump0_b.txt).

To solve this challenge just have a look to the dump and follow the trail: `eax` has been replaced by `DWORD PTR [rbp-0x4]` (a pointer) and this pointer was previously replaced with `0x9fe1a`. Google the translation from `0x9fe1a` to decimal and you'll get `654874` -- the flag.

**Flag:** picoCTF{654874}

### Bit-O-Asm-3

**Description:** Can you figure out what is in the `eax` register? Put your answer in the picoCTF flag format: `picoCTF{n}` where n is the contents of the `eax` register in the decimal number base. If the answer was `0x11` your flag would be `picoCTF{17}`. Download the assembly dump [here](https://artifacts.picoctf.net/c/510/disassembler-dump0_c.txt).

This is the interesting part of the dump:

```
<+15>:    mov    DWORD PTR [rbp-0xc],0x9fe1a
<+22>:    mov    DWORD PTR [rbp-0x8],0x4
<+29>:    mov    eax,DWORD PTR [rbp-0xc]
<+32>:    imul   eax,DWORD PTR [rbp-0x8]
<+36>:    add    eax,0x1f5
```

To solve this challenge we to do a bit of maths. Once we have followed the trail and translated everything, we can calculate the final number. These are the steps:

1. `eax` value is the pointer `DWORD PTR [rbp-0xc]` which value is `0x9fe1a` and this equals to `654874` in decimal.
2. Now we have to multiply `eax` by the pointer `DWORD PTR [rbp-0x8]` which value is `0x4` and this equals to `4` in decimal.
3. So we have `654874` multiplied by `4` that equals to `2619496` and this value gets stored in `eax`.
4. And the last operation is to add `0x1f5` that equals to `501` to the value stored in `eax`. The result is `2619997` which is our flag.

**Flag:** picoCTF{2619997} 

### Bit-O-Asm-4

**Description:** Can you figure out what is in the `eax` register? Put your answer in the picoCTF flag format: `picoCTF{n}` where n is the contents of the `eax` register in the decimal number base. If the answer was `0x11` your flag would be `picoCTF{17}`. Download the assembly dump [here](https://artifacts.picoctf.net/c/510/disassembler-dump0_d.txt).

This is the interesting part of the dump:

```
<+15>:    mov    DWORD PTR [rbp-0x4],0x9fe1a
<+22>:    cmp    DWORD PTR [rbp-0x4],0x2710
<+29>:    jle    0x55555555514e <main+37>
<+31>:    sub    DWORD PTR [rbp-0x4],0x65
<+35>:    jmp    0x555555555152 <main+41>
<+37>:    add    DWORD PTR [rbp-0x4],0x65
<+41>:    mov    eax,DWORD PTR [rbp-0x4]
```

To solve this challenge we to do a bit of maths. Once we have followed the trail and translated everything, we can calculate the final number. These are the steps:

1. First, we have the pointer `DWORD PTR [rbp-0x4]` pointing to the value `0x9fe1a` that equals to `654874` in decimal.
2. Now we are comparing the value of the pointer `DWORD PTR [rbp-0x4]` against the second value, `0x2710` that equals to `10000`: `654874` > `10000`.
3. We skip the `jle` as it is a jump conditional *if less or equal to* and `DWORD PTR [rbp-0x4]` is bigger than `0x2710`.
4. The next line is a `sub` operation. We have to substract `0x65` that equals to `101` in decimal to `DWORD PTR [rbp-0x4]`. The result is `654773` and gets stored in `DWORD PTR [rbp-0x4]`.
5. Now we have an inconditional `jmp` that takes us to the line with the offset `<+41>`. In this line we assign the value of `DWORD PTR [rbp-0x4]` to `eax`.

**Flag:** picoCTF{654773}

## Intro to Debuggers

Now we are taking our first steps with debuggers. It is recommended to use **GDB** -- I believe it comes pre-installed in Kali Linux. You'll use:

<kbd>gdb</kbd><kbd>Google</kbd>

### GDB baby step 1

**Description:** Can you figure out what is in the `eax` register at the end of the main function? Put your answer in the picoCTF flag format: `picoCTF{n}` where n is the contents of the `eax` register in the decimal number base. If the answer was `0x11` your flag would be `picoCTF{17}`. Disassemble [this](https://artifacts.picoctf.net/c/512/debugger0_a).

We need to disassemble the file provided. To start `dbg` we only need to use the command `gdb debugger0_a`. Once we are dubugging the file, we can disassemble it with the command: `disassemble main` to disassemble the `main` function. This is the output:

```
0x0000000000001129 <+0>:     endbr64
0x000000000000112d <+4>:     push   %rbp
0x000000000000112e <+5>:     mov    %rsp,%rbp
0x0000000000001131 <+8>:     mov    %edi,-0x4(%rbp)
0x0000000000001134 <+11>:    mov    %rsi,-0x10(%rbp)
0x0000000000001138 <+15>:    mov    $0x86342,%eax
0x000000000000113d <+20>:    pop    %rbp
0x000000000000113e <+21>:    ret
```

As we need the value of `eax`, we only need to translate `0x86342` to decimal and we'll get the flag.

**Flag:** picoCTF{549698}

### GDB baby step 2

**Description:** Can you figure out what is in the `eax` register at the end of the main function? Put your answer in the picoCTF flag format: `picoCTF{n}` where n is the contents of the `eax` register in the decimal number base. If the answer was `0x11` your flag would be `picoCTF{17}`. Disassemble [this](https://artifacts.picoctf.net/c/512/debugger0_b).

This challenge is pretty easy. First, as we will be running the file, you must grant execution permission to the file with `chmod`: `chmod 777 debugger0_b`. Then you can load the file in **GDB** and disassemble it as before. Now we can start with our dynamic analysis:

1. `break *main+59`: This sets a breakpoint right after the loop.
2. `run`: This runs the program until the breakpoint.
3. `info registers eax`: This prints out the value of the `eax` register after running the program until the breakpoint so we will get the value of `eax` after finishing the loop in hex and decimal.


**Flag:** picoCTF{307019}

### GDB baby step 3

**Description:** Now for something a little different. `0x2262c96b` is loaded into memory in the `main` function. Examine byte-wise the memory that the constant is loaded in by using the GDB command `x/4xb addr`. The flag is the four bytes as they are stored in memory. If you find the bytes `0x11 0x22 0x33 0x44` in the memory location, your flag would be: `picoCTF{0x11223344}`. Disassemble [this](https://artifacts.picoctf.net/c/512/debugger0_c).

This challenge is not difficult but a bit tricky as we need to deal with **little endianness**. The steps begin after giving permissions, loading and dumping the file `main`
:

1. First we need to add a break as before right after the value loaded into the main function with `*main+22`.
2. After this we need to run the program with `run`.
3. Once we are at the breakpoint we should examine the memory where the constant is loaded in using the command `x/4xb $rbp-0x4`.

We will get the following output:

```
0x7fffffffddbc: 0x6b    0xc9    0x62    0x22
```

So our flag would be `0x6bc96222`. As you can see, it's the reverse (byte-wise speaking) of the given number at the beginning: `0x2262c96b`. That's **little endianness**.

**Flag:** picoCTF{0x6bc96222}

### GDB baby step 4

**Description:** `main` calls a function that multiplies `eax` by a constant. The flag for this challenge is that constant in decimal base. If the constant you find is 0x1000, the flag will be `picoCTF{4096}`. Disassemble [this](https://artifacts.picoctf.net/c/512/debugger0_d).

The steps begin after giving permissions, loading and dumping the file `main`:

1. First we need to add to breakpoints: one before the function call `break *main+36` and another one after the function call `break *main+43`.
2. Now we need to `run` the program until the first breakpoint and get the value of `eax`: `info registers eax` and we will get `654`.
3. Now we should `continue` the program until the next breakpoint and get the value of `eax` again but this time would be after the function: `info registers eax` and we will get `8439870`.
4. Now, simply dividing `8439870` by `654` will get us the value of the constant: `12905`.

**Flag:** picoCTF{12905}

### ASCII FTW

**Description:** This program has constructed the flag using hex ascii values. Identify the flag text by disassembling the program. You can download the file from [here](https://artifacts.picoctf.net/c/507/asciiftw).

For this challenge we need to use many of the things we have learnt so far. As before, the steps begin after giving permissions, loading and dumping the file `main`:

1. If we examine the file, we can see some blocks with hex data -- that's our flag.
2. First we have to add a breakpoint at the end of this hex values: `break *main+151`.
3. Now we have to run the program: `run`.
4. Once we are at the breakpoint we can examine the memory in `strings` format: `x/1sb $rbp-0x30`. 

With this command we are examining the data once from the memory address `-0x30(%rbp)`.

**Flag:** picoCTF{ASCII_IS_EASY_7BCD971D}

## Interlude

Now we are going back to Python. You'll use now: 

<kbd>cat</kbd><kbd>Python</kbd><kbd>Netcat</kbd>

### Picker II

**Description:** Can you figure out how this program works to get the flag? Connect to the program with netcat: `$ nc saturn.picoctf.net 62807` The program's source code can be downloaded [here](https://artifacts.picoctf.net/c/522/picker-II.py).

This Python script is pretty similar to the first Python script we saw. The only difference is that we cannot use `win` to print the flag as there is a filter that doesn't allow us to use it. BUT we can do the things that are inside the *win()* function: `print(open('flag.txt', 'r').read())`

**Flag:** picoCTF{f1l73r5_f41l_c0d3_r3f4c70r_m1gh7_5ucc33d_0b5f1131}

### Picker III

**Description:** Can you figure out how this program works to get the flag? Connect to the program with netcat: `$ nc saturn.picoctf.net 57549` The program's source code can be downloaded [here](https://artifacts.picoctf.net/c/522/picker-III.py).

Now we have the same python script but modified. The program limits the functions we can call to a table of names. However, this table is a variable and in the table is included a function called “write_variable”. So, abusing this gap will help us include the *win()* function into this table. We must have two precautions: 

1. Maintain the string length
2. Write the new variable value with quotes

Right at the beginning of the script we can find all we need: 

```
func_table = ''

def reset_table():
  global func_table

  # This table is formatted for easier viewing, but it is really one line
  func_table = \
'''\
print_table                     \
read_variable                   \
write_variable                  \
getRandomNumber                 \
'''

def check_table():
  global func_table

  if( len(func_table) != FUNC_TABLE_ENTRY_SIZE * FUNC_TABLE_SIZE):
    return False

  return True
```

- **func_table** - This is the variable we need to rewrite
- **reset_table** - The function that fixes the string length
- **check_table** - The function that makes sure the length of the string is right

Now we need to tear apart the variable inside the function and modify it:

1. First replace *getRandomNumber* with *win*
2. Make sure the length is the same by adding spaces:

```
'''\
print_table                     \
read_variable                   \
write_variable                  \
win                             \
'''
```

3. Now put everything in one line and delete the newliners and extra quotes:

```
'print_table                     read_variable                   write_variable                  win                             '
```

4. Now, rewrite the variable *func_table* with that value.
5. Print the table again and you'll see the *win* function instead of *getRandomNumber* 

**Flag:** picoCTF{7h15_15_wh47_w3_g37_w17h_u53r5_1n_ch4rg3_a186f9ac}

## Binary Exploitation



### Picker IV

**Description:** Can you figure out how this program works to get the flag? Connect to the program with netcat: $ nc saturn.picoctf.net 61265 The program's source code can be downloaded here. The binary can be downloaded [here](https://artifacts.picoctf.net/c/522/picker-IV.py).

Back to binaries! This time we don't only have a binary but the source code in **C** as well. If we execute the program it prompts us: `Enter the address in hex to jump to, excluding '0x':`. If we examine the source code we can see a `win` function. Our aim is to know the address in hex of the beginning of the `win` function. Let's open the file in **GDB** and disassemble the `win` function. Once we have the dump we only need to copy the address in hex to the imput prompt without `0x`: `000000000040129e`.

**Flag:** picoCTF{n3v3r_jump_t0_u53r_5uppl13d_4ddr35535_14bc5444}

### buffer overflow 0

**Description:** Let's start off simple, can you overflow the correct buffer? The program is available [here](https://artifacts.picoctf.net/c/174/vuln). You can view source [here](https://artifacts.picoctf.net/c/174/vuln.c). And connect with it using: `nc saturn.picoctf.net 61481`

This is an easy challenge. I managed to print the flag straight away by entering a bunch of `a`s to the imput prompt. This will do the thing for sure but you should also try (as I did) to do it through **GDB** to have a better understanding on how **buffer overflows** work.

**Flag:** picoCTF{ov3rfl0ws_ar3nt_that_bad_ef7314c6}

### Local Target

**Description:** Can you overflow the buffer and modify the other local variable? The program is available [here](https://artifacts.picoctf.net/c/518/local-target). You can view source [here](https://artifacts.picoctf.net/c/518/local-target.c). And connect with it using: `nc saturn.picoctf.net 61977`

This challenge is a bit tricky. Now it's no just a matter of messing up the program by entering a bunch of `a`s. Now we need to actually change the value of a variable. If we examine the source code, we can see that the value of the variable is `64` and just if it's `65` would print the flag. To do so we must understand what is happening and what values the program is printing:

- If you enter `aaaaaaaaaaaaaaaaaaaaaaa` the variable `num` would still be `64`.
- If you enter `aaaaaaaaaaaaaaaaaaaaaaaa` the variable `num` would change to `0` what tells us where the limit is.
- If you enter `aaaaaaaaaaaaaaaaaaaaaaaae` the variable `num` would change to `101`.

So, now that we know the limit and that `101` is the ASCII for the letter `e`, it's easy to think that we have to enter the value `65` in ASCII - and that's letter `A`. Now if you enter `aaaaaaaaaaaaaaaaaaaaaaaaA` you'll get the flag. 

Note that if your input is let's say: `aaaaaaaaaaaaaaaaaaaaaaaaaaa` (just a bit longer) the variable `num` will be `6381921`. To solve this challenge you would have to convert that number to hex: `0x616161`. This means that we have three `61` that corresponds to the hex value of letter `a` - we have three `a`s above the limit. Use an [ASCII-Hex-Symbol](https://ascii.cl/es/) table to help you play around with this.

**Flag:** picoCTF{l0c4l5_1n_5c0p3_7bd3fee1}

### buffer overflow 1

**Description:** Control the return address. Now we're cooking! You can overflow the buffer and return to the flag function in the [program](https://artifacts.picoctf.net/c/187/vuln). You can view source [here](https://artifacts.picoctf.net/c/187/vuln.c). And connect with it using `nc saturn.picoctf.net 53282`.

Well, last challenge of the playlist! This last one is a mix o previous ones. If we execute the file provided we are prompted to enter a string. Once we enter it, the program jumps somewhere (`0x804932f`) and ends. To know where do we have to try to make the programme jump, just disassemble the `win` function of the binary file. Once we know we have to make the program jump to `0x80491f6`, let's fill the input with the `qwerty` method: `qwertyuiopasdfghjklzxcvbnm`. The output: `0x804932f` -- not enough. Second try: `qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnm`. Output: `0x63787a6c` -- bingo!

Now, with **CyberChef**, we can translate `0x63787a6c` to symbols: `cxzl`. Little endian here! Ok, now we know that the string should be `qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjk` -- time to add `0x80491f6`. As some of these are non printable characters we have to add them like this: `\xf6\x91\x04\x08`. 

But we cannot enter the string like so, we need to `echo` it: `echo qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjk\xf6\x91\x04\x08 | nc saturn.picoctf.net 53282` and we'll get the flag.

**Flag:** picoCTF{addr3ss3s_ar3_3asy_0195a40f} 