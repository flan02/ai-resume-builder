import { db } from "@/db"


export async function loggedAsAdmin(email: string) {
  //console.log("loggedAsAdmin", id);
  try {
    const isAdmin = await db.user.findFirst({
      where: {
        email
      }
    })

    //console.log('isAdmin', isAdmin);
    if (!isAdmin) return null

    return isAdmin
  } catch (error) {
    console.error("We found the following error: ", error)
    return null
  }
}


export async function createUser(name: string, email: string, image: string) {
  try {
    const newUser = await db.user.create({
      data: {
        name,
        email,
        image
      }

    })
    return true
  } catch (error) {
    console.error("We found an error creating this new user: ", error)
    return { message: "We found an error creating this new user", status: 500 }
  }

}