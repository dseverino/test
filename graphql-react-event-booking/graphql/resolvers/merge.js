const DataLoader = require("dataloader");

const Horse = require("../../models/horse")
const User = require("../../models/user")

const horseLoader = new DataLoader(horseIds => {
  return horses(horseIds)
})

const userLoader = new DataLoader(userIds => {
  return User.find({ _id: { $in: userIds } })
})

const transformUser = (user) => {
  return {
    ...user._doc,
    _id: user.id,
    password: null,
    createdHorses: () => horseLoader.loadMany(user._doc.createdHorses)
  }
}

const user = async userId => {
  try {
    const user = await userLoader.load(userId.toString())
    return {
      ...user._doc,
      _id: user.id,
      password: null,
      createdHorses: () => horseLoader.loadMany(user._doc.createdHorses)
    }
  }
  catch (err) {
    throw err
  }
}

const singleHorse = async horseId => {
  try {
    const horse = await horseLoader.load(horseId.toString())
    return horse
  }
  catch (err) {
    throw err
  }
}

const horses = async horseIds => {  
  try {
    const horses = await Horse.find({ _id: { $in: horseIds } })
    horses.sort((a, b) => {
      return (
        horseIds.indexOf(a._id.toString()) - horseIds.indexOf(b._id.toString())
      );
    });    
    return horses.map(horse => {
      return transformHorse(horse)
    })
  }
  catch (err) {
    throw err
  }
}

const transformHorse = horse => {  
  return {
    ...horse._doc,
    _id: horse.id,
    //date: new Date(horse._doc.date).toISOString(),
    name: horse.name,
    weight: horse.weight,
    birth: horse.birth,
    color: horse.color,
    sex: horse.sex,
    sire: horse.sire,
    dam: horse.dam,
    stable: horse.stable
  }
}

const transformBooking = booking => {
  return {
    ...booking,
    _id: booking.id,
    user: user.bind(this, booking.user.toString()),
    horse: singleHorse.bind(this, booking.horse),
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString()
  }
}

exports.transformBooking = transformBooking
exports.transformHorse = transformHorse
exports.transformUser = transformUser