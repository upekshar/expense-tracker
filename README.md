# 📊 Expense Tracker App

A full‑featured expense tracking app built with **React**, **TypeScript**, **Redux Toolkit**, and **React Query** with **offline support**.  
Users can add, edit, delete, and sync expenses even when offline — with automatic synchronization when online.

---

## 🚀 Features

✅ Add, edit, delete expenses  
✅ Offline action queue with auto‑sync  
✅ Filtering by category  
✅ Sorting by date/amount  
✅ Client-side pagination with “Load More”  
✅ Optimistic UI updates  
✅ Form validation  
✅ Toast notifications for user feedback  
✅ Beeceptor mock API support

---

## 🧩 Tech Stack

| Technology           | Purpose                      |
| -------------------- | ---------------------------- |
| React                | UI Library                   |
| Redux Toolkit        | Global state + offline queue |
| React Query          | Server state + caching       |
| TypeScript           | Static typing                |
| Tailwind CSS         | Styling                      |
| React Hook Form      | Form handling & validation   |
| Beeceptor / Mock API | Backend prototyping          |

---

## 🛠️ Getting Started

### Prerequisites

Ensure you have the following installed:

````bash
node --version
npm --version


## Installation

git clone https://github.com/<your‑username>/expense‑tracker.git
cd expense‑tracker

Environment Variables
Create a .env file in the project root:
VITE_API_BASE_URL=https://<your‑beeceptor‑domain>

Example:
VITE_API_BASE_URL=https://my‑beeceptor.io/expensetracker


📡 Mock API Setup (Beeceptor)


Go to: https://app.beeceptor.com/console/expensetracker


Create routes:


GET /expenses


POST /expenses


PUT /expenses/:id


DELETE /expenses/:id




Update VITE_API_BASE_URL in your .env accordingly.


Beeceptor lets you view requests, but it doesn’t persist data. For real persistence use a real API service.



🧠 Offline Sync Behavior
Offline actions (add/update/delete) are stored in a Redux queue:


User actions are queued while offline.


When online, middleware listens for "sync/triggerSync".


The middleware sends queued actions to the API.


If all succeed, the queue is cleared.


React Query refetches expenses data for UI consistency.



🧪 Usage
📌 Add Expense
Fill out the form and submit — expenses appear immediately even when offline.

✏️ Edit Expense
Click the ✏️ icon on an expense card to edit inline.

🗑 Delete Expense
Click the 🗑 icon — confirmed deletes sync later if offline.

📋 Filter / Sort


Filter by category (All, Food, Travel, Shopping)


Sort by date or amount



🔄 Load More
Use the “Load More” button to paginate through additional expenses.

🧰 Form Validation Rules


Title: required, minimum 3 characters


Amount: required, greater than 0


Date: required, cannot be future


Category: required


Notes: optional, max length 200



🧑‍💻 Development
📦 Scripts
ScriptDescriptionnpm run devStart dev servernpm run buildBuild productionnpm run previewPreview production buildnpm testRun tests (if configured)

👥 Contributing
Contributions are welcome!


Fork the repo


Create a branch:
git checkout -b feature/your-feature



Make your changes


Create a pull request


Ensure code is documented and tested.

📄 License
This project is licensed under the MIT License.

🙌 Acknowledgements
Thank you to the open source community for tools and inspiration.

---

## 📥 How to Download

To turn this into a real downloadable file:

1. Create a file in your project root:
   ```bash
   touch README.md


````
