import fs from 'node:fs';
import { parse } from 'csv-parse';
import { resolve } from 'node:path';
import { createReadStream } from 'fs'; 
import { routes } from '../src/routes.js';

const postRoute = routes.find(route => route.method === 'POST');

const csvFilePath = resolve('./streams/tasksCsv.csv');

async function csvProcessor() {

    let notFirstRecord = false;


    fs.readFile(csvFilePath, 'utf8', async (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo CSV:', err);
            return;
        }

        const tasksCsv = createReadStream(csvFilePath);
        const parser = tasksCsv.pipe(parse());

        
        for await (const record of parser) {
        
            const req = {
                body: {
                    title: record[0], 
                    description: record[1], // 
                }
            };

            const res = {
                writeHead: (statusCode) => {
                    console.log(`Response Status: ${statusCode}`);
                    return res; 
                },
                end: () => {
                    console.log('Response ended.');
                }
            };

            if (notFirstRecord) {
                
                await postRoute.handler(req, res);
            } else {
                {}
            }
            
            notFirstRecord = true;

            
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    });
}


csvProcessor();
