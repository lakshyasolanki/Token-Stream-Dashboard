We have to manage state by which our ui will render, Before directly writing code to manage state, we should study the design of this system. Because managing state isn't enough for this system,
you have to understand how we are controlling data flow.
I am creating a token store using zustand, in which their are five things i am providing from the store.

- Tokens (Object)
- Sorted Symbols (Array)
- Connections Status (String)
(This are the functions by which state can update or managed)
- batchUpdate 💍
- setConnectionStatus

Before creating them directly in zustand we should structure the data i mean we should create types first.

###### Why using Zustand instead of manging state using useState?
