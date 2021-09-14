module.exports = {
    isGlobal: false,
    guilds: ["761233808645029888"],
    data: {
        "name": "reglement",
        "description": "Affiche le règlement du Discord",
        "options": []
    },
    execute: async ({interaction}) => {
        await interaction.reply({
            "content": "Voici quelques règles et éléments nécessaires à la bienséance :",
            "embeds": [
                {
                    "title": "Règlement du Discord  📜",
                    "description": "Merci de lire et d'approuver le règlement ci-dessous afin que ce serveur reste un endroit civilisé et agréable. Ce règlement est susceptible d'évoluer, merci de le consulter régulièrement. **Toute arrivée et participation dans ce serveur implique un consentement tacite du présent règlement.**",
                    "color": 7182803,
                    "fields": [
                        {
                            "name": "1. Conduite",
                            "value": "Les règles de comportement sont pour la plupart des règles de bon sens, il existe cependant des pratiques prohibées.\n**Sont interdits sur ce discord :**\n- insultes, incitations à la haine, propos racistes ou discriminatoires, pornographique ou sexuel, etc.\n- le spam ou toute forme de pishing, fishing et autres techniques illégales\n- les critiques non constructives ayant comme seul but de blesser ou diffamer\n- l'usurpation d'identité ou la diffusion de fake news\n- la publication de contenus dans un salon inadapté\n- la publicité tierce excessive\n**À noter également :**\n- Soyez respectueux et tolérant\n- Être doté de dérision et de second degré est recommandé\n- Faites un minimum attention à l'orthographe et au bon usage de la langue française\n- Les @mentions doivent être utilisées avec parcimonie\n- Des dérogations à certains points du règlement peuvent être exceptionnellement appliqués et notifiés par les gestionnaires du serveur tant qu'ils ne sont font pas au détriment d'une tierce personne/entité"
                        },
                        {
                            "name": "2. Utilisation",
                            "value": "- Respecter l'usage dédié des salons (images, discussion, discussion textuelle en vocal, etc.)\n- Des rôles peuvent être appliqués arbitrairement à certains membres, vous pouvez bien évidemment les contester ou proposer une amélioration\n- Le bot xBot est présent sur le serveur et est mis à jour régulièrement. Pour voir les commandes disponibles, il suffit de taper \"/\" *slash* et se référer à l'interface Discord.\n- Les commandes ne doivent pas obligatoirement être utilisées dans le salon <#761630611144048651> hormis pour le bot musical."
                        },
                        {
                            "name": "3. DISCLAIMER",
                            "value": "Ce serveur n'est pas un serveur de promotion officiel de l'EPITA, il est donc plus informel et ne contient pas de salons d'annonces officielles. Pour plus d'informations sur les serveurs Discord officiels EPITA et les liens utiles, consultez le salon <#883404852900798484>."
                        }
                    ],
                    "footer": {
                        "text": "Mis à jour le 03/09/2021."
                    }
                }
            ]
        })
    }
}