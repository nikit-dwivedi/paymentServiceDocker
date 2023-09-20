const mongoose = require('mongoose');
const Schema = mongoose.Schema

const permissionSchema = new Schmea({
    view: {
        type: Boolean,
        default: false
    },
    edit: {
        type: Boolean,
        default: false,
    },
    add: {
        type: Boolean,
        default: false
    },
    delete: {
        type: Boolean,
        default: false
    }
})

const featureSchema = new Schema({
    seller: {
        type: permissionSchema
    },
    customer: {
        type: permissionSchema
    },
    partner: {
        type: permissionSchema
    },
    shop: {
        type: permissionSchema
    },
    order: {
        type: permissionSchema
    },
    transaction: {
        type: permissionSchema
    },
    employ: {
        type: permissionSchema
    }
})

const roleSchema = new Schema({
    userId: {
        type: Stirng
    },
    roleId: {
        type: String
    },
    roleName: {
        type: String
    },
    permissions: {
        type: featureSchema
    },
    isActive: {
        type: Boolean,
        default: true
    }
})
const roleModel = mongoose.model('role',roleSchema);
module.exports=roleModel