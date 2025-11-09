# Technical Restrictions

- [ ] **Front-end**: Next.js, React Query, Tailwind, TypeScript  
- [X] **Back-end**: Elysia, Better Auth, Drizzle, TypeScript  

---

# Functional Requirements

- [ ] Users must be able to register a URL and receive a shortened version.  
- [ ] Users must be able to list their registered URLs and filter this listing.  
- [ ] There must be a public listing of URLs registered by users, if they marked them as public (not private).  

---

# Non-Functional Requirements

- [ ] The system must support 2FA login.  
- [ ] The system must allow access to the public listing even without being logged in.  
- [ ] The system must have low latency and high throughput.

---

# Business Rules

- [ ] The system must allow up to **100 URLs per user**.  
- [ ] The system must not allow registering URLs without the user being logged in.  
