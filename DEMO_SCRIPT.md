# Vidya Rakshak - Final Exam Demo Script

Use this script to demonstrate your project during the final viva/exam.

## 1. Preparation (Before Presentation)
1.  **Stop all running terminals**.
2.  Open **Terminal 1** and run Backend:
    ```powershell
    .\start_backend.bat
    ```
    *Wait for "Application startup complete"*
3.  Open **Terminal 2** and run Frontend:
    ```powershell
    npm run dev
    ```
4.  Open Browser to: `http://localhost:3000`

## 2. Admin Demo (The "College Side")
1.  **Login**:
    *   Click **Admin Login**.
    *   Email: `admin@vidya.com`
    *   Password: `admin123`
2.  **Dashboard**:
    *   Show the "Total Students" count.
    *   Show the "Attendance Today" circular graph.
3.  **Manage Students**:
    *   Go to **Manage Students**.
    *   **Action**: Click "Add Student".
    *   **Fill Form**: Name: "Test Student", Roll No: "DEMO-001", Dept: "Computer".
    *   **Camera**: Click "Open Camera", take **5 different photos** (front, left, right, up, down).
    *   Click **Save Student**.
    *   *Explain*: "The system captures multiple angles to create a robust face embedding."
4.  **Edit/Delete** (Optional):
    *   Show the **Edit** (Pencil) button to change phone number.
    *   Show the **Delete** (Trash) button functionality.

## 3. Student Demo (The "Student Side")
1.  **Logout** from Admin.
2.  **Student Login**:
    *   Switch tab to **Student Login**.
    *   Email: (The email you just registered)
    *   Roll No: `DEMO-001`
3.  **Dashboard**:
    *   Show the student's personal profile card.
    *   Show "Attendance: 0%".
4.  **Mark Attendance**:
    *   Click **"Mark Attendance"** button.
    *   Explain: "Allows remote/hostel students to mark attendance securely."
    *   Capture photo.
    *   **Success**: "Attendance Marked Successfully!"
    *   Show the "Recent Activity" table now has a "Present" entry.
    *   Show the percentage is now updated.

## 4. Standalone Camera Demo (The "Gate" System)
1.  Keep the server running.
2.  Open **Terminal 3**.
3.  Run:
    ```powershell
    .\start_smart_camera.bat
    ```
4.  **Action**:
    *   Walk in front of the webcam.
    *   Observe the green box and name label "Test Student".
    *   Check the Admin Dashboard -> "Live Logs" (if available) or "Attendance Today".

## 5. Key Tech Stack to Mention
*   **Frontend**: Next.js 15, TypeScript, TailwindCSS (Modern, Fast).
*   **Backend**: FastAPI (Python), MongoDB (NoSQL Database).
*   **AI/ML**: MediaPipe (for Face Detection), OpenCV (for Image Processing).
*   **Security**: Face Embeddings are stored, not raw images (Privacy).
