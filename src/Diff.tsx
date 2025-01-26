import { DiffEditor } from "@monaco-editor/react";

const MonacoDiffEditor = () => {
  // Example original and modified code
  const originalCode = `
def greet(name):
    print(f"Hello, {name}!")

def add(a, b):
    return a + b

def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n-1)
`;

  const modifiedCode = `
def greet(name, greeting="Hello"):
    print(f"{greeting}, {name}!")  # Added a customizable greeting

def add(a, b, c=0):
    return a + b + c  # Added an optional third parameter

def factorial(n):
    if n < 0:  # Added input validation
        raise ValueError("n must be a non-negative integer")
    elif n == 0:
        return 1
    else:
        result = 1  # Refactored factorial calculation
        for i in range(1, n + 1):
            result *= i
        return result
`;

  return (
      <DiffEditor
        height="100%"
        original={originalCode}
        modified={modifiedCode}
        language="python"
        theme="vs-light" // Change to "light" for a light theme
        options={{
          renderSideBySide: true, // Set to false for inline diff view
        }}
      />
  );
};

export default MonacoDiffEditor;