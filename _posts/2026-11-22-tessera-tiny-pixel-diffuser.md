---
layout: post
title: "What a Tiny 47.6M-Parameter Pixel Diffuser Teaches Us About Quantization, Compute, and Training vs. Inference"
tags: ai
---

[![Tessera rendering quality and sampler mode impact](/static/images/tessera_mode_impact_summary.png)](/static/images/tessera_mode_impact_summary.png)

*Click the image for the full-resolution version.*

---

When we talk about generative AI, we usually picture multi-billion-parameter giants running on data-center GPUs. Recently, however, I ran a hands-on experiment with **Tessera-small**, a tiny **47.6-million-parameter** discrete diffusion model by Jagrat Patel (`thejagstudio/tessera-small`), alongside its in-browser ONNX port (`cfahlgren1/slack-moji`). Because the entire canvas is just a **`16×16` pixel grid**, you can literally count every pixel and see how **quantization**, **inference compute**, and **training data** shape the final image.

## 1. How Inference Translates Words into Pixels
Unlike continuous diffusion models that denoise blurry floating-point latents, Tessera is a **Masked Diffusion Language Model**. It treats a `16×16` sprite as a **256-word sentence** where every pixel is a discrete token from a **512-color vocabulary** (plus `[MASK]`).

During **inference** (turning your text prompt into an image):
1. **Text Encoding**: Your prompt (e.g., `"cat wearing sunglasses"`) is converted into 24 text tokens by a frozen CLIP text encoder.
2. **12-Layer Hourglass Transformer**: The 24 text tokens and 256 masked pixel tokens enter a single bidirectional sequence inside a **12-block transformer** (`2` full-resolution blocks → `8` patch-merged `8×8` core blocks for global shape → `2` full-resolution blocks for crisp outlines).
3. **Parallel Unmasking**: Starting from a blank canvas of 256 `[MASK]` tokens, the model predicts a 512-color probability distribution for every pixel at once. Over **16 steps**, it locks in ("unmasks") the highest-confidence pixels first—usually the transparent background and black silhouette boundary in steps 1–4, followed by interior colors and shading in steps 5–16.

## 2. Quantization and Inference Compute: Browser vs. Studio
To make Tessera run 100% inside a web browser with zero server cost, `cfahlgren1` quantized the model weights from 16-bit floats (`224 MB`) down to **8-bit integers (`115 MB`)** using ONNX Runtime Web (`WebGPU`).

Surprisingly, `int8` quantization barely hurts the weights—the quantized model agrees with the full `fp16` model on **91–99% of top pixel choices**. Yet, as our comparison chart shows, **how much compute you spend during inference sampling** makes a dramatic visual difference:
- **Fast / Naive (4 steps, no spatial filtering)**: Confidence drops to `~65–77%`. Because too many neighboring pixels lock in simultaneously without seeing each other's choices, the sprite fractures into 39 noisy colors (and our rubber duck grows a second head).
- **Browser Default (`16 steps`, constant guidance)**: Runs in `~3 seconds` on local WebGPU (`~80–84%` confidence). Adding **3×3 Spatial Non-Maximum Suppression (NMS)** stops adjacent uncertain pixels from clashing, producing a solid emoji baseline.
- **Studio Advanced + Polish (`24 steps`, cosine guidance ramp, +2 polish passes)**: By giving the sampler more steps and **re-masking the least confident 8% of pixels twice** at the very end, pixel confidence jumps to **`91–95%`**. Stray color noise disappears, tightening a 36-color health potion into a crisp, 14-color pixel-art icon.

## 3. Training vs. Inference: Why `"a man who is walking with a dog"` Fails
What happens when we prompt `"a man who is walking with a dog"`? Even with 24 steps and polish passes at `92.5%` confidence, the model draws **only a walking man**—no dog!

This neatly separates **inference quality** from **training limitations**:
- **Inference** can only rearrange patterns the model learned during **training**.
- Tessera was trained for 30 epochs on **Pixel Art Atlas 1.4M**—a dataset of 1.4 million retro game icons where almost every image is a **single centered subject** filling the entire `16×16` tile.
- A pixel-art human character already requires `14×8` pixels for a readable head, torso, legs, and black boundary outline. Once the transformer locks a centered human into columns `4–11` during steps 1–4, there is no physical grid space left for a dog, nor did the training data teach the model to "zoom out" and draw a 4-pixel yellow stick-man next to a 3-pixel white dog.

**The Takeaway**: Quantization (`int8` ONNX) lets us move a 47.6M model from a cloud GPU straight into the browser, and smarter inference sampling (spatial NMS + polish passes) cleans up pixel-level noise. But no amount of inference compute can overcome a training distribution prior: when your world is `16×16` single-subject sprites, a multi-character scene requires generating two sprites and stitching them together!
