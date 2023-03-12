const fs = require('fs/promises')
const { v4: uuidv4 } = require("uuid");
const path = require('path')
// const { nanoid } = require('nanoid')

const contactsPath = path.resolve("models", "contacts.json");

const listContacts = async() => {
    const contacts = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(contacts);
}

const getContactById = async(contactId) => {
  try {
    const contacts = await listContacts(contactsPath)
    return contacts.find(({ id }) => id === contactId)
  } catch (error) {
    console.log(error);
  }
}
const removeContact = async (contactId) => {
    const contacts = await listContacts(contactsPath);
    const contactsAfterRemove = contacts.findIndex(item => item.id === contactId);
    if (contactsAfterRemove === -1) {
      return null;
    }
  const [result] = contacts.splice(contactsAfterRemove, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2)) 
  return result;
  }

const addContact = async ({ name, email, phone }) => {
  try {
    const contacts = await listContacts(contactsPath);
    const newContact = {
      id: uuidv4(),
      name,
      email,
      phone
    };
  
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return newContact;
  } catch (error) {
    console.log(error);
  }
}
const updateContact = async(contactId, body) => {
    const contacts = await listContacts(contactsPath)
  const contactToUpdate = contacts.findIndex(item => item.id === contactId);
    if (contactToUpdate === -1) {
      return null
    }
  contacts[contactToUpdate] = {
    contactId, 
    ...body
  }
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
  return contacts[contactToUpdate];
}


module.exports = {
	listContacts,
	getContactById,
	removeContact,
  addContact,
  updateContact,
}
