import { Database } from './database.js'
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

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
            
            const { search } = req.query
            
            const tasks = database.select('tasks', search ? {
                title,
                description,
                completed_at,
                created_at,
                updated_at,
            } : null)
            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body       
            const formattedDate = getFormattedDate() 

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: formattedDate,
                updated_at: formattedDate,
            }

            database.insert('tasks', task)
            return res.writeHead(201).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            database.delete("tasks", id)
            return res.writeHead(204).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body
            const formattedDate = getFormattedDate() 

            database.update("tasks", id, {
                title,
                description,
                updated_at: formattedDate,
            })

            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params
            // const { title, description } = req.body
            const formattedDate = getFormattedDate() 

            database.update("tasks", id, {
                completed_at: formattedDate,
                updated_at: formattedDate,
            })

            return res.writeHead(204).end()
        }
    }
    
]
