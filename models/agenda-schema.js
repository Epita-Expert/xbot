const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('xbot', process.env.DB_USER, process.env.DB_PWD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
});

const connect = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');
        await agendaSchema.sync({ alter: true });
        console.log('The database has been updated successfully.');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(-1);
    }
}

const agendaSchema = sequelize.define("xbotAgenda", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    msgId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    channelId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    guildId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subscribers: {
        type: Sequelize.STRING,
        allowNull: false,
        default: '',
        get() {
            return this.getDataValue('subscribers')?.split(';')
        },
        set(val) {
            this.setDataValue('subscribers',val.join(';'));
        },
    },
    send14: {
        type: DataTypes.BOOLEAN,
        default: '0'
    },
    send7: {
        type: DataTypes.BOOLEAN,
        default: '0'
    },
    send2: {
        type: DataTypes.BOOLEAN,
        default: '0'
    },
    send1: {
        type: DataTypes.BOOLEAN,
        default: '0'
    }
});

module.exports = {initDatabase: connect, agendaSchema: agendaSchema}
