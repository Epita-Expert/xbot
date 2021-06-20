module.exports.test = {
    isGlobal: false,
    data: {
        "name": "test",
        "description": "Mieux vaut éviter d'exécuter cette commande...",
        "options": []
    },
    callback: ({ channel, options }) => {
        const test = {
            "content": "This is a message with components",
            "components": [
                {
                    "type": 1,
                    "components": [
                        {
                            "type": 2,
                            "label": "Click me!",
                            "style": 1,
                            "custom_id": "click_one"
                        }
                    ]

                }
            ]
        }
        channel.send(test)
        return test
    }
}