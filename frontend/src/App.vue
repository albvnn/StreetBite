<template>
  <div id="app">
    <header>
      <h1>StreetBite</h1>
    </header>

    <main>
      <!-- Espace réservé pour les futures cards -->
    </main>

    <footer>
      <nav class="footer-nav">
        <ul>
          <li><a href="#">Accueil</a></li>
          <li><a href="#">À propos</a></li>
          <li><a href="#">Contact</a></li>
          <li><a href="#">Mentions légales</a></li>
        </ul>
      </nav>
      <div class="footer-meta">© 2025 StreetBite — Tous droits réservés</div>
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
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  text-align: center;
  padding: 32px 16px 16px;
}

header h1 {
  margin: 0;
}

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
