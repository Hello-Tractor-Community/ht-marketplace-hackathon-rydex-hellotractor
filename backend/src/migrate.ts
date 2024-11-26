import sequelize from "./config/db";

(async () => {
  await sequelize.authenticate();
  await sequelize.sync({
    alter: true,
  });
})()
  .then(() => {
    console.log(
      "\n\nPLEASE REMEMBER TO MAKE THE product.name COLUMN CASE INSENSITIVE , also do the same for category and subcategory so that the searches can work lol\n\n"
    );
    console.log("Migration successful. Exiting...");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    console.log("Migration failed");
    process.exit(1);
  });
