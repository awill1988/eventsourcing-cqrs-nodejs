const Faker = require('faker');

function generateRandomData(userContext, events, done) {
  // generate data with Faker:
  let randomFirstName = Faker.name.firstName();
  let randomLastName = Faker.name.lastName();
  while (!/^\w+$/.test(randomLastName) || !/^\w+$/.test(randomFirstName)) {
    randomFirstName = Faker.name.firstName();
    randomLastName = Faker.name.lastName();
  }
  let randomPatchedFirstName = Faker.name.firstName();
  let randomPatchedLastName = Faker.name.lastName();
  while (!/^\w+$/.test(randomLastName) || !/^\w+$/.test(randomFirstName)) {
    randomPatchedFirstName = Faker.name.firstName();
    randomPatchedLastName = Faker.name.lastName();
  }
  // add variables to virtual user's context:
  userContext.vars.randomFirstName = randomFirstName;
  userContext.vars.randomLastName = randomLastName;
  userContext.vars.randomUsername = randomFirstName.toLowerCase();
  userContext.vars.randomPatchedFirstName = randomFirstName;
  userContext.vars.randomPatchedLastName = randomLastName;
  userContext.vars.randomPatchedUsername = randomFirstName.toLowerCase();
  // continue with executing the scenario:
  return done();
}

module.exports = {
  generateRandomData,
};
