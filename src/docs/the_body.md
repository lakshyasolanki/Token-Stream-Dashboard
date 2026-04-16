
  Sit : The Face (Direct-to-DOM Components)
  Time: 1 Hour

* What to build: TokenList.tsx and TokenCard.tsx.
* The Rendering Strategy:
       1. The Container: Use React.memo on the TokenCard so it only re-renders if its symbol changes.
       2. The Ticker: Inside TokenCard, use a useRef for the price text.
       3. The Subscription: Use useTokenStore.subscribe to listen for price changes for that specific symbol and update the innerText of your ref directly.
* Why: This bypasses the React Virtual DOM entirely for the "Hot" data (the price). The rest of the card (logo, name) stays static, while the numbers fly.

---

### TokenList.tsx

* Virtualisation

### TokenCard.tsx

Dynamic Elements: SVG Sparkline, Price, Card Background Flash, Percentage Change(24 Trend)
Static Elements: Image, Name, Symbol

* React.memo

* Ref based updates

* Visual "Price Flash" (User Feedback)
The background "flash" of the entire card represents the immediate direction of the latest price update.
Inside the TokenCard, compare the oldPrice (previous render) with the newPrice. Use a simple CSS transition or a "flash" class to show the change. It makes the app feel "alive."

* Percentage Change Element (24h Trend): The small rounded box showing the percentage represents the long-term change (usually 24 hours). It stays green or red based on whether the token is up or
down since yesterday.

* Sparkline Graph Component:

### Other

* Added Symbols and Token Info for websocket stream
* Formatting Helpers
Prices like 0.00004512 look messy if not formatted. Created utils function like- formatPrice(value): Handles decimals (e.g., BTC needs 2 decimals, PEPE needs 8), formatPercentage(value): Adds the % and a + sign if it's positive, formatVolume(value): Turns 1,000,000 into 1.0M.
