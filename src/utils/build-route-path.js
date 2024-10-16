// /users/:id
export function buildRoutePath(path) {
    const routeParametersRegex = /:([a-zA-Z]+)/g
    // console.log(Array.from(path.matchAll(routeParametersRegex)))

    const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)')
    const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`) 
    

    return pathRegex
}



// explicando o const routeParametersRegex = /:([a-zA-Z]+)/g
// /users/:id

// a ideia é conseguir capturar parametros dinamicos(como :id)
// para criar uma regex usamos //, e pra definir que o parametro vai
// vir depois dos :, fica /:/
// depois, colocamos que isso tera letras de a-z minusculas e letras
// de a-z maiusculas, entao fica /:([a-zA-Z])/

// os parenteses criam um subgrupo, neste caso, o subgrupo seria id
// depois, queremos dizer que pode ter mais de uma letra maiuscula/minuscula,
//entao fica /:([a-zA-Z]+)/ (colocamos esse maizinho +)
// por ultimo, colocamos o g no final, que fica /:([a-zA-Z]+)/g,
// pois estamos dizendo que é uma regex global, entao ela nao vai
// procurar apenas o primeiro parametro dinamico, ela vai procurar
// todos!
// aquele ?<$1> colocado antes é para nomear as coisas. ou seja, se eu tenho
// users/:id, ele vai pegar o que vem depois dos dois pontos(neste caso, id,
// e vai usar isso para dar o nome ao grupo. entao no caso ficaria
// id: numeroqueeupassei. se minha rota tivesse mais um parametro, exemplo:
// /users/:id/group/:groupId, ele nomearia o id dinamico que passei como "id", 
// e  o id do grupo que eu passei como groupid, ou seja, exatamente o que eu colocar ali