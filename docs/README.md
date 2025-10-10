# StreetBite – Street Food Finder & Rating Platform

StreetBite is a web platform that helps users discover, review, and rate street food stands in their city.

* **Customers**: register, browse stands, check menus, and leave reviews with ratings.
* **Owners**: manage their food stands and menu items.
* **Statistics**: average ratings per stand, and top 3 most popular categories.

---

## Main Features

* **User Management**: register, log in, manage profile (customer / owner).
* **Food Stands**: created and managed by owners (name, category, location, opening hours).
* **Menus**: each stand has menu items (name, description, price, availability).
* **Reviews**: customers can leave reviews (rating, comment, likes).
* **Statistics (non-CRUD)**:

  * Calculate the **average rating per stand**
  * Display the **Top 3 categories** by popularity

---

## Planned Tech Stack

* **Frontend**: HTML, CSS, Vue.js
* **Backend**: Node.js (Express)
* **Database**: MySQL (foreign keys, CRUD, non-CRUD queries)
* **Design & Documentation**: UML (use case, activity, sequence, class, component), ERD, Gantt chart

---

## Database Schema (Main Tables)

* **Users** (customers and owners)
* **FoodStands** (linked to owners)
* **MenuItems** (linked to stands)
* **Reviews** (linked to users and stands)

---

## Project Structure

```text
backend/
  main.sql
frontend/
  src/
  public/
  package.json
  vue.config.js
docs/
  README.md
  diagrams/
  planning/
```

---

## Getting Started (draft)

### Frontend (Vue)

```bash
cd frontend
npm install
npm run dev
```

### Backend (Express)

```bash
cd backend
npm init -y
npm install express mysql2
node index.js
```

### Database

Import the file:

```bash
backend/main.sql
```

into MySQL.

---

## License

Academic project – EFREI ING1 Project.