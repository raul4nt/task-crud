import http from 'node:http'
import { json } from './middlewares/json.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query-params.js'


const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)
  
  const route = routes.find(route => {
    // esse "test" é uma funçao que as regex tem
    // ele retorna booleano. neste caso, se a url tiver certo,
    // retornara true. caso contrario, false.
    console.log(route)
    
    // console.log(route.path.test(url))
    return route.method == method && route.path.test(url)
    
  })

  if (route) {

    const routeParams = req.url.match(route.path)
    
    // console.log(extractQueryParams(routeParams.groups.query))

    const { query, ...params } = routeParams.groups
    
    req.params = params 
    req.query = query ? extractQueryParams(query) : {}
    //é usado o { ... } para tirar aquele "Object null prototype"
    // que fica aparecendo junto quando printamos os groups

    return route.handler(req, res)
  }

  return res.writeHead(404).end('Not found')
})

server.listen(3335)