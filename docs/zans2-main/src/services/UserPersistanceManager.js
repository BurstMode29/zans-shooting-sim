import {StoreData, ReadData, FromJSON, ToJSON} from  './StorageManager';

export async function StoreUser(user) {
    const userList = await GetUsers()
    console.log(userList)
    const isParent = userList == null
    user["isParent"] = isParent;
    console.log(user);
    var email = user['email']
    await StoreData(email, user)
    await UpdateUsers(email, user['name'])
}

export async function UpdateUsers(email, name) {
    var userList = await GetUsers();
    if (userList == null) {
        userList = []
    }
    userList.push({"email" : email, "name" : name})
    await StoreData('users', userList);
}

export async function GetUser(email) {
    const result = await ReadData(email)
    return result
}

export async function GetUsers() {
    const result = await ReadData('users')
    return result
}