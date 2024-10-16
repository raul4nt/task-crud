import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)
// usamos essa classe URL nativa do js para determinar
// o caminho que é para o writeFile criar o db.json pois
// se nao ele sempre criara com base na pasta que estamos 
// aberto no terminal. ex: se eu nao tenho o db.json criado,
// e no terminal to na pasta streams, o db.json sera criado la,
// e isso nao é pra acontecer, quero que seja sempre na raiz do meu
// projeto

export class Database {
    #database = {}
    // esse # faz com que database seja uma prop privada,
    // entao nao conseguimos acessar ele diretamente
    // isso é otimo quando se trata de db


    constructor () {
        fs.readFile(databasePath, 'utf8')
        .then(data =>{
            this.#database = JSON.parse(data)
        })
        .catch(() => {
            this.#persist()
        })
    }



    #persist () {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    select(table, search) {
        let data = this.#database[table] ?? []
    
        if (search) {
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].toLowerCase().includes(value.toLowerCase())
                })
            })
        }
    
        return data
    }
    

    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
    } else {
        this.#database[table] = [data]
    }

    this.#persist();

    return data;
    }

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id == id)
        
        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }
    }

    update(table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id == id)
        
        if (rowIndex > -1) {
            const existingTask = this.#database[table][rowIndex];
            
            this.#database[table][rowIndex] = { 
                id,
                ...existingTask, 
                ...data
            }
            this.#persist()
        }
    }
}
