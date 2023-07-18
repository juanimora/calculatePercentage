const swaggerDocumentation = {
    openapi: "3.0.3",
    info: {
        title: "Calculadora API",
        version: "0.0.1",
        description: "Esta es una API de una calculadora"
    },
    
    servers: [
        {
            url: "http://localhost:3000",
            description: "Local Dev"

        },
    ],
    
    tags: [
        {
            name: "Porcentaje",
            description: "Calculadora de porcentaje"
        },

        {
            name: "Diferencia entre dos fechas",
            description: "Calculadora de dias"
        },
    ],

    paths: {
        "/percentage": {
            post: {
                tags: ["Porcentaje"],
                description: "Calcula porcentaje entre dos numeros",
                responses: {
                    200:{
                        description: "OK",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    example: {"result":20},
                                },
                            },
                        },
                    },
                },
            },
        } ,
        "/dateDifference": {
            post: {
                tags: ["Diferencia entre dos fechas"],
                description: "Calcula la diferencia en dias entre dos fechas",
                responses: {
                    200:{
                        description: "OK",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    example: {"differenceInDays":9},
                                },
                            },
                        },
                    },
                },
            },
        } ,
    },
};

module.exports = swaggerDocumentation;