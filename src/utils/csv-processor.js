import fs from 'fs';
import { parse } from 'csv-parse';
import { resolve } from 'path';
import { createReadStream } from 'fs'; 
import { routes } from '../routes.js';

const postRoute = routes.find(route => route.method === 'POST');
console.log(postRoute)

const csvFilePath = resolve('./tasksCsv.csv');

(async () => {
    // Inicializa o contador aqui, em um escopo mais amplo
    let notFirstRecord = false;

    // Lê o arquivo CSV
    fs.readFile(csvFilePath, 'utf8', async (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo CSV:', err);
            return;
        }

        const tasksCsv = createReadStream(csvFilePath);
        const parser = tasksCsv.pipe(parse());

        // Reporta o início
        process.stdout.write('start\n');

        // Itera através de cada registro usando for await na função assíncrona superior
        for await (const record of parser) {
            // Crie um objeto fake para req e res
            const req = {
                body: {
                    title: record[0], // Supondo que o título esteja na primeira coluna
                    description: record[1], // Supondo que a descrição esteja na segunda coluna
                }
            };

            const res = {
                writeHead: (statusCode) => {
                    console.log(`Response Status: ${statusCode}`);
                    return res; // Permite encadear
                },
                end: () => {
                    console.log('Response ended.');
                }
            };

            if (notFirstRecord) {
                // Chame a função handler da rota POST
                await postRoute.handler(req, res);
            } else{
                {}
            }
            
            notFirstRecord = true;

            // Operação assíncrona fictícia
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        // Reporta o fim após a iteração
        process.stdout.write('...done\n');
    });
})();
