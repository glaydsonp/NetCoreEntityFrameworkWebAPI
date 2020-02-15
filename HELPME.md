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
5 - Add NuGet EFCore, EFCore Tools, EF Design todos na mesma versão do netcore da 
6 - Instalar EF CLI
    * dotnet tool install --globl dotnet-ef
7 - Criar migration
    * dotnet ef migrations add InicialCreate -p .\Persistence\ -s .\API\
    * dotnet ef database update InitialCreate -p .\Persistence\



P.S: Propeties -> Data
P.S 2: Persistence -> Services