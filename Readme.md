## Thoughtful Severless Backend Challenge
This is my backend architecture and solution for the serverless backend.
If I had more time, I would clean up the code a bit more, and seperate the password gen into its own service.
I would also delete the password once it was used. I was finding it a bit tricky to navigate Node.js with modules.exports.
This caused me to have to use "async" on the lambdas that I wanted to return an important message to the front end.

I am a bit rusty with Node.js since Ive mostly been doing backend work in python, so you may see a bit of that in the code.
Ideally I would have a better layout of controllers, services, and helpers. While also async/ awaiting in a better fashion. I was 
doing the best I could with limited time to brush the rust off!

This is my first time using serverless. I'm sure the policies/Cors/ Etc can be more specifically specified
to give least access that is needed. I opted for speed as it took a bit to learn the serverless syntax so I left it all mostly open for the services that needed
permissions. 

## Author
Branden LaCour


## Sidenote
Simliar to the FE, I have past api projects in my github repo.