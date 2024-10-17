// import assert from 'node:assert';
// // import { generate } from 'csv-generate';
// const fs = require('fs');
// import { parse } from 'csv-parse';
// import { resolve } from 'path';


// const csvFilePath = resolve('./tasksCsv.csv');


// (async () => {
// //   Initialise the parser by generating random records
// //   const parser = generate({
// //     high_water_mark: 64 * 64,
// //     length: 10
// //   }).pipe(
// //     parse()
// //   );

//     fs.readFile(csvFilePath, 'utf8', (err, data) => {
//         if (err) {
//         console.error('Erro ao ler o arquivo CSV:', err);
//         return;
//         }
//     const parser = tasksCsv.pipe(
//         parse()
//     );
//   // Intialise count
//   let count = 0;
//   // Report start
//   process.stdout.write('start\n');
//   // Iterate through each records
//   for await (const record of parser) {
//     // Report current line
//     console.log(record)
//     process.stdout.write(`${count++} ${record.join(',')}\n`);
//     // Fake asynchronous operation
//     await new Promise((resolve) => setTimeout(resolve, 100));
//   }
//   // Report end
//   process.stdout.write('...done\n');
//   // Validation
//   assert.strictEqual(count, 10);
// }})();


import fs from 'fs';
import assert from 'node:assert';
import { parse } from 'csv-parse';
import { resolve } from 'path';
import { createReadStream } from 'fs'; 

const csvFilePath = resolve('./tasksCsv.csv');

(async () => {
    // Inicializa o contador aqui, em um escopo mais amplo
    let count = 0;

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
            // Reporta a linha atual
            console.log(record);
            process.stdout.write(`${count++} ${record.join(',')}\n`);
            // Operação assíncrona fictícia
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        // Reporta o fim após a iteração
        process.stdout.write('...done\n');

        // Validação
        assert.strictEqual(count, 6); // Ajuste conforme necessário
    });
})();
