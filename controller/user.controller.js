const db = require("../config/db")
const express = require("express")

const allTasks =async (request, response) => {
  const userId = request.user.id;
  try {
      const [tasks] = await db.query(
          `SELECT 
              tasks.id AS taskId,
              tasks.title, 
              tasks.description,
              tasks.status,
              tasks.deadline,
              clients.id AS clientId,
              clients.client_name AS clientName
              FROM tasks
              INNER JOIN clients ON tasks.client_id = clients.id
              WHERE tasks.user_id = ?
              `, [userId]
      )

      response.status(200).json({ tasks });
  } catch (error) {
      console.error("Error fetching tasks with client info:", error);
      response.status(500).json({ message: "Failed to fetch tasks", error: error.message });
  }
}
const addClient = async (req, res) => {
    const { clientName } = req.body;
    const userId = req.user.id;
  
    try {
      const [result] = await db.query(
        `INSERT INTO clients (user_id, client_name) VALUES (?, ?)`,
        [userId, clientName]
      );
  
      if (result.affectedRows > 0) {
        res.status(201).json({ message: "Client added successfully!" });
      } else {
        throw new Error("No rows affected");
      }
    } catch (error) {
      console.error("Error while adding client:", error);  
      res.status(500).json({ message: "Failed to add client", error: error.message });  
    }
  }


  const addTasks = async (request, response) => {
    const { clientId, title, description, status, deadline } = request.body;
    const userId = request.user.id;
  
    if (!clientId || !title || !status) {
      return response.status(400).json({ message: "client Id and title required!" });
    }
  
    try {
      const [clients] = await db.query(
        `SELECT * FROM clients WHERE id = ? AND user_id = ?`,
        [clientId, userId]
      );
  
      if (clients.length === 0) {
        return response.status(403).json({ message: "Unauthorized to assign task to this client!" });
      }
  
      await db.query(
        `INSERT INTO tasks (user_id, client_id, title, description, status, deadline) VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, clientId, title, description || null, status, deadline]
      );
  
      response.status(201).json({ message: "Task added successfully" });
    } catch (error) {
      console.error("add Task Error:", error);
      response.status(500).json({ message: "Failed to add task", error: error.message });
    }
  };
  
  const editClient = async (request, response) => {
    const clientId = request.params.id;
    const userId = request.user.id;
    const { client_name } = request.body;  
    if (!client_name) {
      return response.status(400).json({ message: "Client name is required" });
    }

    try {
      const [clients] = await db.query(
        "SELECT * FROM clients WHERE id = ? AND user_id = ?",
        [clientId, userId]
      );
  
      if (clients.length === 0) {
        return response
          .status(403)
          .json({ message: "Unauthorized to update this client" });
      }
      await db.query(
        "UPDATE clients SET client_name = ? WHERE id = ? AND user_id = ?",
        [client_name, clientId, userId]
      );
  
      response.status(200).json({ message: "Client updated successfully" });
    } catch (error) {
      console.error("Edit client error:", error);
      response
        .status(500)
        .json({ message: "Failed to update client", error: error.message });
    }
  }

  const editTask =  async (request, response) => {
    const taskId = request.params.id;
    const userId = request.user.id;
    
    const { title, description, status, deadline } = request.body;
  
    if (!title || !status) {
      return response.status(400).json({ message: "Title and status are required to update task" });
    }
  
    try {
      const [tasks] = await db.query(
        "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
        [taskId, userId]
      );
  
      if (tasks.length === 0) {
        return response.status(403).json({ message: "Unauthorized to edit this task" });
      }
  
      await db.query(
        `UPDATE tasks 
         SET title = ?, description = ?, status = ?, deadline = ? 
         WHERE id = ? AND user_id = ?`,
        [title, description || null, status, deadline || null, taskId, userId]
      );
  
      response.status(200).json({ message: "Task updated successfully" });
    } catch (error) {
      console.error("Edit task error:", error);
      response.status(500).json({ message: "Failed to update task", error: error.message });
    }
  }

module.exports = {
    allTasks,
    addClient,
    editClient,
    addTasks,
    editTask
}