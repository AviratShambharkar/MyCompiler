import { useState } from "react";
import axios from "axios";
import "./App.css";

const codeTemplates = {
  cpp: `#include <iostream> 
using namespace std;
// Define the main function
int main() { 
    // Declare variables
    int num1, num2, sum;
    // Prompt user for input
    cin >> num1 >> num2;  
    // Calculate the sum
    sum = num1 + num2;  
    // Output the result
    cout << "The sum of the two numbers is: " << sum;  
    // Return 0 to indicate successful execution
    return 0;  
}`,
  py: `# Define the main function
def main():
    # Prompt user for input
    num1 = int(input())
    num2 = int(input())
    # Calculate the sum
    sum = num1 + num2
    # Output the result
    print("The sum of the two numbers is:", sum)

if __name__ == "__main__":
    main()`,
  js: `// Define the main function
function main() {
    // Prompt user for input
    let num1 = parseInt(prompt("Enter first number:"));
    let num2 = parseInt(prompt("Enter second number:"));
    // Calculate the sum
    let sum = num1 + num2;
    // Output the result
    console.log("The sum of the two numbers is:", sum);
}

main();`,
  c: `#include <stdio.h>
// Define the main function
int main() {
    // Declare variables
    int num1, num2, sum;
    // Prompt user for input
    scanf("%d %d", &num1, &num2);
    // Calculate the sum
    sum = num1 + num2;
    // Output the result
    printf("The sum of the two numbers is: %d\\n", sum);
    // Return 0 to indicate successful execution
    return 0;
}`,
  java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        // Create a scanner object for input
        Scanner scanner = new Scanner(System.in);
        // Prompt user for input
        int num1 = scanner.nextInt();
        int num2 = scanner.nextInt();
        // Calculate the sum
        int sum = num1 + num2;
        // Output the result
        System.out.println("The sum of the two numbers is: " + sum);
    }
}`,
};

function App() {
  const [code, setCode] = useState(codeTemplates["cpp"]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("cpp");

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    setCode(codeTemplates[selectedLanguage]);
  };

  const handleSubmit = async () => {
    const payload = {
      language,
      code,
      input,
    };

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
      console.log("Sending request with payload:", payload);
      const { data } = await axios.post(backendUrl, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Response data:", data);
      setOutput(data.output || "No output returned");
    } catch (error) {
      console.error("Error object:", error);
      const errorMessage = error.response
        ? error.response.data
        : "Unknown error occurred";
      console.error("Error response message:", errorMessage);
      setOutput(errorMessage);
    }
  };

  return (
    <div className="container mx-auto py-8 flex flex-col lg:flex-row items-stretch">
      {/* Left side: Compiler editor */}
      <div className="lg:w-1/2 lg:pr-4 mb-4 lg:mb-0">
        <h1 className="text-3xl font-bold mb-3">AlgoU Online Code Compiler</h1>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Select Language:
          </label>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="border border-gray-300 rounded-sm py-1.5 px-4 mb-1 focus:outline-none focus:border-indigo-500"
          >
            <option value="cpp">C++</option>
            {/* <option value="py">Python</option> */}
            {/* <option value="js">JavaScript</option> */}
            <option value="c">C</option>
            <option value="java">Java</option>
          </select>
        </div>
        <div
          className="bg-gray-100 shadow-md w-full max-w-lg mb-4"
          style={{ height: "300px", overflowY: "auto" }}
        >
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
              outline: "none",
              border: "none",
              backgroundColor: "#f7fafc",
              height: "100%",
              overflowY: "auto",
              width: "100%",
              padding: "10px",
            }}
          />
        </div>

        {/* Run button */}
        <button
          onClick={handleSubmit}
          type="button"
          className="w-full text-center mt-4 bg-gradient-to-br from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 focus:outline-none text-white font-medium rounded-lg text-sm px-5 py-2.5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 inline-block align-middle me-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
            />
          </svg>
          Run
        </button>
      </div>

      {/* Right side: Input and Output */}
      <div className="lg:w-1/2 lg:pl-8 pt-10">
        {/* Input textarea */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Input</h2>
          <textarea
            rows="5"
            cols="15"
            value={input}
            placeholder="Input"
            onChange={(e) => setInput(e.target.value)}
            className="border border-gray-300 rounded-sm py-1.5 px-4 mb-1 focus:outline-none focus:border-indigo-500 resize-none w-full"
            style={{ minHeight: "100px" }}
          ></textarea>
        </div>

        {/* Output box */}
        {output && (
          <div className="bg-gray-100 rounded-sm shadow-md p-4 h-28">
            <h2 className="text-lg font-semibold mb-2">Output</h2>
            <div
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 12,
              }}
            >
              {output}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
