If ques needs min of max or max of min, it is probably binary search.




## Sliding Window Approach
1. Do unconditional expansion
2. Look for condition to manage window
3. Store or update ans if needed

- If sliding window ques is asking to find some exact k value, then ans will be atMost(k) - atMost(k-1). We won't have conditions to expand or shrink window if we try to find exact k directly.

