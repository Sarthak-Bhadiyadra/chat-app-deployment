import { nsql_db } from '../../../Utils/Database/db.client';

export const seedUsers = async () => {
    const findSuperAdmin = await nsql_db.user.findFirst({
        where: {
            email: "superadmin@mailinator.com"
        }
    })
    if (!findSuperAdmin) {
        const createSuperAdmin = await nsql_db.user.create({
            data: {
                email: "superadmin@mailinator.com",
                password: "weblight",
                city: "ahmedabad",
                first_name: "weblight",
                last_name: 'solution',
                phone_no: '98562311',
                state: 'gujarat',
                role_sc: "ADMIN"
            }
        })
    }

    const findUSer = await nsql_db.user.findFirst({
        where: {
            email: "sarthakb@mailinator.com"
        }
    })
    if (!findSuperAdmin) {
        const createUser = await nsql_db.user.create({
            data: {
                email: "sarthakb@mailinator.com",
                password: "sarthak",
                city: "ahmedabad",
                first_name: "sarthak",
                last_name: 'bhadiyadra',
                phone_no: '98562311',
                state: 'gujarat',
                role_sc: "USER"
            }
        })
    }

};
