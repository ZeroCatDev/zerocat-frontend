const e={python:{name:"Python(3.11)",extension:"py",command:`asdf shell python latest:3.11
(stty -echo; echo {code} | base64 -d > main.py; echo -e "\\033[2J\\033[H"; stty echo)
python main.py`,icon:"mdi-language-python",placeholder:"# Enter Python code here",sample:`print('Hello from Python!')
for i in range(5):
    print(f'Count: {i}')`},"python-2.7":{name:"Python2.7",extension:"py",command:`asdf shell python latest:2.7
(stty -echo; echo {code} | base64 -d > main.py; echo -e "\\033[2J\\033[H"; stty echo)
python main.py`,icon:"mdi-language-python",placeholder:"# Enter Python code here",sample:`print('Hello from Python!')
for i in range(5):
    print('Count: ' + str(i))`},"python-3.11":{name:"Python3.11",extension:"py",command:`asdf shell python latest:3.11
(stty -echo; echo {code} | base64 -d > main.py; echo -e "\\033[2J\\033[H"; stty echo)
python main.py`,icon:"mdi-language-python",placeholder:"# Enter Python code here",sample:`print('Hello from Python!')
for i in range(5):
    print(f'Count: {i}')`},"python-3.12":{name:"Python3.12",extension:"py",command:`asdf shell python latest:3.12
(stty -echo; echo {code} | base64 -d > main.py; echo -e "\\033[2J\\033[H"; stty echo)
python main.py`,icon:"mdi-language-python",placeholder:"# Enter Python code here",sample:`print('Hello from Python!')
for i in range(5):
    print(f'Count: {i}')`},"python-3.13":{name:"Python3.13",extension:"py",command:`asdf shell python latest:3.13
(stty -echo; echo {code} | base64 -d > main.py; echo -e "\\033[2J\\033[H"; stty echo)
python main.py`,icon:"mdi-language-python",placeholder:"# Enter Python code here",sample:`print('Hello from Python!')
for i in range(5):
    print(f'Count: {i}')`},javascript:{name:"JavaScript(NodeJS22)",extension:"js",command:`asdf shell nodejs latest:22
(stty -echo; echo {code} | base64 -d > main.js; echo -e "\\033[2J\\033[H"; stty echo)
node main.js`,icon:"mdi-nodejs",placeholder:"// Enter JavaScript code here",sample:"console.log('Hello from JavaScript!');\nfor(let i = 0; i < 5; i++) {\n    console.log(`Count: ${i}`);\n}"},"javascript-nodejs18":{name:"JavaScript(NodeJS18)",extension:"js",command:`asdf shell nodejs latest:18
(stty -echo; echo {code} | base64 -d > main.js; echo -e "\\033[2J\\033[H"; stty echo)
node main.js`,icon:"mdi-nodejs",placeholder:"// Enter JavaScript code here",sample:"console.log('Hello from JavaScript!');\nfor(let i = 0; i < 5; i++) {\n    console.log(`Count: ${i}`);\n}"},"javascript-nodejs20":{name:"JavaScript(NodeJS20)",extension:"js",command:`asdf shell nodejs latest:20
(stty -echo; echo {code} | base64 -d > main.js; echo -e "\\033[2J\\033[H"; stty echo)
node main.js`,icon:"mdi-nodejs",placeholder:"// Enter JavaScript code here",sample:"console.log('Hello from JavaScript!');\nfor(let i = 0; i < 5; i++) {\n    console.log(`Count: ${i}`);\n}"},"javascript-nodejs22":{name:"JavaScript(NodeJS22)",extension:"js",command:`asdf shell nodejs latest:22
(stty -echo; echo {code} | base64 -d > main.js; echo -e "\\033[2J\\033[H"; stty echo)
node main.js`,icon:"mdi-nodejs",placeholder:"// Enter JavaScript code here",sample:"console.log('Hello from JavaScript!');\nfor(let i = 0; i < 5; i++) {\n    console.log(`Count: ${i}`);\n}"},"javascript-nodejs24":{name:"JavaScript(NodeJS24)",extension:"js",command:`asdf shell nodejs latest:24
(stty -echo; echo {code} | base64 -d > main.js; echo -e "\\033[2J\\033[H"; stty echo)
node main.js`,icon:"mdi-nodejs",placeholder:"// Enter JavaScript code here",sample:"console.log('Hello from JavaScript!');\nfor(let i = 0; i < 5; i++) {\n    console.log(`Count: ${i}`);\n}"},rust:{name:"Rust",extension:"rs",command:`asdf shell rust latest
(stty -echo; echo {code} | base64 -d > main.rs; echo -e "\\033[2J\\033[H"; stty echo)
rustc main.rs && ./main`,icon:"mdi-language-rust",placeholder:"// Enter Rust code here",sample:`fn main() {
    println!("Hello from Rust!");
    for i in 0..5 {
        println!("Count: {}", i);
    }
}`},golang:{name:"Golang",extension:"go",command:`asdf shell golang latest
(stty -echo; echo {code} | base64 -d > main.go; echo -e "\\033[2J\\033[H"; stty echo)
CGO_ENABLED=0 GOMAXPROCS=2 GOGC=50 go run -gcflags='-N -l' main.go`,icon:"mdi-language-go",placeholder:"// Enter Golang code here",sample:`package main

import "fmt"

func main() {
    fmt.Println("Hello from Golang!")
    for i := 0; i < 5; i++ {
        fmt.Printf("Count: %d\\n", i)
    }
}`},ruby:{name:"Ruby",extension:"rb",command:`asdf shell ruby latest
(stty -echo; echo {code} | base64 -d > main.rb; echo -e "\\033[2J\\033[H"; stty echo)
ruby main.rb`,icon:"mdi-language-ruby",placeholder:"# Enter Ruby code here",sample:"puts 'Hello, World!'"},java:{name:"Java(openjdk-24)",extension:"java",command:`asdf shell java openjdk-24
(stty -echo; echo {code} | base64 -d > main.java; echo -e "\\033[2J\\033[H"; stty echo)
javac main.java
java main`,icon:"mdi-language-java",placeholder:"// Enter Java code here",sample:`class main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`},"java-openjdk21":{name:"Java(openjdk-21)",extension:"java",command:`asdf shell java openjdk-21
(stty -echo; echo {code} | base64 -d > main.java; echo -e "\\033[2J\\033[H"; stty echo)
javac main.java
java main`,icon:"mdi-language-java",placeholder:"// Enter Java code here",sample:`class main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`},"java-openjdk17":{name:"Java(openjdk-17)",extension:"java",command:`asdf shell java openjdk-17
(stty -echo; echo {code} | base64 -d > main.java; echo -e "\\033[2J\\033[H"; stty echo)
javac main.java
java main`,icon:"mdi-language-java",placeholder:"// Enter Java code here",sample:`class main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`},"java-openjdk24":{name:"Java(openjdk-24)",extension:"java",command:`asdf shell java openjdk-24
(stty -echo; echo {code} | base64 -d > main.java; echo -e "\\033[2J\\033[H"; stty echo)
javac main.java
java main`,icon:"mdi-language-java",placeholder:"// Enter Java code here",sample:`class main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`}};export{e as p};
