# Running the Project Locally

### **1. Setting Up PostgreSQL Locally**

1. **Install PostgreSQL**:

   - On Linux: `sudo apt update && sudo apt install postgresql postgresql-contrib`
   - On macOS: Use `brew install postgresql`
   - On Windows: Download from [PostgreSQL.org](https://www.postgresql.org/).

2. **Start PostgreSQL Service**:

   - On Linux: `sudo service postgresql start`
   - On macOS: `brew services start postgresql`
   - On Windows: Start the PostgreSQL server through the provided GUI.

3. **Access PostgreSQL**:

   - Use `psql` CLI or a GUI tool like pgAdmin or DBeaver.
   - Default user is usually `postgres`. Create a new database:
     ```sql
     CREATE DATABASE mydb;
     ```

4. **Create a `.env` File**. A template is provided in the backend folder

---

### **2. Setting Up Express.js Backend**

1. **Navigate to the backend folder**:

   ```bash
    cd backend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Run the Backend**:
   ```bash
   node run dev
   ```

---

### **3. Setting Up React Frontend**

1. **Navigate to the frontend folder**:

   ```bash
    cd frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run React App**:
   ```bash
   npm run dev
   ```

---

### **4. Setting Up Firebase Storage**

1. **Create Firebase Project**:

   - Go to [Firebase Console](https://console.firebase.google.com/).
   - Create a project and enable **Storage** under the **Build** section.

2. **Get Firebase Config**:

   - Go to **Project Settings** → **General** → **Your Apps** → Add a Web App.
   - Copy the Firebase config object.

3. **Setup .env file**:
   - Fill in the properties in the `.env` file in the backend folder.

---

### **5. Summary**

- Start **PostgreSQL**: Ensure the database is running.
- Start **Express Backend**: `npm run dev`
- Start **React Frontend**: `npm run dev`
- Configure Firebase for **Storage** and set up the `.env` file.
