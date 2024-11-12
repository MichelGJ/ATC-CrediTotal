db = db.getSiblingDB('atc_creditotal');

db.createCollection('roles');

roles =
    [
        {
            "_id": ObjectId("67166df022b7bcae46e4c7e2"),
            "nombre": "ADMIN",
            "permisos": [
                "usuarios",
                "incidencias",
                "atp",
                "gestionIncidencias", 
                "reportar",
                "listaTickets",
                "closeTicket"
            ]
        },
        {
            "_id": ObjectId("67166e4522b7bcae46e4c7e5"),
            "nombre": "ATP+",
            "permisos": [
                "incidencias",
                "atp",
                "gestionIncidencias",
                "reportar",
                "listaTickets"
            ]
        },
        {
            "_id": ObjectId("67334cc91028a1f37f1bfb8c"),
            "nombre": "ATP",
            "permisos": [
                "atp"
            ]
        },
        {
            "_id": ObjectId("6733590f1028a1f37f1bfb8d"),
            "nombre": "ATC+",
            "permisos": [
                "incidencias",
                "gestionIncidencias",
                "reportar",
                "listaTickets",
                "closeTicket"
            ]
        },
        {
            "_id": ObjectId("673359e91028a1f37f1bfb8e"),
            "nombre": "ATC",
            "permisos": [
                "incidencias",
                "reportar",
                "listaTickets",
                "closeTicket"
            ]
        },
        {
            "_id":ObjectId("67335a5e1028a1f37f1bfb8f"),
            "nombre": "REPORT",
            "permisos": [
                "incidencias",
                "reportar"
            ]
        }
    ]
db.roles.insertMany(roles);

db.createCollection('users');

user = {
        "_id": ObjectId("670fff95e53b9fb1a5f8ad8b"),
        "name": "Michel Jraiche",
        "email": "mjraiche@totalmundo.com",
        "password": "$2a$10$tDUyypdB8S8OAqZWzex05OLFGKP6XB0m8cBMgCSy542czFEt26vBS", //bPmVRH93GNtvCJy
        "role": {
          "$oid": "67166df022b7bcae46e4c7e2"
        },
        "__v": 0,
        "cedula": "20977974" 
}

