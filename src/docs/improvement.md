  Sit 5: The Shield (Lifecycle & Performance)
  Time: 45 Minutes

* What to build: Visibility handling and CSS animations.
* The Mechanics:
       1. Visibility API: Listen for visibilitychange. If the user leaves the tab, ws.close(). If they return, ws.connect().
       2. GPU-Flash: Use CSS classes (e.g., .price-up, .price-down) with opacity and transform animations.
* Why:
  * Battery: An open crypto tab can kill a laptop battery in an hour if it's processing data in the background.
  * Performance: CSS animations run on the GPU, leaving the CPU free to process the incoming WebSocket data.

---
