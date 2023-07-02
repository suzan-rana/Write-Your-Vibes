// Function to check if a string contains only numeric characters
export function validateNonNumericString(input: string): boolean {
  // Use a regular expression to match non-numeric characters
  const regex = /[^0-9]/;

  // Check if the input contains non-numeric characters
  const containsNonNumeric = regex.test(input);

  // Return true if the input is valid (contains non-numeric characters)
  // Return false if the input contains only numeric characters
  return !containsNonNumeric;
}
