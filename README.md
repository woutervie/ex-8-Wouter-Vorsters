# ex-8-Wouter-Vorsters
Voor deze opdracht ben ik begonnen met de code van de ProberRequestNodeJs op luc-steffens-2014. Verder heb ik geen andere code van collega's gebruikt.

Moeilijkheid en oplossing: body bleek na een request undefined te zijn. Daardoor gaf mijn code een foutmelding wanneer ik het undefined object meegaf met JSON.parse()
Door validatie toe te passen op de statuscode van de response (Bron: https://www.npmjs.com/package/request) liep mijn code zonder errors door.

Wanneer ik elke statuscode weergaf in de console bleken er enkele 404's bij te zitten. Als ik vervolgens van de 404 gevallen de file_id opvroeg en deze in de browser probeerde op te halen, dan bleken deze inderdaad niet toegankelijk.

![Alt text](https://github.com/woutervie/ex-8-Wouter-Vorsters/blob/master/Debug%20404%20statuscode.PNG?raw=true "Debug 404 status code")



