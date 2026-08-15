---
title: "After Coding Agents: Rethinking How We Create in 3D"
summary: "Starting from WorldClaw, I reflect on the current state of 3D coding agents, their limitations, and how they may reshape future 3D content creation."
date: "2026-08-15"
category: "Perspectives"
tags: ["3D", "Coding Agents", "Agentic 3D"]
cover: "/assets/blog/after-coding-agents.svg"
coverAlt: "A geometric diagram of code modules passing through an agent node and unfolding into a wireframe 3D world."
featured: true
---

## 前言

从5月开始在Hunyuan3D实习，到前段时间终于将在这边的第一个工作发了出来，也就是 [**WorldClaw**](https://tencent-hunyuan.github.io/Hunyuan3D-WorldClaw/)。比较没想到的是，这个工作后来在 X 和小红书上都引起了不少讨论和传播，我自己其实还蛮意外的。

毕竟这几年随着图像模型和视频模型不断发展，3D 这个方向比起来确实并没有那么好。与此同时，世界模型也陆续出现了很多很不错的工作，比如 LingBot-World[^lingbot-world]、ABot-World[^abot-world]、Project Eden[^project-eden] 等。看起来，很多趋势似乎都在指向同一个结论：传统 3D 的一部分价值，未来很可能会被新的生成范式重新定义，甚至替代。

我相信，未来视频世界模型一定会吃掉一部分原本属于 3D 的任务。但距离真正替代 3D，还有很多现实问题。哪怕有一天算法层面已经足够好了，算力和生成成本依然摆在那里；而且一个更现实的问题是，这类产品到底如何跑通盈利模式，用户为什么愿意持续为这样的能力付费，不管是 ToB 还是 ToC，这些问题其实都还没有特别清晰的答案。所以至少在我看来，这一天可能还没有那么快到来。

比较有意思的是，最近随着 Fable 5、Opus 5 以及 GPT-5.6 Sol 这类前沿模型的出现，我发现 X 社区里开始有越来越多人直接用这些模型去做 3D 物体建模、3D 场景搭建，甚至是完整的 3D 游戏生成。它们在 coding、reasoning 和工具使用能力上的提升，也确实为 3D 这个领域打开了一些新的可能性。

我自己本身就是一个游戏爱好者。最开始之所以会进入这个领域，其实也是因为以前一直很想做游戏。后来跟着闫令琪老师学习 GAMES101，又慢慢开始接触 UE 和游戏开发，才一点点走进了 3D 这个方向。很长一段时间里，我都有一个挺简单的梦想：有一天能够只靠自己，创造一个真正属于自己的游戏世界。

所以当我看到这些新的可能性开始出现时，确实会觉得很兴奋。也正因为这样，我想写下这篇博客，简单聊聊我的想法，虽然可能文笔很差。

## 关于 WorldClaw

Each article lives in `src/content/blogs/`. Its frontmatter holds the information used by the home page, while the Markdown body is loaded only after someone opens the article.



[^lingbot-world]: [Advancing Open-source World Models](https://arxiv.org/abs/2601.20540)
[^abot-world]: [ABot-World: Infinite Interactive World Rollout on a Single Desktop GPU](https://arxiv.org/abs/2607.19191)
[^project-eden]: [Project Eden: The First World Model for AI-native Multiplayer and Agent Interaction in a Consistent World State](https://www.tripo3d.ai/research/project-eden)
