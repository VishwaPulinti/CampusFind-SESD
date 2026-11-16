CAMPUSFIND COMPLETE FULL-STACK PROJECT

INCLUDED
- Frontend: HTML, CSS, JavaScript (existing CampusFind dashboard design retained)
- Backend: Node.js + Express REST API
- Database: MongoDB via Mongoose
- Student registration/login with bcrypt password hashing and JWT
- Lost and Found report submission
- Mandatory item photos (up to 5 images, 5 MB each)
- Uploaded image files saved in /uploads and paths stored in MongoDB
- Existing sample item cards/photos retained in the dashboard
- Search/list reports from MongoDB

REQUIREMENTS
- Node.js LTS
- MongoDB Community Server running locally, OR MongoDB Atlas URI

SETUP IN VS CODE
1. Extract ZIP and open the CampusFind_FullStack_Complete folder.
2. Open terminal in this folder (the folder containing package.json).
3. Install:
   npm install
4. Create .env:
   Copy-Item .env.example .env
5. Edit .env:
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/campusfind
   JWT_SECRET=use_a_long_random_secret
   (For Atlas, replace MONGODB_URI with your Atlas connection string.)
6. Ensure MongoDB service is running locally, or use Atlas.
7. Start:
   npm start
8. Open:
   http://localhost:5000

IMPORTANT
- Do not open public/index.html directly with file:// and do not use Python http.server.
- This is a student project starter. Review and strengthen access controls, validation, admin authorization, HTTPS, and file storage before production deployment.
- The existing dashboard includes demo/sample records for visual presentation; newly submitted reports are stored in MongoDB.
