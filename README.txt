CAMPUSFIND – FULL-STACK SESD PROJECT (API-EXTENDED BUILD)
========================================================

STACK
- Frontend: existing CampusFind HTML/CSS/JavaScript design in public/index.html
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Authentication: bcrypt password hashing + JWT
- Uploads: Multer (images and claim proof files)

LOCAL SETUP
1. Install Node.js LTS and MongoDB Community Server, or create a MongoDB Atlas database.
2. Open this project root folder in VS Code.
3. Run: npm install
4. Copy .env.example to .env
   PowerShell: Copy-Item .env.example .env
5. Edit .env:
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=replace_with_a_long_random_secret
   ADMIN_EMAILS=your-real-admin-email@yourdomain.edu
6. Run: npm start
7. Open http://localhost:5000

IMPORTANT ADMIN SETUP
- Put the exact email address you will use for the administrator in ADMIN_EMAILS.
- Register/login using that email. It receives the admin role automatically.
- Never publish your .env file or JWT secret to GitHub.
- If an admin account was created before setting ADMIN_EMAILS, log out and log in again after updating .env.

RENDER DEPLOYMENT
- Create a Web Service connected to this GitHub repository.
- Build command: npm install
- Start command: npm start
- Add environment variables in Render dashboard: MONGODB_URI, JWT_SECRET, ADMIN_EMAILS.
- Use MongoDB Atlas for persistent database storage.
- Render's local filesystem may be ephemeral. For persistent uploaded photos, configure a persistent disk or move uploads to object storage (for example Cloudinary/S3) before production use.
- After deployment, test: https://YOUR-SERVICE.onrender.com/api/health

BACKEND API
Authentication:
 POST /api/auth/register       {name,email,password}
 POST /api/auth/login          {email,password}

Reports (Bearer token required):
 GET    /api/reports           optional ?type=lost|found&search=term
 GET    /api/reports/mine
 POST   /api/reports           multipart form; images field required (up to 5)

Claims (Bearer token required):
 POST /api/claims              multipart: itemId, description, proofFiles (up to 5)
 GET  /api/claims/mine

Admin API (Bearer token + admin role required):
 GET    /api/admin/overview
 GET    /api/admin/claims
 PATCH  /api/admin/claims/:id  {decision:"Approved"|"Rejected",adminNotes}
 GET    /api/admin/users
 PATCH  /api/admin/users/:id/status {status:"active"|"suspended"}
 GET    /api/admin/items
 PATCH  /api/admin/items/:id/archive
 DELETE /api/admin/items/:id
 GET/POST /api/admin/settings  {kind:"category"|"location",name}
 DELETE /api/admin/settings/:id
 GET/POST /api/admin/announcements {title,message}
 GET    /api/admin/export/items.csv
 GET    /api/admin/export/claims.csv

API AUTHORIZATION
For protected endpoints send:
Authorization: Bearer YOUR_JWT_TOKEN

PROJECT NOTES
- Passwords are hashed; passwords are never returned by user APIs.
- Claim submissions and moderation decisions persist in MongoDB.
- Admin endpoints enforce server-side role checks; hiding an admin tab in the browser is not security.
- The existing public/index.html is retained to preserve the CampusFind visual design. Some original dashboard sections are still client-side demo interactions; connect their buttons/forms to the API endpoints above before presenting every UI action as live. The API layer is implemented, but browser UI wiring and end-to-end verification should be completed against your deployed database before final submission.
- Uploaded files are written to /uploads and are served from /uploads/<filename>.
