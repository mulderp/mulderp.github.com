---
layout: post
title: From JavaScript to C
tags: c
---
JavaScript?! Most embedded developers will tell you to learn C and assembler rather sooner than later. Indeed, [Understanding assembler](http://embedded.fm/blog/2016/2/25/do-i-need-to-know-assembly-language-to-write-c-well)  and [bit-and-byte level programming](http://embedded.fm/episodes/159) are important when you program low-power devices.

For the background: In [embeddednodejs.com](http://embeddednodejs.com), [Kelsey](https://twitter.com/SelkeyMoonbeam?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor) and me argue where and how a high-level scripting langugage (esp. JavaScript) has benefits for developing applications for IoT and physical computing.


But for sure JavaScript does not solve all problems you might face. When you know JavaScript (or other scripting languages), why and how can you start to (re-)learn C?  Besides that learning  C is a fun inveestment, here are some ideas to help you get started.

# 1) Start with Makefiles 

Makefiles are essential in any C project. Makefiles wrap calls to a C toolchain such as compiler, linkers and standard libraries. Makefiles help you in learning C code as well. Makefiles can quickly grow complex (if you look at any open source project), but it is important to start simple. For example as simple as:


	cc=gcc
	src=main.c

	all:
		$(cc) $(src) -o hello

Without a source file, tunning "make" results into an error that no source is found. This is a good moment to reflect what you need to learn about C source files and projects

# 2) Re-write code you know in C

A good advice is to start translating code you know in C. For example, translate this JavaScript call:

      console.log("hello, world");

A good C book, such as the [K&R bible](https://www.goodreads.com/book/show/515601.The_C_Programming_Language), will quickly tell you how to write this in C:

    #include <stdio.h>

    int main(int argc, char ** argv) {
      printf("hello, world\n");
      return 0;
    }

Running Make gives some ouput. On my Mac, the size of the resulting file is around 8 kB. Compiling the same file for an ARM machine, results into 1 KB of binary file. Ok, running the example is nice, but for learning purposes, it is good to reflect what is inside the binary file. 

# 3) Disassemble the binary file

Working with C and low-level stuff requires you to understand registers, instructions sets, memory and how machines think. This takes a while, but a good start are disassemblers. Especially, you can compare how compilers translate this simple function above into instructions of a target machine. On my Mac, the [command to dissassemble the binary file](http://stackoverflow.com/questions/1289881/using-gcc-to-produce-readable-assembly) is:

     gcc -O2 -S main.c

This gives:

      	.section	__TEXT,__text,regular,pure_instructions
      	.globl	_main
      	.align	4, 0x90
      _main:                                  ## @main
      	.cfi_startproc
      ## BB#0:
      	pushq	%rbp
      Ltmp2:
      	.cfi_def_cfa_offset 16
      Ltmp3:
      	.cfi_offset %rbp, -16
      	movq	%rsp, %rbp
      Ltmp4:
      	.cfi_def_cfa_register %rbp
      	leaq	L_str(%rip), %rdi
      	callq	_puts
      	xorl	%eax, %eax
      	popq	%rbp
      	retq
      	.cfi_endproc
      
      	.section	__TEXT,__cstring,cstring_literals
      L_str:                                  ## @str
      	.asciz	"hello, world"
      
What these instruction mean is another topic for a blog post all together, but for now, observe the different "sections" in the binary file. These sections are loaded into memory when you run the program. Also, one section keeps the string literal "hello, world".


# 3) Study code from others

As with JavaScript, there are plenty of C libraries out there that you can study and learn from. Especially, [network programming is done with C](https://www.goodreads.com/book/show/258607.UNIX_Network_Programming) and you could learn by writing a small websockets client or server in C. This will teach you about assembling bytes to communication protocols and working with structs and such. Also, getting a feeling for the C standard libraries is important. OFten, these relate to the target machine that you use (for example study the difference of standard libs for Arduino or your Unix distribution of choice). Another way to learn is about C is builing parsers with Yacc and Lex. This will hopefully be another blog post as well.

