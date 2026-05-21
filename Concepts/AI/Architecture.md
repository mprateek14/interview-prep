# The LLM Generation Flow: A System Architecture View

Modern Large Language Models (like GPT-4o, Gemini, or Claude) are primarily **Decoder-only Transformer** architectures. They do not "understand" text natively; they compute probabilities through a strict sequence of mathematical transformations.

Below is the step-by-step lifecycle of how an LLM processes a prompt and generates a response.

---

## 1. Tokenization (Text $\rightarrow$ IDs)

Models cannot read raw strings. The input text is fragmented into sub-word units called tokens using algorithms like Byte-Pair Encoding (BPE).

* **Input:** `"Hello world"`
* **Output:** `[15496, 995]` (Integer IDs mapping to the tokenizer's vocabulary).

## 2. Embedding (IDs $\rightarrow$ Vectors)

The integer IDs are mapped to a high-dimensional continuous vector space (often ranging from 4,096 to 12,288 dimensions). Words with similar semantic meanings are positioned closer together in this space.

* **Transformation:** The integer `[15496]` becomes a dense mathematical vector like `[0.12, -0.55, 0.89, ...]`.

## 3. Positional Encoding (Injecting Sequence)

Because Transformers process all input tokens simultaneously (in parallel), they lack a native concept of word order. A mathematical vector representing the position of the token is added to the embedding vector.

* **Purpose:** This ensures the model knows that "Batman defeats Joker" means something entirely different from "Joker defeats Batman".

## 4. The Transformer Blocks (The Core Engine)

The embedded sequence passes through multiple identical Transformer layers (often 32 to 96 layers deep). Each layer consists of two primary sub-components, stabilized by **Residual Connections** and **Layer Normalization**.

### A. Multi-Head Self-Attention

The model calculates how much "focus" or "attention" each word should pay to every other word in the sequence to derive context.

* **Equation:** 
$$Attention(Q, K, V) = softmax\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$
*(Where Q=Query, K=Key, V=Value)*

### B. Feed-Forward Neural Network (FFNN)

After attention maps the context, the vector passes through a standard dense neural network. This acts as the model's localized memory bank, applying facts learned during pre-training to the current context.

## 5. Output Projection (Vectors $\rightarrow$ Logits)

Once the vector exits the final Transformer layer, it is passed through a Linear Layer that projects the high-dimensional vector back down to the size of the model's vocabulary (e.g., 100,000 possible tokens).

* **Output:** "Logits"—raw, unnormalized numerical scores for every possible next word.

## 6. Softmax & Sampling (Logits $\rightarrow$ Text)

The logits are passed through a Softmax function, converting them into a probability distribution summing to 100%. 

* `!` = 80%
* `there` = 15%
* `batman` = 5%

The model uses the **Temperature** and **Top-P** parameters to sample a single token from this distribution. (e.g., `temperature=0.0` always picks the highest probability).

## 7. The Autoregressive Loop

The model has now generated a single token. It appends this new token to the original input sequence and feeds the entire new sequence back into Step 1 to predict the next token.

* **Iteration 1:** `"Hello world"` $\rightarrow$ predicts `!`
* **Iteration 2:** `"Hello world !"` $\rightarrow$ predicts `I`
* **Termination:** This loop repeats until the model predicts a special `<EOS>` (End of Sequence) token.

---

## Interview Tips: System Design

* **The KV Cache:** When explaining the Autoregressive Loop, emphasize the **Key-Value (KV) Cache**. Recomputing attention for historical tokens on every loop is a massive waste of compute. Models cache the *Keys* and *Values* of past tokens in GPU VRAM, so they only need to compute attention for the single newest token.
* **Compute Bounds:** Note that model *training* (processing whole documents at once) is compute-bound, whereas model *inference* (generating tokens sequentially) is heavily memory-bandwidth bound.