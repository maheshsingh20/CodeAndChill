// Problem execution templates for different styles

export interface ProblemTemplate {
  wrapUserCode(userCode: string, testInput: string, problemType: string): string;
  parseOutput(output: string): string;
}

// Competitive Programming Style (CodeChef/HackerRank)
export class CompetitiveProgrammingTemplate implements ProblemTemplate {
  wrapUserCode(userCode: string, testInput: string, problemType: string): string {
    // For competitive programming, user provides complete solution
    // We just append the test input as stdin
    return userCode;
  }

  parseOutput(output: string): string {
    return output.trim();
  }
}

// LeetCode Style (Function-based)
export class LeetCodeTemplate implements ProblemTemplate {
  wrapUserCode(userCode: string, testInput: string, problemType: string): string {
    // Handle specific problem types
    switch (problemType.toLowerCase()) {
      case 'two-sum':
      case 'two_sum':
        return this.wrapTwoSumProblem(userCode, testInput);
        
      case 'reverse-linked-list':
      case 'reverse_linked_list':
      case 'linked-list':
      case 'linked_list':
        return this.wrapLinkedListProblem(userCode, testInput);
        
      case 'maximum-subarray':
      case 'maximum_subarray':
      case 'max-subarray':
      case 'max_subarray':
        return this.wrapMaxSubarrayProblem(userCode, testInput);
        
      case 'array':
      case 'string':
      case 'binary-tree':
      case 'tree':
      default:
        // Generic array/problem wrapper
        return this.wrapGenericArrayProblem(userCode, testInput);
    }
  }

  private wrapGenericArrayProblem(userCode: string, testInput: string): string {
    // Generic wrapper for array-based problems
    const arrayInput = testInput.trim(); // "[1,2,3,4,5]" or "5"

    // Try to detect if it's a simple array input
    if (arrayInput.startsWith('[') && arrayInput.endsWith(']')) {
      return `${userCode}

# Test case execution
import json
nums = json.loads('${arrayInput}')

# Try to find the main function and call it
import inspect
functions = [name for name, obj in globals().items() 
            if inspect.isfunction(obj) and not name.startswith('_')]

if functions:
    main_func = globals()[functions[0]]  # Use first function found
    result = main_func(nums)
    print(result)
else:
    print("No function found to execute")`;
    } else {
      // For non-array inputs, just execute the code as-is
      return `${userCode}

# Test case execution with input: ${arrayInput}
# Add your test execution logic here
print("Generic execution - modify as needed")`;
    }
  }

  private wrapTwoSumProblem(userCode: string, testInput: string): string {
    // Parse input: "[2,7,11,15] 9" -> nums=[2,7,11,15], target=9
    const parts = testInput.trim().split(/\s+/);
    const arrayPart = parts[0]; // "[2,7,11,15]"
    const targetPart = parts[1]; // "9"

    return `${userCode}

# Test case execution
import json
nums = json.loads('${arrayPart}')
target = ${targetPart}
result = two_sum(nums, target)
print(json.dumps(result))`;
  }

  private wrapLinkedListProblem(userCode: string, testInput: string): string {
    // Parse input: "[1,2,3,4,5]" -> create linked list and reverse it
    const arrayInput = testInput.trim(); // "[1,2,3,4,5]"

    return `${userCode}

# Helper functions for linked list
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def create_linked_list(arr):
    if not arr:
        return None
    head = ListNode(arr[0])
    current = head
    for i in range(1, len(arr)):
        current.next = ListNode(arr[i])
        current = current.next
    return head

def linked_list_to_array(head):
    result = []
    current = head
    while current:
        result.append(current.val)
        current = current.next
    return result

# Test case execution
import json
input_array = json.loads('${arrayInput}')
head = create_linked_list(input_array)
reversed_head = reverse_list(head)
result = linked_list_to_array(reversed_head)
print(json.dumps(result))`;
  }

  private wrapMaxSubarrayProblem(userCode: string, testInput: string): string {
    // Parse input: "[-2,1,-3,4,-1,2,1,-5,4]" -> array for max subarray
    const arrayInput = testInput.trim(); // "[-2,1,-3,4,-1,2,1,-5,4]"

    return `${userCode}

# Test case execution
import json
nums = json.loads('${arrayInput}')
result = max_subarray(nums)
print(result)`;
  }

  parseOutput(output: string): string {
    // Parse JSON output and format for comparison
    try {
      const parsed = JSON.parse(output.trim());
      if (Array.isArray(parsed)) {
        return `[${parsed.join(',')}]`;
      }
      return output.trim();
    } catch {
      return output.trim();
    }
  }
}

// Hybrid Template (supports both styles)
export class HybridTemplate implements ProblemTemplate {
  private competitiveTemplate = new CompetitiveProgrammingTemplate();
  private leetcodeTemplate = new LeetCodeTemplate();

  wrapUserCode(userCode: string, testInput: string, problemType: string): string {
    // Detect if user code is a complete program or just a function
    if (this.isCompleteProgram(userCode)) {
      return this.competitiveTemplate.wrapUserCode(userCode, testInput, problemType);
    } else {
      return this.leetcodeTemplate.wrapUserCode(userCode, testInput, problemType);
    }
  }

  private isCompleteProgram(code: string): boolean {
    // Check if code contains input() calls or main execution
    return code.includes('input(') || 
           code.includes('sys.stdin') || 
           code.includes('if __name__') ||
           (code.includes('print(') && !code.includes('def '));
  }

  parseOutput(output: string): string {
    return this.leetcodeTemplate.parseOutput(output);
  }
}

// Template factory
export function getTemplate(style: 'competitive' | 'leetcode' | 'hybrid' = 'hybrid'): ProblemTemplate {
  switch (style) {
    case 'competitive':
      return new CompetitiveProgrammingTemplate();
    case 'leetcode':
      return new LeetCodeTemplate();
    case 'hybrid':
    default:
      return new HybridTemplate();
  }
}