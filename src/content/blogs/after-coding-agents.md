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

我相信，未来视频世界模型一定会吃掉一部分原本属于 3D 的任务。但距离真正替代这部分的 3D 任务，还有很多现实问题。哪怕有一天算法层面已经足够好了，算力和生成成本依然摆在那里；而且一个更现实的问题是，这类产品到底如何跑通盈利模式，用户为什么愿意持续为这样的能力付费，不管是 ToB 还是 ToC，这些问题其实都还没有特别清晰的答案。所以至少在我看来，这一天可能还没有那么快到来。

比较有意思的是，最近随着 Fable 5、Opus 5 以及 GPT-5.6 Sol 这类前沿模型的出现，我发现 X 社区里开始有越来越多人直接用这些模型去做 3D 物体建模、3D 场景搭建，甚至是完整的 3D 游戏生成。它们在 coding、reasoning 和工具使用能力上的提升，也确实为 3D 这个领域打开了一些新的可能性。

我自己本身就是一个游戏爱好者。最开始之所以会进入这个领域，其实也是因为以前一直很想做游戏。后来跟着闫令琪老师学习 GAMES101，又慢慢开始接触 UE 和游戏开发，才一点点走进了 3D 这个方向。很长一段时间里，我都有一个挺简单的梦想：有一天能够只靠自己，创造一个真正属于自己的游戏世界。

所以当我看到这些新的可能性开始出现时，确实会觉得很兴奋。也正因为这样，我想用自己拙略的文笔和浅薄的知识写下这篇博客，简单聊聊我的想法。

![世界模型与 Coding Agent 正在从不同方向重塑 3D 内容创作。](/assets/blog/after-coding-agents-intro.svg)

## 关于 WorldClaw

### 为什么要做？

在加入 Hunyuan3D 之前，我其实在 CVPR 2026 发表过一篇名为 [MajutsuCity](https://longhz140516.github.io/MajutsuCity/) 的工作，这也算是我对这个方向的一次比较早期的尝试。

最开始做它的想法其实很简单：我希望能够将 3D 生成模型所具备的生成能力真正应用到游戏场景制作中，让更多人能够借助生成式模型创造出一个沉浸式的、属于自己的世界。从这个角度来看，它和当前很多交互式视频世界模型探索的方向，其实存在一定的相似性。

但两者之间也存在一个非常重要的区别。视频模型可以生成非常精美的画面，同时逐渐具备一定的交互能力，但至少在目前，它似乎还很难真正接入到现有的游戏开发管线中。

前段时间我在小红书上看到 [黑糖燕麦](https://xhslink.cn/m/7Ks5Trikoiu) 老师写的帖子 [《为什么 Agent 和 World Model 不会替代 3D Gen》](https://xhslink.cn/o/AextfUfwQ3J)，里面有一句话让我非常认同：

> AI 游戏不会被 world model 完全替代，因为游戏从来不是视频，也不是连续画面的预测问题。视频只需要生成一个肉眼可信的下一帧，而游戏必须维护一个机器确信的下一状态，游戏需要回答的并不是下一秒的画面看起来是否合理，而是“这个攻击到底有没有命中”、“这个道具是否已经进入背包”、“这个技能的冷却是否结束”等确定性逻辑。画面只是游戏内部状态经过渲染之后的投影，而不是游戏状态本身。

这段话其实很好地点出了我一直比较关注的一点：对于游戏来说，仅仅生成一个“看起来合理”的画面是不够的。一个真正可交互的世界，还需要背后存在一个真实、可控、可编辑，并且能够持续维护的世界状态。

所以，如果暂时抛开公司和项目背景本身，WorldClaw 想探索的其实就是这样一种可能：通过构建一个可维护、可编辑的显式 3D 世界，让生成式模型不再只是负责创造画面，而是真正参与到未来游戏和数字内容生产流程中。

相比于只关注最终渲染结果，我们更希望探索如何构建一个能够长期存在的数字世界：其中的对象、空间关系和环境状态都可以被理解、修改、调整和复用，并且能够随着用户需求不断演化。这也是我认为未来 3D 生成与游戏创作之间一个非常重要的连接点。

![游戏需要可维护的世界状态，而不只是视觉上合理的下一帧。](/assets/blog/after-coding-agents-why.svg)

### 如何制定出论文中的流程的？

其实在接到这个主题的第一时刻，我马上就想好了整体的技术路线。由于我主要负责地形生成部分，因此第一时间想到的是图形学领域中已经被广泛使用的程序化内容生成（PCG）方法。

传统的游戏开发中，地形制作往往并不是完全依赖人工雕刻，而是通过多种噪声函数模拟自然地貌的起伏，例如利用不同频率的噪声组合生成山脉结构[^making-maps]，再结合采样策略进行环境资产散布，或者通过 Splat Map 对不同区域的材质进行混合。这些方法都是游戏中构建大规模场景的重要工具。

因此，我当时思考的是，与其完全重新设计一套生成方式，不如将这些成熟的图形学方法与当前快速发展的生成模型结合起来。对于贴图、3D 资产、材质等更依赖创造性的部分，可以交给生成模型完成，而传统 PCG 方法则负责保证世界的结构性、稳定性和可控性，PCG 不仅能够实现快速的地形生成，而且其实现方式可以完全通过代码来完成，这又进一步能运用当前 LLM coding方面的能力。

我认为，这种结合能够让传统的游戏开发方法获得新的生命力：生成模型负责创造，程序化方法负责组织，二者共同构建一个既具有创造性，又具备可编辑性和可维护性的 3D 世界。

![生成模型负责创造，程序化方法负责组织，共同构建可编辑的 3D 世界。](/assets/blog/after-coding-agents-process.svg)

其实在最开始


[^lingbot-world]: [Advancing Open-source World Models](https://arxiv.org/abs/2601.20540)
[^abot-world]: [ABot-World: Infinite Interactive World Rollout on a Single Desktop GPU](https://arxiv.org/abs/2607.19191)
[^project-eden]: [Project Eden: The First World Model for AI-native Multiplayer and Agent Interaction in a Consistent World State](https://www.tripo3d.ai/research/project-eden)
[^making-maps]: [Making maps with noise functions](https://www.redblobgames.com/maps/terrain-from-noise/)
