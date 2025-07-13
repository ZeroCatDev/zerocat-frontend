export default {
  python: {
    name: "Python",
    extension: "py",
    command: "(stty -echo; echo {code} | base64 -d > main.py; echo -e \"\\033[2J\\033[H\"; stty echo)\npython3 main.py",
    icon: "mdi-language-python",
    placeholder: "# Enter Python code here",
    sample: "print('Hello from Python!')\nfor i in range(5):\n    print(f'Count: {i}')"
  },
  javascript: {
    name: "JavaScript",
    extension: "js",
    command: "(stty -echo; echo {code} | base64 -d > main.js; echo -e \"\\033[2J\\033[H\"; stty echo)\nnode main.js",
    icon: "mdi-nodejs",
    placeholder: "// Enter JavaScript code here",
    sample: "console.log('Hello from JavaScript!');\nfor(let i = 0; i < 5; i++) {\n    console.log(`Count: ${i}`);\n}"
  },
}