import { Database } from './database.js';
import { randomUUID } from 'node:crypto';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

function getFormattedDate() {
    const today = new Date();
    return today.getFullYear() + '-' + 
           String(today.getMonth() + 1).padStart(2, '0') + '-' + 
           String(today.getDate()).padStart(2, '0');
}

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query;

            const tasks = database.select('tasks', search ? {
                title,
                description,
                completed_at,
                created_at,
                updated_at,
            } : null);

            return res.end(JSON.stringify(tasks));
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            // Verifique se req.body está definido e se não é null
            if (!req.body) {
                return res.writeHead(400, { 'Content-Type': 'application/json' })
                    .end(JSON.stringify({ error: 'Request body is required' }));
            }

            const { title, description } = req.body;
            const formattedDate = getFormattedDate();

            if (title && description) {
                const task = {
                    id: randomUUID(),
                    title,
                    description,
                    completed_at: null,
                    created_at: formattedDate,
                    updated_at: formattedDate,
                };

                database.insert('tasks', task);
                return res.writeHead(201).end();
            } else {
                return res.writeHead(400, { 'Content-Type': 'application/json' })
                    .end(JSON.stringify({ error: `Fields "title" and "description" are required` }));
            }
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;

            try {
                database.delete("tasks", id);
                return res.writeHead(204).end();
            } catch {
                return res.writeHead(404, { 'Content-Type': 'application/json' })
                    .end(JSON.stringify({ error: `Task with ID ${id} not found` }));
            }
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;
            
            // Verifique se req.body está definido e se não é null
            if (!req.body) {
                return res.writeHead(400, { 'Content-Type': 'application/json' })
                    .end(JSON.stringify({ error: 'Request body is required' }));
            }

            const { title, description } = req.body;
            const formattedDate = getFormattedDate();

            if (title && description) {
                try {
                    database.update("tasks", id, {
                        title,
                        description,
                        updated_at: formattedDate,
                    });
                    return res.writeHead(204).end();
                } catch {
                    return res.writeHead(404, { 'Content-Type': 'application/json' })
                        .end(JSON.stringify({ error: `Task with ID ${id} not found` }));
                }
            } else {
                return res.writeHead(400, { 'Content-Type': 'application/json' })
                    .end(JSON.stringify({ error: `Fields "title" and "description" are required` }));
            }
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params;
            const formattedDate = getFormattedDate();

            try {
                database.update("tasks", id, {
                    completed_at: formattedDate,
                    updated_at: formattedDate,
                });
                return res.writeHead(204).end();
            } catch {
                return res.writeHead(404, { 'Content-Type': 'application/json' })
                    .end(JSON.stringify({ error: `Task with ID ${id} not found` }));
            }
        }
    }
];
