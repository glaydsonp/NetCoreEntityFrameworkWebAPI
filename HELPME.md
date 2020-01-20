1 - Criar classlib para app, domain, persistance
    * dotnet new classlib -n NOME_LIB
2 - Criar webapi api
    * dotnet new webapi -n NOME_API
3 - Adicionar as soluções
    * dotnet sln add PATH_PROJECT
4 - Adicionar dependencias aos projetos
    * App -> Domain, Persistence
    * API -> App
    * Persistence -> Domain
    * dotnet add reference PATH_PROJECT
5 - 