<template>
  <div id="app">
    <header class="header-bar">
      <div class="brand">
        <h1>StreetBite <span class="emoji" aria-hidden="true">🍔</span></h1>
      </div>
    </header>

    <main>
      <!-- Reserved space for future cards -->
    </main>

    <footer>
      <nav class="footer-nav">
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
          <li><a href="#">Legal notice</a></li>
        </ul>
      </nav>
      <div class="footer-meta">© 2025 StreetBite — All rights reserved</div>
    </footer>
  </div>
  
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Inter', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #111111;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header-bar {
  padding: 24px 16px 8px;
}

.brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.brand h1 {
  margin: 0;
  font-weight: 700;
  letter-spacing: 0.2px;
}

.emoji { font-size: 0.9em; }

main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
}

footer {
  margin-top: auto;
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  background: #fafafa;
}

.footer-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.footer-nav a {
  text-decoration: none;
  color: #374151;
}

.footer-nav a:hover {
  color: #111827;
}

.footer-meta {
  text-align: center;
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
}
</style>
