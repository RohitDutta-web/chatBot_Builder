ChatBot Builder

A visual chatbot flow builder built with React and Material-UI, enabling users to design, manage, and execute automated conversational workflows.

🚀 Features


Node Types: Supports text, buttons, and media nodes.

Execution Logs: View real-time logs of chatbot executions.

CRUD Operations: Create, read, update, and delete chatflows and nodes.

Responsive UI: Built with Material-UI for a modern and responsive design.

Frontend: React, Material-UI

Backend: Node.js, Express (assumed from context)

State Management: React Hooks (useState, useEffect)

HTTP Client: Axios

Environment Variables: Vite's import.meta.env

📦 Installation
1. Clone the Repository
git clone https://github.com/RohitDutta-web/chatBot_Builder.git
cd chatBot_Builder

2. Frontend Setup

Navigate to the client directory:

cd client


Install dependencies:

npm install


Start the development server:

npm run dev


The frontend will be accessible at http://localhost:5173.

3. Backend Setup

Navigate to the server directory:

cd server


Install dependencies:

npm install


Start the backend server:

npm start


The backend will be accessible at http://localhost:3000.
Before running the project, make sure to create a .env file in the root of your backend directory with the following variables:
MONGODB_URI: Your MongoDB connection string.

PORT: The port on which the backend server will run (default is 3000).

SECRET: A secret key used for encryption, signing tokens, or session management.

INSTAGRAM_ACCESS_TOKEN: Replace none with your own Instagram access token. The current value is a demo token and won’t work for real Instagram API requests.



🧪 Usage

Chatflow Builder: Access the builder interface to design chatbot flows by adding nodes and defining transitions.

Execution Logs: Monitor real-time logs of chatbot executions to track interactions and troubleshoot issues.

Create/Edit Chatflows: Use the provided forms to create new chatflows or edit existing ones.

Delete Chatflows: Remove unwanted chatflows through the interface.

🧩 Contributing

We welcome contributions! To get started:

Fork the repository.

Create a new branch (git checkout -b feature/your-feature).

Implement your changes.

Commit your changes (git commit -am 'Add new feature').

Push to the branch (git push origin feature/your-feature).

Create a new Pull Request.

Please ensure your code adheres to the project's coding standards and includes appropriate tests.
