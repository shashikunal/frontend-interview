// Test coding review with Ollama
async function testCodeReview() {
  const problemStatement = 'Write a function `twoSum(nums, target)` that returns indices of the two numbers such that they add up to target.';
  const candidateCode = `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`;

  console.log('Testing AI Code Review with Ollama via proxy...');
  const prompt = `You are a Senior Staff Software Engineer evaluating a candidate's code submission in a live technical interview.

Problem: ${problemStatement}
Candidate Solution:
\`\`\`javascript
${candidateCode}
\`\`\`
Test Results: All tests passed (3/3 passed).

Evaluate:
1. Time complexity (e.g. O(n))
2. Space complexity (e.g. O(n))
3. Code cleanliness, readability & production standards
4. Edge cases handled or missed
5. Overall score out of 10

Respond strictly in valid JSON with keys:
{
  "numericScore": number (0-10),
  "letterGrade": string ("A+" | "A" | "B" | "C" | "F"),
  "timeComplexity": string,
  "spaceComplexity": string,
  "cleanlinessReview": string,
  "edgeCasesReview": string,
  "summary": string
}`;

  const res = await fetch('http://localhost:5173/api/ollama/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.2:latest',
      prompt,
      stream: false,
      format: 'json'
    })
  });

  const data = await res.json();
  console.log('AI Code Review Output:');
  console.log(data.response);
}

testCodeReview().catch(console.error);
