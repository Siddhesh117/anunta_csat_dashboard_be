import { DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from '../../config/sequelize';

class CSAT_Model extends Model<InferAttributes<CSAT_Model>, InferCreationAttributes<CSAT_Model>> {
    declare client_name: string;
    declare user_name: string;
    declare host_name: string;
    declare user_feedback: string;
    declare feedback_date: Date;
    declare user_comments: string;
    declare incident_number: string;
    declare last_action_taken_on: Date;
    declare action_status: string;
    declare delivery_group: string;
    declare customer_location: string;
    declare department: string;
}

CSAT_Model.init(
    {
        client_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        user_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        host_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        user_feedback: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        feedback_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        user_comments: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        incident_number: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        last_action_taken_on: {
            type: DataTypes.DATE,
            allowNull: false
        },
        action_status: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        delivery_group: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        customer_location: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        department: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'csat_sample',
        timestamps: false
    }
);

export default CSAT_Model;
