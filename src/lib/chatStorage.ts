import { Thread, QuickAction } from "../types";

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "write",
    title: "Help me write...",
    description: "Draft a professional email or technical documentation for a new project.",
    icon: "FileText",
    prompt: "Can you help me draft a professional email or technical documentation for a new project? Here's what it should cover:"
  },
  {
    id: "analyze",
    title: "Analyze this data...",
    description: "Upload a CSV or paste JSON to extract insights and generate visualizations.",
    icon: "BarChart2",
    prompt: "I have some data I'd like to analyze. Can you help me extract key insights, structure the data, and design clean visualizations?"
  },
  {
    id: "debug",
    title: "Debug code...",
    description: "Identify logical errors or optimize performance in your Python or JS scripts.",
    icon: "Terminal",
    prompt: "Can you explain how to implement a basic asynchronous task queue in Python using the `asyncio` library? I'm specifically looking for a way to manage multiple workers processing items from a shared queue."
  },
  {
    id: "brainstorm",
    title: "Brainstorm ideas...",
    description: "Generate creative concepts for marketing, product features, or content.",
    icon: "Sparkles",
    prompt: "Let's brainstorm some creative concepts, marketing copy, or product features. Here is the background of my project:"
  }
];

const INITIAL_THREADS: Thread[] = [
  {
    id: "async-queue-demo",
    title: "Asynchronous Python Queue",
    createdAt: new Date().toISOString(),
    messages: [
      {
        id: "m1",
        role: "user",
        content: "Can you explain how to implement a basic asynchronous task queue in Python using the `asyncio` library? I'm specifically looking for a way to manage multiple workers processing items from a shared queue.",
        timestamp: "Just now"
      },
      {
        id: "m2",
        role: "assistant",
        content: `Certainly! In Python, the \`asyncio.Queue\` class is perfect for this. It allows you to coordinate producer and consumer coroutines. Here's a clean implementation showing a worker-pool pattern:

\`\`\`python
import asyncio
import random

async def worker(name, queue):
    while True:
        # Get a "work item" out of the queue
        item = await queue.get()
        print(f"{name} is processing {item}")
        
        # Simulate work
        await asyncio.sleep(random.random())
        
        # Notify the queue that the item is processed
        queue.task_done()

async def main():
    queue = asyncio.Queue()
    # Create 3 worker tasks to process the queue
    workers = [asyncio.create_task(worker(f"W-{i}", queue)) for i in range(3)]
\`\`\`

This structure ensures that multiple tasks can process the queue concurrently, reducing overall execution time when dealing with I/O bound operations. Do you need a breakdown of how \`queue.join()\` works with this?`,
        timestamp: "Just now"
      }
    ]
  }
];

const LOCAL_STORAGE_KEY = "deep_sea_ai_threads";

export function loadThreads(): Thread[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_THREADS));
      return INITIAL_THREADS;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to load threads from localStorage:", error);
    return INITIAL_THREADS;
  }
}

export function saveThreads(threads: Thread[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(threads));
  } catch (error) {
    console.error("Failed to save threads to localStorage:", error);
  }
}
